"use client"

import type React from "react"
// Remove the import statement for MistralClient
// import { MistralClient } from "mistral-api-client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Send,
  Mic,
  Image,
  User,
  Bot,
  Calendar,
  Clock,
  BarChart3,
  Plus,
  X,
  Check,
  ChevronRight,
  Home,
  Settings,
  MessageSquare,
  CalendarClock,
  Zap,
  PlusCircle,
  Search,
  BellRing,
  LayoutGrid,
  Maximize2,
  Minimize2,
  DoorClosedIcon as Close,
  Moon,
  Sun,
} from "lucide-react"

// Remove the initialization of Mistral API client
// const mistral = new MistralClient(process.env.MISTRAL_API_KEY!)

// Define the FloatingPaths component
function FloatingPaths({
  position,
  opacity = 0.8,
  darkMode = false,
}: { position: number; opacity?: number; darkMode?: boolean }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    color: `rgba(15,23,42,${0.1 + i * 0.03})`,
    width: 0.5 + i * 0.03,
  }))

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ opacity }}>
      <svg
        className={`w-full h-full ${darkMode ? "text-blue-400" : "text-black/30"}`}
        viewBox="0 0 696 316"
        fill="none"
      >
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.1 + path.id * 0.03}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.3, 0.6, 0.3],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  )
}

// Add a TiltCard component for the mouse tilt effect
interface TiltCardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void  // Add onClick as an optional prop
}

export function TiltCard({ children, className = "", onClick }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({})

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const card = cardRef.current
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const tiltX = (y - centerY) / 10
    const tiltY = (centerX - x) / 10

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`,
      transition: "transform 0.1s ease",
    })
  }

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)",
      transition: "transform 0.5s ease",
    })
  }

  return (
    <div
      ref={cardRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}  // Add onClick handler
      style={tiltStyle}
    >
      {children}
    </div>
  )
}

interface Message {
  id: number
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

interface ChatSession {
  id: number
  name: string
  messages: Message[]
  lastActive: Date
}

interface Task {
  id: number
  name: string
  estimatedTime: number // in minutes
  importance: 1 | 2 | 3 | 4 | 5
  deadline?: Date
  notes?: string
  completed: boolean
  category?: "work" | "personal" | "health" | "learning"
}

interface TimeBlock {
  id: number
  taskId: number
  startTime: Date
  endTime: Date
}

// Update the main component to include all the requested changes
export default function PraxusDesktop() {
  const [darkMode, setDarkMode] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"home" | "chat" | "planning" | "settings">("chat")
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: 1,
      name: "General Chat",
      messages: [
        {
          id: 1,
          content: "Hello! I'm Praxus, your AI assistant. How can I help you today?",
          sender: "ai",
          timestamp: new Date(),
        },
      ],
      lastActive: new Date(),
    },
    {
      id: 2,
      name: "Project Planning",
      messages: [],
      lastActive: new Date(Date.now() - 3600000),
    },
    {
      id: 3,
      name: "Research Ideas",
      messages: [],
      lastActive: new Date(Date.now() - 7200000),
    },
  ])
  const [activeChatId, setActiveChatId] = useState(1)
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [chatSidebarCollapsed, setChatSidebarCollapsed] = useState(false)

  // Add user profile state
  const [userProfile] = useState({
    name: "Alex Johnson",
    email: "alex@example.com",
    avatar: "AJ",
    role: "Premium User",
    lastLogin: new Date(),
  })

  // Add dashboard stats
  const [dashboardStats] = useState({
    totalChats: 24,
    completedTasks: 18,
    pendingTasks: 7,
    productivity: 78, // percentage
    recentActivity: [
      { id: 1, type: "chat", title: "Research on AI", time: new Date(Date.now() - 3600000 * 2) },
      { id: 2, type: "task", title: "Team Meeting", time: new Date(Date.now() - 3600000 * 5) },
      { id: 3, type: "chat", title: "Project Planning", time: new Date(Date.now() - 3600000 * 8) },
      { id: 4, type: "task", title: "Documentation Update", time: new Date(Date.now() - 3600000 * 24) },
    ],
  })

  // Planning state
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, name: "Review project proposal", estimatedTime: 45, importance: 4, completed: false, category: "work" },
    {
      id: 2,
      name: "Team meeting",
      estimatedTime: 60,
      importance: 5,
      deadline: new Date(Date.now() + 3600000),
      completed: false,
      category: "work",
    },
    { id: 3, name: "Update documentation", estimatedTime: 90, importance: 3, completed: false, category: "work" },
    { id: 4, name: "Workout session", estimatedTime: 45, importance: 4, completed: false, category: "health" },
    { id: 5, name: "Read research paper", estimatedTime: 60, importance: 3, completed: false, category: "learning" },
    { id: 6, name: "Call family", estimatedTime: 30, importance: 4, completed: false, category: "personal" },
  ])
  const [newTask, setNewTask] = useState<Partial<Task>>({
    name: "",
    estimatedTime: 30,
    importance: 3,
    category: "work",
  })
  const [showAddTask, setShowAddTask] = useState(false)
  const [optimizedSchedule, setOptimizedSchedule] = useState<boolean>(false)
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    // Add user message
    const newUserMessage: Message = {
      id: Date.now(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setChatSessions((prevSessions) =>
      prevSessions.map((session) =>
        session.id === activeChatId
          ? {
              ...session,
              messages: [...session.messages, newUserMessage],
              lastActive: new Date(),
            }
          : session,
      ),
    )
    setInputValue("")

    // Simulate AI typing
    setIsTyping(true)

    try {
      // Call Python backend for AI response
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: inputValue, session_id: activeChatId.toString() }),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`)
      }

      const data = await response.json()

      const aiResponse: Message = {
        id: Date.now() + 1,
        content: data.text.trim(),
        sender: "ai",
        timestamp: new Date(data.timestamp),
      }

      setChatSessions((prevSessions) =>
        prevSessions.map((session) =>
          session.id === activeChatId ? { ...session, messages: [...session.messages, aiResponse] } : session,
        ),
      )
    } catch (error) {
      console.error("Error fetching AI response:", error)
    } finally {
      setIsTyping(false)
    }
  }

  const handleAddTask = () => {
    if (!newTask.name) return

    const task: Task = {
      id: tasks.length + 1,
      name: newTask.name,
      estimatedTime: newTask.estimatedTime || 30,
      importance: (newTask.importance as 1 | 2 | 3 | 4 | 5) || 3,
      deadline: newTask.deadline,
      notes: newTask.notes,
      completed: false,
      category: (newTask.category as "work" | "personal" | "health" | "learning") || "work",
    }

    setTasks([...tasks, task])
    setNewTask({
      name: "",
      estimatedTime: 30,
      importance: 3,
      category: "work",
    })
    setShowAddTask(false)
    setOptimizedSchedule(false)
  }

  const toggleTaskCompletion = (id: number) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
    setOptimizedSchedule(false)
  }

  const optimizeSchedule = () => {
    // Simulate AI optimization with a loading state
    setOptimizedSchedule(true)

    // In a real app, you would call an AI service here
    // For now, we'll just create a simulated schedule
    setTimeout(() => {
      const sortedTasks = [...tasks].sort((a, b) => {
        // First sort by completion
        if (a.completed !== b.completed) return a.completed ? 1 : -1

        // Then by importance (higher first)
        if (a.importance !== b.importance) return b.importance - a.importance

        // Then by deadline if exists
        if (a.deadline && b.deadline) return a.deadline.getTime() - b.deadline.getTime()
        if (a.deadline) return -1
        if (b.deadline) return 1

        // Finally by estimated time (shorter first)
        return a.estimatedTime - b.estimatedTime
      })

      setTasks(sortedTasks)

      // Create time blocks for the schedule
      const now = new Date()
      let currentStartTime = new Date(now)
      currentStartTime.setHours(9, 0, 0, 0) // Start at 9 AM

      const newTimeBlocks: TimeBlock[] = []

      sortedTasks
        .filter((task) => !task.completed)
        .forEach((task) => {
          const endTime = new Date(currentStartTime.getTime() + task.estimatedTime * 60000)

          newTimeBlocks.push({
            id: newTimeBlocks.length + 1,
            taskId: task.id,
            startTime: new Date(currentStartTime),
            endTime: new Date(endTime),
          })

          // Add a 15-minute break after tasks longer than 45 minutes
          if (task.estimatedTime > 45) {
            currentStartTime = new Date(endTime.getTime() + 15 * 60000)
          } else {
            currentStartTime = new Date(endTime)
          }
        })

      setTimeBlocks(newTimeBlocks)
    }, 1500)
  }

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case "work":
        return "border-blue-400"
      case "personal":
        return "border-purple-400"
      case "health":
        return "border-green-400"
      case "learning":
        return "border-yellow-400"
      default:
        return "border-gray-400"
    }
  }

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case "work":
        return <LayoutGrid size={12} className="mr-1" />
      case "personal":
        return <User size={12} className="mr-1" />
      case "health":
        return <Zap size={12} className="mr-1" />
      case "learning":
        return <BellRing size={12} className="mr-1" />
      default:
        return <LayoutGrid size={12} className="mr-1" />
    }
  }

  const formatTimeBlock = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const addNewChatSession = () => {
    const newSession: ChatSession = {
      id: chatSessions.length + 1,
      name: `New Chat ${chatSessions.length + 1}`,
      messages: [],
      lastActive: new Date(),
    }
    setChatSessions([...chatSessions, newSession])
    setActiveChatId(newSession.id)
  }

  const activeChat = chatSessions.find((session) => session.id === activeChatId)
  const messages = activeChat?.messages || []

  // Update the return statement to include all the new UI elements
  return (
    <div
      className={`relative min-h-screen w-full flex flex-col overflow-hidden ${
        darkMode ? "bg-gradient-to-b from-gray-900 to-gray-950" : "bg-gradient-to-b from-white to-gray-50"
      }`}
    >
      <div className="absolute inset-0">
        <FloatingPaths position={1} opacity={0.7} darkMode={darkMode} />
        <FloatingPaths position={-1} opacity={0.7} darkMode={darkMode} />
      </div>

      {/* Window frame - for desktop app */}
      <div
        className={`relative z-10 flex items-center justify-between p-2 ${
          darkMode ? "bg-gray-900 border-gray-800" : "bg-white/80 backdrop-blur-sm border-gray-200"
        } border-b shadow-md`}
      >
        <div className="flex items-center space-x-2">
          <span className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>Praxus</span>
          <div className="flex space-x-1 ml-4">
            <button className={`p-1 rounded-full ${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-200"}`}>
              <Minimize2 size={16} className={darkMode ? "text-gray-400" : "text-gray-600"} />
            </button>
            <button className={`p-1 rounded-full ${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-200"}`}>
              <Maximize2 size={16} className={darkMode ? "text-gray-400" : "text-gray-600"} />
            </button>
            <button className={`p-1 rounded-full ${darkMode ? "hover:bg-red-900/50" : "hover:bg-red-100"}`}>
              <Close size={16} className={darkMode ? "text-gray-400" : "text-gray-600"} />
            </button>
          </div>
        </div>

        {/* Top navigation */}
        <div className={`flex space-x-2 ${darkMode ? "bg-gray-800" : "bg-gray-100/70"} p-1 rounded-xl`}>
          <button
            onClick={() => setActiveTab("home")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              activeTab === "home"
                ? darkMode
                  ? "bg-gray-700 text-blue-400 shadow-[0_2px_10px_rgba(0,0,0,0.2)]"
                  : "bg-white text-blue-600 shadow-[0_2px_10px_rgba(0,0,0,0.05)]"
                : darkMode
                  ? "text-gray-400 hover:text-gray-300"
                  : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Home size={16} className="inline-block mr-1" />
            Home
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              activeTab === "chat"
                ? darkMode
                  ? "bg-gray-700 text-blue-400 shadow-[0_2px_10px_rgba(0,0,0,0.2)]"
                  : "bg-white text-blue-600 shadow-[0_2px_10px_rgba(0,0,0,0.05)]"
                : darkMode
                  ? "text-gray-400 hover:text-gray-300"
                  : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <MessageSquare size={16} className="inline-block mr-1" />
            Chat
          </button>
          <button
            onClick={() => setActiveTab("planning")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              activeTab === "planning"
                ? darkMode
                  ? "bg-gray-700 text-blue-400 shadow-[0_2px_10px_rgba(0,0,0,0.2)]"
                  
                  : "bg-white text-blue-600 shadow-[0_2px_10px_rgba(0,0,0,0.05)]"
                : darkMode
                  ? "text-gray-400 hover:text-gray-300"
                  : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <CalendarClock size={16} className="inline-block mr-1" />
            Planning
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              activeTab === "settings"
                ? darkMode
                  ? "bg-gray-700 text-blue-400 shadow-[0_2px_10px_rgba(0,0,0,0.2)]"
                  : "bg-white text-blue-600 shadow-[0_2px_10px_rgba(0,0,0,0.05)]"
                : darkMode
                  ? "text-gray-400 hover:text-gray-300"
                  : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Settings size={16} className="inline-block mr-1" />
            Settings
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className={`py-2 px-4 pl-9 rounded-xl ${
                darkMode
                  ? "bg-gray-800 text-gray-300 placeholder-gray-500 focus:ring-blue-500"
                  : "bg-gradient-to-r from-gray-50/80 to-white/80 shadow-[inset_3px_3px_6px_#d9d9d9,inset_-3px_-3px_6px_#ffffff] focus:ring-blue-200"
              } 
                focus:outline-none focus:ring-2 transition-all w-40`}
            />
            <Search className={`absolute left-3 top-2.5 ${darkMode ? "text-gray-500" : "text-gray-400"}`} size={16} />
          </div>

          {/* User profile button */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={`flex items-center space-x-2 p-1.5 rounded-lg ${
                darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
              } transition-colors`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  darkMode ? "bg-blue-600" : "bg-gradient-to-br from-blue-500 to-purple-500"
                } text-white font-medium text-sm`}
              >
                {userProfile.avatar}
              </div>
              <span className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                {userProfile.name.split(" ")[0]}
              </span>
            </button>

            {/* Profile dropdown */}
            {isProfileOpen && (
              <div
                className={`absolute right-0 mt-2 w-64 p-3 rounded-xl shadow-lg z-[100] ${
                  darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
                }`}
                onMouseLeave={() => setIsProfileOpen(false)}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      darkMode ? "bg-blue-600" : "bg-gradient-to-br from-blue-500 to-purple-500"
                    } text-white font-medium`}
                  >
                    {userProfile.avatar}
                  </div>
                  <div>
                    <div className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>{userProfile.name}</div>
                    <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{userProfile.email}</div>
                    <div className={`text-xs mt-1 ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
                      {userProfile.role}
                    </div>
                  </div>
                </div>
                <div className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"} mb-3`}>
                  Last login: {userProfile.lastLogin.toLocaleString()}
                </div>
                <div className="space-y-1">
                  <button
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                      darkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    View Profile
                  </button>
                  <button
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                      darkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    Account Settings
                  </button>
                  <button
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                      darkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    Subscription
                  </button>
                  <button
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                      darkMode ? "hover:bg-gray-700 text-red-400" : "hover:bg-gray-100 text-red-600"
                    }`}
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full ${
              darkMode
                ? "bg-gray-800 hover:bg-gray-700"
                : "bg-gradient-to-r from-gray-50/80 to-white/80 shadow-[3px_3px_6px_#d9d9d9,-3px_-3px_6px_#ffffff] hover:shadow-[inset_3px_3px_6px_#d9d9d9,inset_-3px_-3px_6px_#ffffff]"
            } 
              transition-all duration-300`}
          >
            {darkMode ? <Sun size={18} className="text-yellow-500" /> : <Moon size={18} className="text-gray-600" />}
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div className="relative z-10 flex-1 px-6 py-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {/* Add the Analytics Dashboard to the Home tab */}
          {activeTab === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full flex flex-col"
            >
              <div className="mb-6">
                <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
                  Welcome back, {userProfile.name.split(" ")[0]}
                </h1>
                <p className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Here's an overview of your activity and tasks
                </p>
              </div>

              {/* Stats cards */}
              <div className="grid grid-cols-4 gap-6 mb-8">
                <TiltCard
                  className={`p-6 rounded-2xl ${
                    darkMode
                      ? "bg-gray-800/60 backdrop-blur-sm border border-gray-700/50"
                      : "bg-white/30 backdrop-blur-sm border border-white/50"
                  } 
                  shadow-[0_10px_30px_rgba(0,0,0,0.07)]`}
                >
                  <div className={`text-sm font-medium mb-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Total Chats
                  </div>
                  <div className="flex items-end justify-between">
                    <div className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
                      {dashboardStats.totalChats}
                    </div>
                    <div className={`p-2 rounded-lg ${darkMode ? "bg-blue-500/20" : "bg-blue-100"}`}>
                      <MessageSquare size={20} className={darkMode ? "text-blue-400" : "text-blue-600"} />
                    </div>
                  </div>
                </TiltCard>

                <TiltCard
                  className={`p-6 rounded-2xl ${
                    darkMode
                      ? "bg-gray-800/60 backdrop-blur-sm border border-gray-700/50"
                      : "bg-white/30 backdrop-blur-sm border border-white/50"
                  } 
                  shadow-[0_10px_30px_rgba(0,0,0,0.07)]`}
                >
                  <div className={`text-sm font-medium mb-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Completed Tasks
                  </div>
                  <div className="flex items-end justify-between">
                    <div className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
                      {dashboardStats.completedTasks}
                    </div>
                    <div className={`p-2 rounded-lg ${darkMode ? "bg-green-500/20" : "bg-green-100"}`}>
                      <Check size={20} className={darkMode ? "text-green-400" : "text-green-600"} />
                    </div>
                  </div>
                </TiltCard>

                <TiltCard
                  className={`p-6 rounded-2xl ${
                    darkMode
                      ? "bg-gray-800/60 backdrop-blur-sm border border-gray-700/50"
                      : "bg-white/30 backdrop-blur-sm border border-white/50"
                  } 
                  shadow-[0_10px_30px_rgba(0,0,0,0.07)]`}
                >
                  <div className={`text-sm font-medium mb-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Pending Tasks
                  </div>
                  <div className="flex items-end justify-between">
                    <div className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
                      {dashboardStats.pendingTasks}
                    </div>
                    <div className={`p-2 rounded-lg ${darkMode ? "bg-yellow-500/20" : "bg-yellow-100"}`}>
                      <Clock size={20} className={darkMode ? "text-yellow-400" : "text-yellow-600"} />
                    </div>
                  </div>
                </TiltCard>

                <TiltCard
                  className={`p-6 rounded-2xl ${
                    darkMode
                      ? "bg-gray-800/60 backdrop-blur-sm border border-gray-700/50"
                      : "bg-white/30 backdrop-blur-sm border border-white/50"
                  } 
                  shadow-[0_10px_30px_rgba(0,0,0,0.07)]`}
                >
                  <div className={`text-sm font-medium mb-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Productivity
                  </div>
                  <div className="flex items-end justify-between">
                    <div className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
                      {dashboardStats.productivity}%
                    </div>
                    <div className={`p-2 rounded-lg ${darkMode ? "bg-purple-500/20" : "bg-purple-100"}`}>
                      <BarChart3 size={20} className={darkMode ? "text-purple-400" : "text-purple-600"} />
                    </div>
                  </div>
                </TiltCard>
              </div>

              {/* Recent activity and quick actions */}
              <div className="flex gap-6 flex-1">
                <div
                  className={`w-2/3 rounded-2xl p-6 ${
                    darkMode
                      ? "bg-gray-800/60 backdrop-blur-sm border border-gray-700/50"
                      : "bg-white/30 backdrop-blur-sm border border-white/50"
                  } 
                  shadow-[0_10px_30px_rgba(0,0,0,0.07)] overflow-hidden my-1`}
                >
                  <h2 className={`text-lg font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>
                    Recent Activity
                  </h2>
                  <div className="space-y-4">
                    {dashboardStats.recentActivity.map((activity) => (
                      <TiltCard
                        key={activity.id}
                        className={`p-4 rounded-xl ${
                          darkMode ? "bg-gray-700/60 hover:bg-gray-700/80" : "bg-white/60 hover:bg-white/80"
                        } 
              transition-all duration-300 border ${darkMode ? "border-gray-600/50" : "border-gray-100"}`}
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              activity.type === "chat"
                                ? darkMode
                                  ? "bg-blue-500/20 text-blue-400"
                                  : "bg-blue-100 text-blue-600"
                                : darkMode
                                  ? "bg-purple-500/20 text-purple-400"
                                  : "bg-purple-100 text-purple-600"
                            } mr-3`}
                          >
                            {activity.type === "chat" ? <MessageSquare size={16} /> : <CalendarClock size={16} />}
                          </div>
                          <div className="flex-1">
                            <div className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>
                              {activity.title}
                            </div>
                            <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                              {activity.time.toLocaleString()}
                            </div>
                          </div>
                          <button
                            className={`p-2 rounded-lg ${
                              darkMode ? "hover:bg-gray-600 text-gray-400" : "hover:bg-gray-100 text-gray-500"
                            }`}
                          >
                            <ChevronRight size={16} />
                          </button>
                        </div>
                      </TiltCard>
                    ))}
                  </div>
                </div>

                <div
                  className={`w-1/3 rounded-2xl p-6 ${
                    darkMode
                      ? "bg-gray-800/60 backdrop-blur-sm border border-gray-700/50"
                      : "bg-white/30 backdrop-blur-sm border border-white/50"
                  } 
        shadow-[0_10px_30px_rgba(0,0,0,0.07)] overflow-hidden my-1`}
                >
                  <h2 className={`text-lg font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>
                    Quick Actions
                  </h2>
                  <div className="space-y-3">
                    <TiltCard
                      className={`p-4 rounded-xl ${
                        darkMode
                          ? "bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20"
                          : "bg-blue-50 hover:bg-blue-100 border border-blue-100"
                      } 
            transition-all duration-300 cursor-pointer`}
                      onClick={() => setActiveTab("chat")}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            darkMode ? "bg-blue-500/20" : "bg-blue-100"
                          } mr-3`}
                        >
                          <MessageSquare size={16} className={darkMode ? "text-blue-400" : "text-blue-600"} />
                        </div>
                        <div className={darkMode ? "text-blue-300" : "text-blue-700"}>New Chat</div>
                      </div>
                    </TiltCard>

                    <TiltCard
                      className={`p-4 rounded-xl ${
                        darkMode
                          ? "bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20"
                          : "bg-purple-50 hover:bg-purple-100 border border-purple-100"
                      } 
            transition-all duration-300 cursor-pointer`}
                      onClick={() => {
                        setActiveTab("planning")
                        setShowAddTask(true)
                      }}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            darkMode ? "bg-purple-500/20" : "bg-purple-100"
                          } mr-3`}
                        >
                          <CalendarClock size={16} className={darkMode ? "text-purple-400" : "text-purple-600"} />
                        </div>
                        <div className={darkMode ? "text-purple-300" : "text-purple-700"}>Add Task</div>
                      </div>
                    </TiltCard>

                    <TiltCard
                      className={`p-4 rounded-xl ${
                        darkMode
                          ? "bg-green-500/10 hover:bg-green-500/20 border border-green-500/20"
                          : "bg-green-50 hover:bg-green-100 border border-green-100"
                      } 
            transition-all duration-300 cursor-pointer`}
                      onClick={() => {
                        // This would open the analytics view in a real app
                        // For now, we'll just show an alert
                        alert("Analytics view would open here")
                      }}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            darkMode ? "bg-green-500/20" : "bg-green-100"
                          } mr-3`}
                        >
                          <BarChart3 size={16} className={darkMode ? "text-green-400" : "text-green-600"} />
                        </div>
                        <div className={darkMode ? "text-green-300" : "text-green-700"}>View Analytics</div>
                      </div>
                    </TiltCard>

                    <TiltCard
                      className={`p-4 rounded-xl ${
                        darkMode
                          ? "bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/20"
                          : "bg-yellow-50 hover:bg-yellow-100 border border-yellow-100"
                      } 
            transition-all duration-300 cursor-pointer`}
                      onClick={() => {
                        setActiveTab("planning")
                        optimizeSchedule()
                      }}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            darkMode ? "bg-yellow-500/20" : "bg-yellow-100"
                          } mr-3`}
                        >
                          <Zap size={16} className={darkMode ? "text-yellow-400" : "text-yellow-600"} />
                        </div>
                        <div className={darkMode ? "text-yellow-300" : "text-yellow-700"}>Quick Optimize</div>
                      </div>
                    </TiltCard>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          {/* Chat Section with Collapsible Sidebar */}
          {activeTab === "chat" && (
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full flex overflow-hidden"
            >
              {/* Chat sessions sidebar - now collapsible */}
              <div
                className={`${chatSidebarCollapsed ? "w-16" : "w-72"} transition-all duration-300 mr-6 overflow-y-auto rounded-2xl ${
                  darkMode ? "bg-gray-800/30" : "bg-white/20"
                } backdrop-blur-sm 
                shadow-[0_10px_30px_rgba(0,0,0,0.07)] border ${darkMode ? "border-gray-700/50" : "border-white/50"} p-4 my-1 relative`}
              >
                {/* Toggle button for sidebar */}
                <button
                  onClick={() => setChatSidebarCollapsed(!chatSidebarCollapsed)}
                  className={`absolute top-4 right-4 p-1.5 rounded-full ${
                    darkMode
                      ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                  } transition-colors z-10`}
                >
                  {chatSidebarCollapsed ? (
                    <ChevronRight size={16} />
                  ) : (
                    <ChevronRight size={16} className="rotate-180" />
                  )}
                </button>

                {!chatSidebarCollapsed && (
                  <>
                    <div className="mb-4">
                      <motion.button
                        whileHover={{ scale: 1.02, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={addNewChatSession}
                        className="w-full py-3 px-4 rounded-xl flex items-center justify-center
                        bg-gradient-to-br from-blue-400 to-purple-500
                        shadow-[0_8px_16px_rgba(0,0,0,0.1)]
                        hover:shadow-[0_12px_20px_rgba(0,0,0,0.15)]
                        hover:from-blue-500 hover:to-purple-600
                        text-white transition-all duration-300
                        border border-white/20"
                      >
                        <PlusCircle size={18} className="mr-2" />
                        New Chat
                      </motion.button>
                    </div>

                    <div className="space-y-3">
                      {chatSessions.map((session) => (
                        <TiltCard key={session.id}>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setActiveChatId(session.id)}
                            className={`w-full p-4 rounded-xl text-left transition-all
                            ${
                              activeChatId === session.id
                                ? darkMode
                                  ? "bg-gradient-to-r from-blue-900/50 to-purple-900/50 shadow-[0_8px_16px_rgba(0,0,0,0.2)]"
                                  : "bg-gradient-to-r from-blue-50 to-indigo-50 shadow-[0_8px_16px_rgba(0,0,0,0.1)]"
                                : darkMode
                                  ? "bg-gray-800/60 shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:bg-gray-700/60"
                                  : "bg-white/60 shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:bg-white/80"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>
                                {session.name}
                              </div>
                              <div className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
                                {session.lastActive.toLocaleDateString([], { month: "short", day: "numeric" })}
                              </div>
                            </div>
                            {session.messages.length > 0 && (
                              <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"} mt-1 truncate`}>
                                {session.messages[session.messages.length - 1].content.substring(0, 40)}
                                {session.messages[session.messages.length - 1].content.length > 40 ? "..." : ""}
                              </div>
                            )}
                          </motion.button>
                        </TiltCard>
                      ))}
                    </div>
                  </>
                )}

                {chatSidebarCollapsed && (
                  <div className="flex flex-col items-center pt-8 space-y-4">
                    <motion.button
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={addNewChatSession}
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        darkMode
                          ? "bg-blue-600 hover:bg-blue-500"
                          : "bg-gradient-to-br from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600"
                      } 
                        shadow-lg text-white`}
                    >
                      <Plus size={18} />
                    </motion.button>

                    {chatSessions.map((session) => (
                      <motion.button
                        key={session.id}
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setActiveChatId(session.id)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          activeChatId === session.id
                            ? darkMode
                              ? "bg-blue-600 text-white"
                              : "bg-gradient-to-br from-blue-400 to-purple-500 text-white"
                            : darkMode
                              ? "bg-gray-700 text-gray-300"
                              : "bg-white text-gray-600"
                        } shadow-md`}
                        title={session.name}
                      >
                        {session.name.charAt(0)}
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>

              {/* Chat area */}
              <div
                className={`flex-1 flex flex-col rounded-2xl ${
                  darkMode ? "bg-gray-800/30" : "bg-white/30"
                } backdrop-blur-sm
                shadow-[0_10px_30px_rgba(0,0,0,0.1)] overflow-hidden
                border ${darkMode ? "border-gray-700/50" : "border-white/50"} my-1`}
              >
                {/* Chat header */}
                <div className={`p-4 border-b ${darkMode ? "border-gray-700/50" : "border-gray-200/50"}`}>
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full ${
                        darkMode ? "bg-blue-600" : "bg-gradient-to-br from-blue-400 to-purple-500"
                      } flex items-center justify-center shadow-lg`}
                    >
                      <Bot className="text-white" size={20} />
                    </div>
                    <div className="ml-3">
                      <h2 className={`font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>Praxus AI</h2>
                      <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Always ready to help</p>
                    </div>
                  </div>
                </div>

                {/* Chat messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {!messages.length || (activeChatId === 1 && messages.length <= 1) ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div
                        className={`w-20 h-20 rounded-full ${
                          darkMode ? "bg-blue-600" : "bg-gradient-to-br from-blue-400 to-purple-500"
                        } flex items-center justify-center shadow-[0_10px_20px_rgba(0,0,0,0.15)] mb-6`}
                      >
                        <Bot className="text-white" size={36} />
                      </div>
                      <h2 className={`text-2xl font-bold mb-3 ${darkMode ? "text-white" : "text-gray-800"}`}>
                        Welcome to Praxus
                      </h2>
                      <p className={`text-lg mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"} max-w-md`}>
                        Your AI assistant for productivity and planning. How can I help you today?
                      </p>
                      <div className="grid grid-cols-2 gap-4 max-w-lg">
                        <TiltCard
                          className={`p-4 rounded-xl ${
                            darkMode
                              ? "bg-gray-700/60 shadow-[0_8px_16px_rgba(0,0,0,0.15)] border border-gray-600/50"
                              : "bg-gradient-to-r from-gray-50 to-white shadow-[0_8px_16px_rgba(0,0,0,0.08)] border border-white/50"
                          } text-left`}
                        >
                          <h3 className={`font-medium ${darkMode ? "text-white" : "text-gray-800"} mb-1`}>
                            Plan my day
                          </h3>
                          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                            Let me help you organize your tasks and schedule
                          </p>
                        </TiltCard>
                        <TiltCard
                          className={`p-4 rounded-xl ${
                            darkMode
                              ? "bg-gray-700/60 shadow-[0_8px_16px_rgba(0,0,0,0.15)] border border-gray-600/50"
                              : "bg-gradient-to-r from-gray-50 to-white shadow-[0_8px_16px_rgba(0,0,0,0.08)] border border-white/50"
                          } text-left`}
                        >
                          <h3 className={`font-medium ${darkMode ? "text-white" : "text-gray-800"} mb-1`}>
                            Research a topic
                          </h3>
                          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                            Ask me to find information on any subject
                          </p>
                        </TiltCard>
                        <TiltCard
                          className={`p-4 rounded-xl ${
                            darkMode
                              ? "bg-gray-700/60 shadow-[0_8px_16px_rgba(0,0,0,0.15)] border border-gray-600/50"
                              : "bg-gradient-to-r from-gray-50 to-white shadow-[0_8px_16px_rgba(0,0,0,0.08)] border border-white/50"
                          } text-left`}
                        >
                          <h3 className={`font-medium ${darkMode ? "text-white" : "text-gray-800"} mb-1`}>
                            Generate ideas
                          </h3>
                          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                            I can help brainstorm creative solutions
                          </p>
                        </TiltCard>
                        <TiltCard
                          className={`p-4 rounded-xl ${
                            darkMode
                              ? "bg-gray-700/60 shadow-[0_8px_16px_rgba(0,0,0,0.15)] border border-gray-600/50"
                              : "bg-gradient-to-r from-gray-50 to-white shadow-[0_8px_16px_rgba(0,0,0,0.08)] border border-white/50"
                          } text-left`}
                        >
                          <h3 className={`font-medium ${darkMode ? "text-white" : "text-gray-800"} mb-1`}>
                            Answer questions
                          </h3>
                          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                            Ask me anything you're curious about
                          </p>
                        </TiltCard>
                      </div>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`flex items-start max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : ""}`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              message.sender === "user"
                                ? darkMode
                                  ? "bg-blue-600 ml-2 shadow-[0_4px_12px_rgba(37,99,235,0.4)]"
                                  : "bg-gradient-to-br from-blue-500 to-indigo-600 ml-2 shadow-[0_4px_12px_rgba(79,70,229,0.4)]"
                                : darkMode
                                  ? "bg-purple-600 mr-2 shadow-[0_4px_12px_rgba(147,51,234,0.4)]"
                                  : "bg-gradient-to-br from-purple-400 to-pink-500 mr-2 shadow-[0_4px_12px_rgba(219,39,119,0.4)]"
                            }`}
                          >
                            {message.sender === "user" ? (
                              <User className="text-white" size={16} />
                            ) : (
                              <Bot className="text-white" size={16} />
                            )}
                          </div>
                          <div
                            className={`rounded-2xl px-4 py-3 ${
                              message.sender === "user"
                                ? darkMode
                                  ? "bg-blue-900/30 shadow-[0_8px_16px_rgba(0,0,0,0.15)] border border-blue-800/30"
                                  : "bg-gradient-to-r from-blue-50 to-indigo-50 shadow-[0_8px_16px_rgba(0,0,0,0.08)] border border-blue-100/50"
                                : darkMode
                                  ? "bg-gray-700/60 shadow-[0_8px_16px_rgba(0,0,0,0.1)] border border-gray-600/50"
                                  : "bg-gradient-to-r from-gray-50 to-white shadow-[0_8px_16px_rgba(0,0,0,0.05)] border border-white/50"
                            }`}
                          >
                            <p className={darkMode ? "text-gray-200" : "text-gray-800"}>{message.content}</p>
                            <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"} mt-1`}>
                              {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="flex items-start max-w-[80%]">
                        <div
                          className={`w-8 h-8 rounded-full ${
                            darkMode
                              ? "bg-purple-600 shadow-[0_4px_12px_rgba(147,51,234,0.4)]"
                              : "bg-gradient-to-br from-purple-400 to-pink-500 shadow-[0_4px_12px_rgba(219,39,119,0.4)]"
                          } flex items-center justify-center mr-2`}
                        >
                          <Bot className="text-white" size={16} />
                        </div>
                        <div
                          className={`rounded-2xl px-4 py-3 ${
                            darkMode
                              ? "bg-gray-700/60 shadow-[0_8px_16px_rgba(0,0,0,0.1)] border border-gray-600/50"
                              : "bg-gradient-to-r from-gray-50 to-white shadow-[0_8px_16px_rgba(0,0,0,0.05)] border border-white/50"
                          }`}
                        >
                          <div className="flex space-x-1">
                            <div
                              className={`w-2 h-2 rounded-full ${darkMode ? "bg-gray-500" : "bg-gray-300"} animate-bounce`}
                              style={{ animationDelay: "0ms" }}
                            ></div>
                            <div
                              className={`w-2 h-2 rounded-full ${darkMode ? "bg-gray-500" : "bg-gray-300"} animate-bounce`}
                              style={{ animationDelay: "150ms" }}
                            ></div>
                            <div
                              className={`w-2 h-2 rounded-full ${darkMode ? "bg-gray-500" : "bg-gray-300"} animate-bounce`}
                              style={{ animationDelay: "300ms" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Input area */}
                <div className={`p-4 border-t ${darkMode ? "border-gray-700/50" : "border-gray-200/50"}`}>
                  <div className="flex items-center">
                    <TiltCard>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`rounded-full h-10 w-10 mr-2 ${
                          darkMode
                            ? "bg-gray-700 hover:bg-gray-600"
                            : "bg-gradient-to-r from-gray-50 to-white shadow-[0_6px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.12)]"
                        }
                        transition-all duration-300 flex items-center justify-center
                        border ${darkMode ? "border-gray-600/50" : "border-white/50"}`}
                      >
                        <Image className={darkMode ? "text-gray-300" : "text-gray-500"} size={18} />
                      </motion.button>
                    </TiltCard>
                    <TiltCard>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`rounded-full h-10 w-10 mr-2 ${
                          darkMode
                            ? "bg-gray-700 hover:bg-gray-600"
                            : "bg-gradient-to-r from-gray-50 to-white shadow-[0_6px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.12)]"
                        }
                        transition-all duration-300 flex items-center justify-center
                        border ${darkMode ? "border-gray-600/50" : "border-white/50"}`}
                      >
                        <Mic className={darkMode ? "text-gray-300" : "text-gray-500"} size={18} />
                      </motion.button>
                    </TiltCard>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSendMessage()
                        }}
                        placeholder="Type your message..."
                        className={`w-full py-3 px-4 rounded-xl ${
                          darkMode
                            ? "bg-gray-700 text-gray-200 placeholder-gray-500 focus:ring-blue-500"
                            : "bg-gradient-to-r from-gray-50 to-white shadow-[0_6px_12px_rgba(0,0,0,0.04)] focus:shadow-[0_8px_16px_rgba(0,0,0,0.08)] focus:ring-blue-200"
                        }
                        focus:outline-none focus:ring-2 transition-all
                        border ${darkMode ? "border-gray-600/50" : "border-white/50"}`}
                      />
                    </div>
                    <TiltCard>
                      <motion.button
                        onClick={handleSendMessage}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`ml-2 rounded-full h-12 w-12 ${
                          darkMode
                            ? "bg-blue-600 hover:bg-blue-500"
                            : "bg-gradient-to-br from-blue-400 to-purple-500 shadow-[0_8px_16px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_20px_rgba(0,0,0,0.15)] hover:from-blue-500 hover:to-purple-600"
                        }
                        transition-all duration-300 flex items-center justify-center`}
                      >
                        <Send className="text-white" size={18} />
                      </motion.button>
                    </TiltCard>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          // Update the Settings section to include the new settings pages
          {activeTab === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full flex overflow-hidden"
            >
              {/* Settings sidebar */}
              <div
                className={`w-64 mr-6 rounded-2xl ${darkMode ? "bg-gray-800/30" : "bg-white/20"} backdrop-blur-sm
      shadow-[0_10px_30px_rgba(0,0,0,0.07)] border ${darkMode ? "border-gray-700/50" : "border-white/50"} p-4 my-1`}
              >
                <h2 className={`text-lg font-semibold mb-6 ${darkMode ? "text-white" : "text-gray-800"}`}>Settings</h2>
                <div className="space-y-1">
                  <button
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                      darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-800"
                    } font-medium`}
                  >
                    Profile
                  </button>
                  <button
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                      darkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    Appearance
                  </button>
                  <button
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                      darkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    Notifications
                  </button>
                  <button
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                      darkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    Privacy & Security
                  </button>
                  <button
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                      darkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    Language & Region
                  </button>
                  <button
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                      darkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    Subscription
                  </button>
                  <button
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                      darkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    Help & Support
                  </button>
                  <button
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                      darkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    About
                  </button>
                </div>
              </div>

              {/* Settings content */}
              <div
                className={`flex-1 rounded-2xl ${darkMode ? "bg-gray-800/30" : "bg-white/20"} backdrop-blur-sm
      shadow-[0_10px_30px_rgba(0,0,0,0.07)] overflow-hidden
      border ${darkMode ? "border-gray-700/50" : "border-white/50"} p-6 my-1 overflow-y-auto`}
              >
                {/* Import and use the settings components here */}
                <div className="space-y-6">
                  <h2 className={`text-xl font-semibold mb-6 ${darkMode ? "text-white" : "text-gray-800"}`}>
                    Profile Settings
                  </h2>

                  <div className="flex items-center mb-8">
                    <div
                      className={`w-20 h-20 rounded-full flex items-center justify-center ${
                        darkMode ? "bg-blue-600" : "bg-gradient-to-br from-blue-500 to-purple-500"
                      } text-white text-2xl font-medium`}
                    >
                      AJ
                    </div>
                    <div className="ml-6">
                      <div className={`text-lg font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>
                        Alex Johnson
                      </div>
                      <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>alex@example.com</div>
                      <div className="mt-2">
                        <button
                          className={`text-sm px-3 py-1 rounded-lg ${
                            darkMode
                              ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                          }`}
                        >
                          Change Photo
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label
                        className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        defaultValue="Alex Johnson"
                        className={`w-full py-2 px-3 rounded-lg ${
                          darkMode
                            ? "bg-gray-700 text-gray-200 border-gray-600 focus:ring-blue-500"
                            : "bg-white text-gray-800 border-gray-200 focus:ring-blue-200"
                        }
                border focus:outline-none focus:ring-2 transition-all`}
                      />
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        defaultValue="alex@example.com"
                        className={`w-full py-2 px-3 rounded-lg ${
                          darkMode
                            ? "bg-gray-700 text-gray-200 border-gray-600 focus:ring-blue-500"
                            : "bg-white text-gray-800 border-gray-200 focus:ring-blue-200"
                        }
                border focus:outline-none focus:ring-2 transition-all`}
                      />
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                      >
                        Password
                      </label>
                      <input
                        type="password"
                        defaultValue="••••••••••••"
                        className={`w-full py-2 px-3 rounded-lg ${
                          darkMode
                            ? "bg-gray-700 text-gray-200 border-gray-600 focus:ring-blue-500"
                            : "bg-white text-gray-800 border-gray-200 focus:ring-blue-200"
                        }
                border focus:outline-none focus:ring-2 transition-all`}
                      />
                      <div className="mt-1 flex justify-end">
                        <button className={`text-sm ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
                          Change Password
                        </button>
                      </div>
                    </div>

                    <div>
                      <label
                        className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                      >
                        Time Zone
                      </label>
                      <select
                        className={`w-full py-2 px-3 rounded-lg ${
                          darkMode
                            ? "bg-gray-700 text-gray-200 border-gray-600 focus:ring-blue-500"
                            : "bg-white text-gray-800 border-gray-200 focus:ring-blue-200"
                        }
                border focus:outline-none focus:ring-2 transition-all`}
                      >
                        <option>Pacific Time (US & Canada)</option>
                        <option>Eastern Time (US & Canada)</option>
                        <option>Central Time (US & Canada)</option>
                        <option>Mountain Time (US & Canada)</option>
                        <option>UTC</option>
                      </select>
                    </div>

                    <div className="pt-4">
                      <button
                        className={`px-4 py-2 rounded-lg ${
                          darkMode
                            ? "bg-blue-600 hover:bg-blue-500"
                            : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                        }
              text-white font-medium shadow-lg transition-colors`}
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          {/* Planning section remains the same but with updated styling for transparency */}
          {activeTab === "planning" && (
            <motion.div
              key="planning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full flex flex-col"
            >
              <div className="flex-1 flex gap-6 overflow-hidden">
                {/* Tasks list */}
                <div
                  className={`w-1/2 rounded-2xl p-6 ${darkMode ? "bg-gray-800/30" : "bg-white/20"} backdrop-blur-sm
                  shadow-[0_10px_30px_rgba(0,0,0,0.07)]
                  border ${darkMode ? "border-gray-700/50" : "border-white/50"} overflow-y-auto my-1`}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
                      Today's Tasks
                    </h2>
                    <div className="flex space-x-2">
                      <TiltCard>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowAddTask(true)}
                          className={`rounded-lg px-3 py-2 ${
                            darkMode ? "bg-gray-700 text-blue-400" : "bg-white text-blue-600"
                          } text-sm font-medium
                          shadow-[0_6px_12px_rgba(0,0,0,0.08)]
                          hover:shadow-[0_8px_16px_rgba(0,0,0,0.12)]
                          transition-all duration-300
                          flex items-center border ${darkMode ? "border-gray-600/50" : "border-white/50"}`}
                        >
                          <Plus size={16} className="mr-1" />
                          Add Task
                        </motion.button>
                      </TiltCard>
                      <TiltCard>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={optimizeSchedule}
                          className={`rounded-lg px-3 py-2 ${
                            darkMode ? "bg-blue-600 hover:bg-blue-500" : "bg-gradient-to-r from-blue-500 to-purple-500"
                          } text-white text-sm font-medium
                          shadow-[0_8px_16px_rgba(0,0,0,0.1)]
                          hover:shadow-[0_12px_20px_rgba(0,0,0,0.15)]
                          transition-all duration-300
                          flex items-center`}
                        >
                          <BarChart3 size={16} className="mr-1" />
                          Optimize
                        </motion.button>
                      </TiltCard>
                    </div>
                  </div>

                  {optimizedSchedule && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className={`${
                        darkMode
                          ? "bg-blue-900/20 border border-blue-800/30"
                          : "bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100/50"
                      } 
                        p-3 rounded-xl mb-4 shadow-[0_6px_12px_rgba(0,0,0,0.05)]`}
                    >
                      <p className={`text-sm ${darkMode ? "text-blue-300" : "text-blue-700"}`}>
                        <span className="font-medium">Praxus AI</span>: I've optimized your schedule based on task
                        importance, deadlines, and estimated time.
                      </p>
                    </motion.div>
                  )}

                  <div className="space-y-3">
                    {tasks.map((task) => (
                      <TiltCard
                        key={task.id}
                        className={`p-4 rounded-xl ${
                          darkMode ? "bg-gray-700/60 hover:bg-gray-700/80" : "bg-white/60 hover:bg-white/80"
                        } 
                        shadow-[0_6px_12px_rgba(0,0,0,0.08)]
                        hover:shadow-[0_10px_20px_rgba(0,0,0,0.12)]
                        transition-all duration-300
                        border-l-4 ${
                          task.completed
                            ? "border-green-400"
                            : task.importance >= 4
                              ? "border-red-400"
                              : task.importance >= 3
                                ? "border-yellow-400"
                                : "border-blue-400"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => toggleTaskCompletion(task.id)}
                              className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center
                              ${
                                task.completed
                                  ? darkMode
                                    ? "bg-green-900/50 text-green-400"
                                    : "bg-green-100 text-green-500"
                                  : darkMode
                                    ? "bg-gray-800 text-gray-500"
                                    : "bg-gray-100 text-gray-400"
                              }`}
                            >
                              {task.completed ? <Check size={14} /> : null}
                            </motion.button>
                            <div>
                              <h3
                                className={`font-medium ${
                                  task.completed
                                    ? darkMode
                                      ? "text-gray-500 line-through"
                                      : "text-gray-400 line-through"
                                    : darkMode
                                      ? "text-white"
                                      : "text-gray-800"
                                }`}
                              >
                                {task.name}
                              </h3>
                              <div className="flex items-center mt-1 text-xs text-gray-500 space-x-3">
                                <span className="flex items-center">
                                  <Clock size={12} className="mr-1" />
                                  {task.estimatedTime} min
                                </span>
                                {task.deadline && (
                                  <span className="flex items-center">
                                    <Calendar size={12} className="mr-1" />
                                    {task.deadline.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                  </span>
                                )}
                                <span className="flex items-center">
                                  <BarChart3 size={12} className="mr-1" />
                                  Priority: {task.importance}
                                </span>
                                {task.category && (
                                  <span className="flex items-center">
                                    {getCategoryIcon(task.category)}
                                    {task.category}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1, x: 2 }}
                            whileTap={{ scale: 0.9 }}
                            className={`text-gray-400 hover:${darkMode ? "text-blue-400" : "text-blue-500"} transition-colors`}
                          >
                            <ChevronRight size={18} />
                          </motion.button>
                        </div>
                      </TiltCard>
                    ))}
                  </div>
                </div>

                {/* Schedule view */}
                <div
                  className={`w-1/2 rounded-2xl p-6 ${darkMode ? "bg-gray-800/30" : "bg-white/20"} backdrop-blur-sm
                  shadow-[0_10px_30px_rgba(0,0,0,0.07)]
                  border ${darkMode ? "border-gray-700/50" : "border-white/50"} overflow-y-auto my-1`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
                      Today's Schedule
                    </h2>
                    <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      {currentTime.toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" })}
                    </div>
                  </div>

                  {timeBlocks.length > 0 ? (
                    <div className="space-y-3">
                      {timeBlocks.map((block) => {
                        const task = tasks.find((t) => t.id === block.taskId)
                        if (!task) return null

                        return (
                          <TiltCard
                            key={block.id}
                            className={`p-4 rounded-xl ${
                              darkMode ? "bg-gray-700/60 hover:bg-gray-700/80" : "bg-white/60 hover:bg-white/80"
                            } 
                            shadow-[0_6px_12px_rgba(0,0,0,0.08)]
                            hover:shadow-[0_10px_20px_rgba(0,0,0,0.12)]
                            border-l-4 ${getCategoryColor(task.category)}`}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <div className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>
                                  {task.name}
                                </div>
                                <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                  {formatTimeBlock(block.startTime)} - {formatTimeBlock(block.endTime)}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span
                                  className={`text-xs px-2 py-1 rounded-full ${
                                    darkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600"
                                  }`}
                                >
                                  {task.estimatedTime} min
                                </span>
                                <span
                                  className={`text-xs px-2 py-1 rounded-full ${
                                    task.importance >= 4
                                      ? darkMode
                                        ? "bg-red-900/30 text-red-400"
                                        : "bg-red-100 text-red-600"
                                      : task.importance >= 3
                                        ? darkMode
                                          ? "bg-yellow-900/30 text-yellow-400"
                                          : "bg-yellow-100 text-yellow-600"
                                        : darkMode
                                          ? "bg-blue-900/30 text-blue-400"
                                          : "bg-blue-100 text-blue-600"
                                  }`}
                                >
                                  P{task.importance}
                                </span>
                              </div>
                            </div>
                          </TiltCard>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                      <CalendarClock size={48} className={`${darkMode ? "text-gray-600" : "text-gray-300"} mb-4`} />
                      <p className={`${darkMode ? "text-gray-400" : "text-gray-500"} mb-2`}>
                        No schedule generated yet
                      </p>
                      <p className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                        Click the "Optimize" button to let Praxus AI create your optimal schedule
                      </p>
                    </div>
                  )}

                  {timeBlocks.length > 0 && (
                    <div className="mt-6">
                      <h3 className={`text-md font-medium ${darkMode ? "text-white" : "text-gray-800"} mb-3`}>
                        Schedule Stats
                      </h3>
                      <div className="grid grid-cols-3 gap-3">
                        <TiltCard
                          className={`p-3 rounded-xl ${
                            darkMode ? "bg-blue-900/20 border border-blue-800/30" : "bg-blue-50 border border-blue-100"
                          } shadow-[0_6px_12px_rgba(0,0,0,0.05)]`}
                        >
                          <div className={`text-xs ${darkMode ? "text-blue-400" : "text-blue-500"} mb-1`}>
                            Total Tasks
                          </div>
                          <div className={`text-xl font-semibold ${darkMode ? "text-blue-300" : "text-blue-700"}`}>
                            {timeBlocks.length}
                          </div>
                        </TiltCard>
                        <TiltCard
                          className={`p-3 rounded-xl ${
                            darkMode
                              ? "bg-purple-900/20 border border-purple-800/30"
                              : "bg-purple-50 border border-purple-100"
                          } shadow-[0_6px_12px_rgba(0,0,0,0.05)]`}
                        >
                          <div className={`text-xs ${darkMode ? "text-purple-400" : "text-purple-500"} mb-1`}>
                            Work Hours
                          </div>
                          <div className={`text-xl font-semibold ${darkMode ? "text-purple-300" : "text-purple-700"}`}>
                            {Math.round(
                              timeBlocks.reduce(
                                (acc, block) => acc + (block.endTime.getTime() - block.startTime.getTime()) / 3600000,
                                0,
                              ) * 10,
                            ) / 10}
                            h
                          </div>
                        </TiltCard>
                        <TiltCard
                          className={`p-3 rounded-xl ${
                            darkMode
                              ? "bg-green-900/20 border border-green-800/30"
                              : "bg-green-50 border border-green-100"
                          } shadow-[0_6px_12px_rgba(0,0,0,0.05)]`}
                        >
                          <div className={`text-xs ${darkMode ? "text-green-400" : "text-green-500"} mb-1`}>
                            Completed
                          </div>
                          <div className={`text-xl font-semibold ${darkMode ? "text-green-300" : "text-green-700"}`}>
                            {tasks.filter((t) => t.completed).length}/{tasks.length}
                          </div>
                        </TiltCard>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Planning input area */}
              <div
                className={`mt-6 rounded-2xl p-4 ${darkMode ? "bg-gray-800/60" : "bg-white/30"} backdrop-blur-sm
                shadow-[0_10px_30px_rgba(0,0,0,0.1)]
                border ${darkMode ? "border-gray-700/50" : "border-white/50"} mb-1`}
              >
                <div className="flex items-center">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Ask Praxus about your schedule..."
                      className={`w-full py-3 px-4 rounded-xl ${
                        darkMode
                          ? "bg-gray-700 text-gray-200 placeholder-gray-500 focus:ring-blue-500"
                          : "bg-gradient-to-r from-gray-50 to-white shadow-[0_6px_12px_rgba(0,0,0,0.04)] focus:shadow-[0_8px_16px_rgba(0,0,0,0.08)] focus:ring-blue-200"
                      }
                      focus:outline-none focus:ring-2 transition-all
                      border ${darkMode ? "border-gray-600/50" : "border-white/50"}`}
                    />
                  </div>
                  <TiltCard>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`ml-2 rounded-full h-12 w-12 ${
                        darkMode
                          ? "bg-blue-600 hover:bg-blue-500"
                          : "bg-gradient-to-br from-blue-400 to-purple-500 shadow-[0_8px_16px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_20px_rgba(0,0,0,0.15)] hover:from-blue-500 hover:to-purple-600"
                      }
                      transition-all duration-300 flex items-center justify-center`}
                    >
                      <Send className="text-white" size={18} />
                    </motion.button>
                  </TiltCard>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Update the modal to have a floating appearance */}
      {showAddTask && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowAddTask(false)}
        >
          <TiltCard>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className={`${
                darkMode ? "bg-gray-800" : "bg-white"
              } rounded-2xl p-6 w-full max-w-md shadow-[0_20px_40px_rgba(0,0,0,0.15)] border ${darkMode ? "border-gray-700" : "border-white/50"}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>Add New Task</h3>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowAddTask(false)}
                  className={darkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"}
                >
                  <X size={20} />
                </motion.button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1`}>
                    Task Name
                  </label>
                  <input
                    type="text"
                    value={newTask.name}
                    onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                    placeholder="Enter task name"
                    className={`w-full py-2 px-3 rounded-lg ${
                      darkMode
                        ? "bg-gray-700 text-gray-200 border-gray-600 focus:ring-blue-500"
                        : "bg-gradient-to-r from-gray-50 to-white shadow-[0_6px_12px_rgba(0,0,0,0.04)] focus:shadow-[0_8px_16px_rgba(0,0,0,0.08)] focus:ring-blue-200"
                    }
                    focus:outline-none focus:ring-2 transition-all
                    border ${darkMode ? "border-gray-600" : "border-white/50"}`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1`}>
                    Category
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {["work", "personal", "health", "learning"].map((category) => (
                      <motion.button
                        key={category}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setNewTask({ ...newTask, category: category as any })}
                        className={`py-2 px-3 rounded-lg text-xs capitalize transition-all ${
                          newTask.category === category
                            ? darkMode
                              ? "bg-blue-600 text-white shadow-[0_6px_12px_rgba(37,99,235,0.2)]"
                              : "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-[0_6px_12px_rgba(0,0,0,0.1)]"
                            : darkMode
                              ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {category}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1`}>
                    Estimated Time (minutes)
                  </label>
                  <input
                    type="number"
                    value={newTask.estimatedTime}
                    onChange={(e) => setNewTask({ ...newTask, estimatedTime: Number.parseInt(e.target.value) })}
                    min="1"
                    className={`w-full py-2 px-3 rounded-lg ${
                      darkMode
                        ? "bg-gray-700 text-gray-200 border-gray-600 focus:ring-blue-500"
                        : "bg-gradient-to-r from-gray-50 to-white shadow-[0_6px_12px_rgba(0,0,0,0.04)] focus:shadow-[0_8px_16px_rgba(0,0,0,0.08)] focus:ring-blue-200"
                    }
                    focus:outline-none focus:ring-2 transition-all
                    border ${darkMode ? "border-gray-600" : "border-white/50"}`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1`}>
                    Importance (1-5)
                  </label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <motion.button
                        key={level}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setNewTask({ ...newTask, importance: level as 1 | 2 | 3 | 4 | 5 })}
                        className={`flex-1 py-2 rounded-lg transition-all ${
                          newTask.importance === level
                            ? darkMode
                              ? "bg-blue-600 text-white shadow-[0_6px_12px_rgba(37,99,235,0.2)]"
                              : "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-[0_6px_12px_rgba(0,0,0,0.1)]"
                            : darkMode
                              ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {level}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-1`}>
                    Notes (optional)
                  </label>
                  <textarea
                    value={newTask.notes || ""}
                    onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
                    placeholder="Add any additional details"
                    rows={3}
                    className={`w-full py-2 px-3 rounded-lg ${
                      darkMode
                        ? "bg-gray-700 text-gray-200 border-gray-600 focus:ring-blue-500"
                        : "bg-gradient-to-r from-gray-50 to-white shadow-[0_6px_12px_rgba(0,0,0,0.04)] focus:shadow-[0_8px_16px_rgba(0,0,0,0.08)] focus:ring-blue-200"
                    }
                    focus:outline-none focus:ring-2 transition-all
                    border ${darkMode ? "border-gray-600" : "border-white/50"}`}
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddTask(false)}
                  className={`px-4 py-2 rounded-lg ${
                    darkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  } transition-all`}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddTask}
                  className={`px-4 py-2 rounded-lg ${
                    darkMode
                      ? "bg-blue-600 hover:bg-blue-500"
                      : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  } text-white
                  shadow-[0_8px_16px_rgba(0,0,0,0.1)]
                  hover:shadow-[0_12px_20px_rgba(0,0,0,0.15)]
                  transition-all duration-300`}
                >
                  Add Task
                </motion.button>
              </div>
            </motion.div>
          </TiltCard>
        </motion.div>
      )}
    </div>
  )
}

