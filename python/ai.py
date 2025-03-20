#!/usr/bin/env python3
"""
Praxus AI Backend
This script handles various AI operations for the Praxus application.
"""

import sys
import json
import os
import datetime
import argparse
import sqlite3
import requests
import uuid
from typing import Dict, List, Any, Optional
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get Mistral API key from environment variables
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")
if not MISTRAL_API_KEY:
    print("Warning: MISTRAL_API_KEY environment variable not set", file=sys.stderr)

# Set up database path
DB_PATH = os.path.join(os.path.dirname(__file__), "praxus.db")

# Mistral API configuration
MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions"
MISTRAL_MODEL = "mistral-tiny"  # Can be adjusted based on needs: mistral-tiny, mistral-small, mistral-medium

def setup_database():
    """Create database and tables if they don't exist"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Create tasks table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        estimated_time INTEGER,
        importance INTEGER,
        deadline TEXT,
        completed INTEGER DEFAULT 0,
        category TEXT,
        created_at TEXT,
        updated_at TEXT
    )
    ''')
    
    # Create chat history table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS chat_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL,
        sender TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        session_id TEXT NOT NULL
    )
    ''')
    
    # Create schedule blocks table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS schedule_blocks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        task_id TEXT,
        start_time TEXT NOT NULL,
        end_time TEXT NOT NULL,
        FOREIGN KEY (task_id) REFERENCES tasks (id)
    )
    ''')
    
    conn.commit()
    conn.close()
    
def get_chat_history(session_id="default", limit=10):
    """Get recent chat history for context"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute(
        "SELECT content, sender FROM chat_messages WHERE session_id = ? ORDER BY timestamp DESC LIMIT ?",
        (session_id, limit)
    )
    
    # Reverse to get chronological order
    messages = cursor.fetchall()
    messages.reverse()
    
    conn.close()
    
    # Format for Mistral API
    formatted_messages = []
    for content, sender in messages:
        role = "user" if sender == "user" else "assistant"
        formatted_messages.append({"role": role, "content": content})
    
    # Add system message if there's no history
    if not formatted_messages:
        formatted_messages.append({
            "role": "system", 
            "content": "You are Praxus, a helpful AI assistant for productivity and task management. Be concise, helpful, and friendly."
        })
        
    return formatted_messages

def generate_ai_response(message, session_id="default"):
    """Generate response using Mistral API"""
    if not MISTRAL_API_KEY:
        return "Error: Mistral API key not configured. Please set the MISTRAL_API_KEY environment variable."
    
    # Get chat history for context
    messages = get_chat_history(session_id)
    
    # Add the new user message
    messages.append({"role": "user", "content": message})
    
    try:
        # Make request to Mistral API
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {MISTRAL_API_KEY}"
        }
        
        payload = {
            "model": MISTRAL_MODEL,
            "messages": messages,
            "temperature": 0.7,
            "max_tokens": 1000
        }
        
        response = requests.post(
            MISTRAL_API_URL,
            headers=headers,
            json=payload
        )
        
        if response.status_code != 200:
            error_msg = f"API Error: {response.status_code} - {response.text}"
            print(error_msg, file=sys.stderr)
            return f"I'm sorry, I encountered an error: {error_msg}"
        
        response_data = response.json()
        ai_message = response_data["choices"][0]["message"]["content"]
        
        return ai_message
        
    except Exception as e:
        error_msg = str(e)
        print(f"Error calling Mistral API: {error_msg}", file=sys.stderr)
        return f"I'm sorry, I encountered an error while processing your request: {error_msg}"

def handle_chat(data: Dict[str, Any]) -> Dict[str, Any]:
    """Handle chat messages"""
    message = data.get('message', '')
    session_id = data.get('session_id', 'default')
    
    # Save message to database
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    timestamp = datetime.datetime.now().isoformat()
    
    cursor.execute(
        "INSERT INTO chat_messages (content, sender, timestamp, session_id) VALUES (?, ?, ?, ?)",
        (message, "user", timestamp, session_id)
    )
    conn.commit()
    
    # Generate AI response using Mistral
    response = generate_ai_response(message, session_id)
    
    # Save response to database
    cursor.execute(
        "INSERT INTO chat_messages (content, sender, timestamp, session_id) VALUES (?, ?, ?, ?)",
        (response, "ai", timestamp, session_id)
    )
    conn.commit()
    conn.close()
    
    return {
        "text": response,
        "timestamp": timestamp
    }

def handle_tasks(data: Dict[str, Any]) -> Dict[str, Any]:
    """Handle task-related operations"""
    action = data.get('action', '')
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    if action == 'get':
        cursor.execute("SELECT * FROM tasks")
        columns = [col[0] for col in cursor.description]
        tasks = [dict(zip(columns, row)) for row in cursor.fetchall()]
        conn.close()
        return tasks
    
    elif action == 'create':
        task = data.get('task', {})
        task_id = task.get('id', str(uuid.uuid4()))
        now = datetime.datetime.now().isoformat()
        
        cursor.execute(
            "INSERT INTO tasks (id, name, description, estimated_time, importance, deadline, category, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (
                task_id,
                task.get('name', ''),
                task.get('notes', ''),
                task.get('estimatedTime', 0),
                task.get('importance', 3),
                task.get('deadline', None),
                task.get('category', 'work'),
                now,
                now
            )
        )
        conn.commit()
        
        # Get the inserted task
        cursor.execute("SELECT * FROM tasks WHERE id = ?", (task_id,))
        columns = [col[0] for col in cursor.description]
        created_task = dict(zip(columns, cursor.fetchone()))
        conn.close()
        return created_task
    
    elif action == 'update':
        task_id = data.get('taskId', '')
        updates = data.get('updates', {})
        set_clauses = []
        params = []
        
        for key, value in updates.items():
            # Convert camelCase to snake_case for database columns
            if key == 'estimatedTime':
                set_clauses.append('estimated_time = ?')
            elif key == 'notes':
                set_clauses.append('description = ?')
            else:
                set_clauses.append(f"{key} = ?")
            params.append(value)
        
        set_clauses.append('updated_at = ?')
        params.append(datetime.datetime.now().isoformat())
        params.append(task_id)
        
        cursor.execute(
            f"UPDATE tasks SET {', '.join(set_clauses)} WHERE id = ?",
            params
        )
        conn.commit()
        
        # Get the updated task
        cursor.execute("SELECT * FROM tasks WHERE id = ?", (task_id,))
        columns = [col[0] for col in cursor.description]
        updated_task = dict(zip(columns, cursor.fetchone()))
        conn.close()
        return updated_task
    
    else:
        conn.close()
        return {"error": f"Unknown task action: {action}"}

def handle_planning(data: Dict[str, Any]) -> Dict[str, Any]:
    """Handle planning and scheduling operations"""
    action = data.get('action', '')
    
    if action == 'optimize':
        tasks = data.get('tasks', [])
        
        # Sort tasks by importance and deadline
        sorted_tasks = sorted(
            tasks, 
            key=lambda t: (
                not t.get('completed', False),  # Uncompleted first
                -t.get('importance', 0),        # Higher importance first
                t.get('deadline', '9999-12-31') # Earlier deadline first
            )
        )
        
        # Create time blocks (simple algorithm)
        now = datetime.datetime.now()
        start_time = datetime.datetime(now.year, now.month, now.day, 9, 0, 0)  # Start at 9 AM
        schedule = []
        
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Clear existing schedule
        cursor.execute("DELETE FROM schedule_blocks")
        conn.commit()
        
        for task in sorted_tasks:
            if task.get('completed', False):
                continue
                
            # Calculate end time based on estimated time
            estimated_minutes = task.get('estimatedTime', 30)
            end_time = start_time + datetime.timedelta(minutes=estimated_minutes)
            
            block = {
                "taskId": task.get('id', ''),
                "startTime": start_time.isoformat(),
                "endTime": end_time.isoformat()
            }
            schedule.append(block)
            
            # Add to database
            cursor.execute(
                "INSERT INTO schedule_blocks (task_id, start_time, end_time) VALUES (?, ?, ?)",
                (task.get('id', ''), start_time.isoformat(), end_time.isoformat())
            )
            
            # Add 15-minute break after tasks longer than 45 minutes
            if estimated_minutes > 45:
                start_time = end_time + datetime.timedelta(minutes=15)
            else:
                start_time = end_time
        
        conn.commit()
        conn.close()
        
        return {
            "schedule": schedule
        }
    
    else:
        return {"error": f"Unknown planning action: {action}"}

def main():
    """Main entry point for the script"""
    # Setup database
    setup_database()
    
    parser = argparse.ArgumentParser(description='Praxus AI Backend')
    parser.add_argument('mode', choices=['chat', 'tasks', 'planning'], help='Operation mode')
    parser.add_argument('data', help='JSON data or string input')
    
    args = parser.parse_args()
    
    try:
        # Parse input data
        if args.mode == 'chat':
            # For chat, we might receive a simple string or JSON object
            try:
                data = json.loads(args.data)
            except json.JSONDecodeError:
                # If it's not valid JSON, treat it as a message string
                data = {"message": args.data}
                
            result = handle_chat(data)
            
        elif args.mode in ['tasks', 'planning']:
            # These modes expect JSON data
            data = json.loads(args.data)
            
            if args.mode == 'tasks':
                result = handle_tasks(data)
            else:  # planning
                result = handle_planning(data)
        
        # Output as JSON
        print(json.dumps(result))
        
    except Exception as e:
        error_msg = {"error": str(e)}
        print(json.dumps(error_msg), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
