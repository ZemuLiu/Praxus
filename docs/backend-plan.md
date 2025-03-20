# Praxus Backend Implementation Plan

## Phase 1: Basic Backend Setup
1. Create Python Backend Structure
```
python/
├── ai.py              # Main AI logic
├── config/           # Configuration files
├── models/           # Data models
├── services/         # Business logic
│   ├── chat.py      # Chat handling
│   ├── tasks.py     # Task management
│   └── planning.py   # Day planning
└── utils/           # Utility functions
```

2. Set up Dependencies
```python
# requirements.txt
fastapi==0.104.1
uvicorn==0.24.0
langchain==0.0.350
python-dotenv==1.0.0
pydantic==2.5.2
sqlalchemy==2.0.23
```

## Phase 2: Core Features Implementation

### 1. Database Setup
- SQLite for local storage
- Tables for:
  - Tasks
  - Chat history
  - User preferences
  - Schedule blocks

### 2. AI Integration
- Implement LangChain for:
  - Chat processing
  - Task analysis
  - Schedule optimization
  - Day planning suggestions

### 3. API Endpoints
```python
# Core endpoints needed
/api/v1/
├── chat/
│   ├── POST /send       # Send message
│   └── GET /history     # Get chat history
├── tasks/
│   ├── GET /           # List tasks
│   ├── POST /          # Create task
│   └── PUT /{id}       # Update task
└── planning/
    ├── POST /optimize  # Optimize schedule
    └── GET /schedule   # Get daily schedule
```

## Phase 3: Integration Steps

1. Update Electron Configuration
```javascript
// main.js modifications
const isDev = process.env.NODE_ENV === 'development';
const pythonPath = isDev ? 
  path.join(__dirname, 'python/venv/bin/python') : 
  path.join(process.resourcesPath, 'python/python');
```

2. Setup Python Environment Handler
```javascript
// pythonManager.js
class PythonManager {
  async startServer() {
    // Start FastAPI server
  }
  
  async stopServer() {
    // Cleanup
  }
}
```

3. Frontend Integration
```typescript
// src/lib/api.ts
export const api = {
  async chat(message: string) {
    return await window.electronAPI.callPraxus('chat', message);
  },
  async optimizeSchedule(tasks: Task[]) {
    return await window.electronAPI.callPraxus('optimize', tasks);
  }
};
```

## Immediate Action Items

1. Create Python Environment
```bash
python -m venv python/venv
source python/venv/bin/activate  # or activate.bat on Windows
pip install -r requirements.txt
```

2. Initial Backend Structure
```python
# python/ai.py
from fastapi import FastAPI
from langchain.llms import OpenAI
from langchain.chains import ConversationChain

app = FastAPI()

@app.post("/api/v1/chat/send")
async def process_message(message: str):
    # Implement chat logic
    pass

@app.post("/api/v1/planning/optimize")
async def optimize_schedule(tasks: list):
    # Implement schedule optimization
    pass
```

3. Database Schema
```python
# python/models/schema.py
from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True)
    title = Column(String)
    description = Column(String)
    due_date = Column(DateTime)
    # Add other necessary fields
```