import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Mic, Image, User, Bot, Calendar, Clock, BarChart3, Plus, X, Check, ChevronRight } from "lucide-react"

function FloatingPaths({ position }: { position: number }) {
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
    <div className="absolute inset-0 pointer-events-none">
      <svg className="w-full h-full text-slate-200" viewBox="0 0 696 316" fill="none">
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.1 + path.id * 0.02}
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

interface Message {
  id: number
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

interface Task {
  id: number
  name: string
  estimatedTime: number // in minutes
  importance: 1 | 2 | 3 | 4 | 5
  deadline?: Date
  notes?: string
  completed: boolean
}

export default function PraxusInterface() {
  const [activeTab, setActiveTab] = useState<"chat" | "planning">("chat")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hello! I'm Praxus, your AI assistant. How can I help you today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  // Planning state
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, name: "Review project proposal", estimatedTime: 45, importance: 4, completed: false },
    {
      id: 2,
      name: "Team meeting",
      estimatedTime: 60,
      importance: 5,
      deadline: new Date(Date.now() + 3600000),
      completed: false,
    },
    { id: 3, name: "Update documentation", estimatedTime: 90, importance: 3, completed: false },
  ])
  const [newTask, setNewTask] = useState<Partial<Task>>({
    name: "",
    estimatedTime: 30,
    importance: 3,
  })
  const [showAddTask, setShowAddTask] = useState(false)
  const [optimizedSchedule, setOptimizedSchedule] = useState<boolean>(false)

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    // Add user message
    const newUserMessage: Message = {
      id: messages.length + 1,
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages([...messages, newUserMessage])
    setInputValue("")

    // Simulate AI typing
    setIsTyping(true)

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        content: `I understand you're asking about "${inputValue}". That's an interesting topic! How else can I assist you?`,
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
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
    }

    setTasks([...tasks, task])
    setNewTask({
      name: "",
      estimatedTime: 30,
      importance: 3,
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
    // For now, we'll just sort by importance and estimated time
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
    }, 1500)
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-white to-gray-50">
      <div className="absolute inset-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 h-screen max-w-4xl flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl p-4 mb-4 bg-white bg-opacity-90 backdrop-blur-sm
                    shadow-[0_10px_25px_rgba(0,0,0,0.05)]
                    before:content-[''] before:absolute before:inset-0 before:rounded-2xl
                    before:bg-gradient-to-b before:from-white before:to-transparent before:opacity-70"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div
                className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center
                            shadow-[0_0_15px_rgba(102,126,234,0.5)]"
              >
                <Bot className="text-white" size={20} />
              </div>
              <div className="ml-3">
                <h2 className="font-semibold text-gray-800">Praxus</h2>
                <p className="text-xs text-gray-500">AI Assistant & Planner</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab("chat")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === "chat"
                    ? "bg-white text-blue-600 shadow-[0_2px_10px_rgba(0,0,0,0.05)]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Chat
              </button>
              <button
                onClick={() => setActiveTab("planning")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === "planning"
                    ? "bg-white text-blue-600 shadow-[0_2px_10px_rgba(0,0,0,0.05)]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Planning
              </button>
            </div>
          </div>
        </motion.div>

        {/* Main content area */}
        <AnimatePresence mode="wait">
          {activeTab === "chat" ? (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col"
            >
              {/* Chat messages container */}
              <div
                className="flex-1 overflow-y-auto rounded-2xl p-6 mb-4 bg-white bg-opacity-90 backdrop-blur-sm
                          shadow-[0_10px_25px_rgba(0,0,0,0.05)]
                          before:content-[''] before:absolute before:inset-0 before:rounded-2xl
                          before:bg-gradient-to-b before:from-white before:to-transparent before:opacity-70"
              >
                <div className="space-y-4">
                  {messages.map((message) => (
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
                              ? "bg-gradient-to-br from-blue-500 to-indigo-600 ml-2 shadow-[0_0_10px_rgba(79,70,229,0.4)]"
                              : "bg-gradient-to-br from-purple-400 to-pink-500 mr-2 shadow-[0_0_10px_rgba(219,39,119,0.4)]"
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
                              ? "bg-gradient-to-r from-blue-50 to-indigo-50 shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
                              : "bg-white shadow-[0_4px_12px_rgba(0,0,0,0.03)]"
                          }`}
                        >
                          <p className="text-gray-800">{message.content}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="flex items-start max-w-[80%]">
                        <div
                          className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center mr-2
                                      shadow-[0_0_10px_rgba(219,39,119,0.4)]"
                        >
                          <Bot className="text-white" size={16} />
                        </div>
                        <div className="rounded-2xl px-4 py-3 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
                          <div className="flex space-x-1">
                            <div
                              className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"
                              style={{ animationDelay: "0ms" }}
                            ></div>
                            <div
                              className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"
                              style={{ animationDelay: "150ms" }}
                            ></div>
                            <div
                              className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"
                              style={{ animationDelay: "300ms" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Input area */}
              <div
                className="rounded-2xl p-4 bg-white bg-opacity-90 backdrop-blur-sm
                            shadow-[0_10px_25px_rgba(0,0,0,0.05)]
                            before:content-[''] before:absolute before:inset-0 before:rounded-2xl
                            before:bg-gradient-to-b before:from-white before:to-transparent before:opacity-70"
              >
                <div className="flex items-center">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="rounded-full h-10 w-10 mr-2 bg-white flex items-center justify-center
                              shadow-[0_4px_12px_rgba(0,0,0,0.05)]
                              hover:shadow-[0_6px_16px_rgba(0,0,0,0.1)]
                              transition-all duration-300
                              before:content-[''] before:absolute before:inset-0 before:rounded-full
                              before:bg-gradient-to-b before:from-white before:to-transparent before:opacity-70"
                  >
                    <Image className="text-gray-500" size={18} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="rounded-full h-10 w-10 mr-2 bg-white flex items-center justify-center
                              shadow-[0_4px_12px_rgba(0,0,0,0.05)]
                              hover:shadow-[0_6px_16px_rgba(0,0,0,0.1)]
                              transition-all duration-300
                              before:content-[''] before:absolute before:inset-0 before:rounded-full
                              before:bg-gradient-to-b before:from-white before:to-transparent before:opacity-70"
                  >
                    <Mic className="text-gray-500" size={18} />
                  </motion.button>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSendMessage()
                      }}
                      placeholder="Type your message..."
                      className="w-full py-3 px-4 rounded-xl bg-white
                                shadow-[0_4px_12px_rgba(0,0,0,0.03)]
                                focus:shadow-[0_6px_16px_rgba(0,0,0,0.1)]
                                focus:outline-none focus:ring-1 focus:ring-blue-200 transition-all"
                    />
                    <div
                      className="absolute inset-0 rounded-xl pointer-events-none
                                  bg-gradient-to-b from-white to-transparent opacity-50"
                    ></div>
                  </div>
                  <motion.button
                    onClick={handleSendMessage}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="ml-2 rounded-full h-12 w-12 bg-gradient-to-br from-blue-400 to-purple-500
                              shadow-[0_4px_12px_rgba(102,126,234,0.5)]
                              hover:shadow-[0_8px_20px_rgba(102,126,234,0.7)]
                              transition-all duration-300
                              flex items-center justify-center"
                  >
                    <Send className="text-white" size={18} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="planning"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col"
            >
              {/* Planning container */}
              <div
                className="flex-1 overflow-y-auto rounded-2xl p-6 mb-4 bg-white bg-opacity-90 backdrop-blur-sm
                          shadow-[0_10px_25px_rgba(0,0,0,0.05)]
                          before:content-[''] before:absolute before:inset-0 before:rounded-2xl
                          before:bg-gradient-to-b before:from-white before:to-transparent before:opacity-70"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">Today's Tasks</h2>
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowAddTask(true)}
                      className="rounded-lg px-3 py-2 bg-white text-blue-600 text-sm font-medium
                                shadow-[0_4px_12px_rgba(0,0,0,0.05)]
                                hover:shadow-[0_6px_16px_rgba(0,0,0,0.1)]
                                transition-all duration-300
                                flex items-center"
                    >
                      <Plus size={16} className="mr-1" />
                      Add Task
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={optimizeSchedule}
                      className="rounded-lg px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium
                                shadow-[0_4px_12px_rgba(102,126,234,0.3)]
                                hover:shadow-[0_6px_16px_rgba(102,126,234,0.5)]
                                transition-all duration-300
                                flex items-center"
                    >
                      <BarChart3 size={16} className="mr-1" />
                      Optimize
                    </motion.button>
                  </div>
                </div>

                {/* Task list */}
                <div className="space-y-3">
                  {optimizedSchedule && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-xl mb-4"
                    >
                      <p className="text-sm text-blue-700">
                        <span className="font-medium">Praxus AI</span>: I've optimized your schedule based on task
                        importance, deadlines, and estimated time.
                      </p>
                    </motion.div>
                  )}

                  {tasks.map((task) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`p-4 rounded-xl bg-white shadow-[0_4px_12px_rgba(0,0,0,0.03)]
                                hover:shadow-[0_6px_16px_rgba(0,0,0,0.08)]
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
                                      ${task.completed ? "bg-green-100 text-green-500" : "bg-gray-100 text-gray-400"}`}
                          >
                            {task.completed ? <Check size={14} /> : null}
                          </motion.button>
                          <div>
                            <h3
                              className={`font-medium ${task.completed ? "text-gray-400 line-through" : "text-gray-800"}`}
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
                            </div>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1, x: 2 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-gray-400 hover:text-blue-500 transition-colors"
                        >
                          <ChevronRight size={18} />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Add task form */}
                <AnimatePresence>
                  {showAddTask && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50"
                      onClick={() => setShowAddTask(false)}
                    >
                      <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.9 }}
                        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-[0_10px_25px_rgba(0,0,0,0.1)]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold text-gray-800">Add New Task</h3>
                          <motion.button
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setShowAddTask(false)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X size={20} />
                          </motion.button>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Task Name</label>
                            <input
                              type="text"
                              value={newTask.name}
                              onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                              placeholder="Enter task name"
                              className="w-full py-2 px-3 rounded-lg bg-white
                                        shadow-[0_2px_8px_rgba(0,0,0,0.05)]
                                        focus:shadow-[0_4px_12px_rgba(0,0,0,0.1)]
                                        focus:outline-none focus:ring-1 focus:ring-blue-200 transition-all"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Estimated Time (minutes)
                            </label>
                            <input
                              type="number"
                              value={newTask.estimatedTime}
                              onChange={(e) =>
                                setNewTask({ ...newTask, estimatedTime: Number.parseInt(e.target.value) })
                              }
                              min="1"
                              className="w-full py-2 px-3 rounded-lg bg-white
                                        shadow-[0_2px_8px_rgba(0,0,0,0.05)]
                                        focus:shadow-[0_4px_12px_rgba(0,0,0,0.1)]
                                        focus:outline-none focus:ring-1 focus:ring-blue-200 transition-all"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Importance (1-5)</label>
                            <div className="flex space-x-2">
                              {[1, 2, 3, 4, 5].map((level) => (
                                <motion.button
                                  key={level}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => setNewTask({ ...newTask, importance: level as 1 | 2 | 3 | 4 | 5 })}
                                  className={`flex-1 py-2 rounded-lg transition-all ${
                                    newTask.importance === level
                                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-[0_4px_12px_rgba(102,126,234,0.3)]"
                                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                  }`}
                                >
                                  {level}
                                </motion.button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                            <textarea
                              value={newTask.notes || ""}
                              onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
                              placeholder="Add any additional details"
                              rows={3}
                              className="w-full py-2 px-3 rounded-lg bg-white
                                        shadow-[0_2px_8px_rgba(0,0,0,0.05)]
                                        focus:shadow-[0_4px_12px_rgba(0,0,0,0.1)]
                                        focus:outline-none focus:ring-1 focus:ring-blue-200 transition-all"
                            />
                          </div>
                        </div>

                        <div className="mt-6 flex justify-end space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowAddTask(false)}
                            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
                          >
                            Cancel
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleAddTask}
                            className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white
                                      shadow-[0_4px_12px_rgba(102,126,234,0.3)]
                                      hover:shadow-[0_6px_16px_rgba(102,126,234,0.5)]
                                      transition-all duration-300"
                          >
                            Add Task
                          </motion.button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Planning input area */}
              <div
                className="rounded-2xl p-4 bg-white bg-opacity-90 backdrop-blur-sm
                            shadow-[0_10px_25px_rgba(0,0,0,0.05)]
                            before:content-[''] before:absolute before:inset-0 before:rounded-2xl
                            before:bg-gradient-to-b before:from-white before:to-transparent before:opacity-70"
              >
                <div className="flex items-center">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Ask Praxus about your schedule..."
                      className="w-full py-3 px-4 rounded-xl bg-white
                                shadow-[0_4px_12px_rgba(0,0,0,0.03)]
                                focus:shadow-[0_6px_16px_rgba(0,0,0,0.1)]
                                focus:outline-none focus:ring-1 focus:ring-blue-200 transition-all"
                    />
                    <div
                      className="absolute inset-0 rounded-xl pointer-events-none
                                  bg-gradient-to-b from-white to-transparent opacity-50"
                    ></div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="ml-2 rounded-full h-12 w-12 bg-gradient-to-br from-blue-400 to-purple-500
                              shadow-[0_4px_12px_rgba(102,126,234,0.5)]
                              hover:shadow-[0_8px_20px_rgba(102,126,234,0.7)]
                              transition-all duration-300
                              flex items-center justify-center"
                  >
                    <Send className="text-white" size={18} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

