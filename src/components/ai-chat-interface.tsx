"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Send, Mic, Image, User, Bot } from "lucide-react"
import { ipcBridge } from "@/lib/ipc-bridge"

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

export default function AIChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hello! I'm your AI assistant. How can I help you today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  const handleSendMessage = async () => {
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

    // Show AI typing indicator
    setIsTyping(true)

    try {
      // Send message to backend via IPC
      const response = await ipcBridge.chat(inputValue);
      
      if (response.success && response.data) {
        // Parse the response which comes as a string from Python
        const responseData = typeof response.data === 'string' 
          ? JSON.parse(response.data) 
          : response.data;
        
        const aiResponse: Message = {
          id: messages.length + 2,
          content: responseData.text || "Sorry, I couldn't process that request.",
          sender: "ai",
          timestamp: new Date(),
        }
        
        setMessages((prev) => [...prev, aiResponse])
      } else {
        // Handle error
        const errorResponse: Message = {
          id: messages.length + 2,
          content: "Sorry, I encountered an error processing your request.",
          sender: "ai",
          timestamp: new Date(),
        }
        
        setMessages((prev) => [...prev, errorResponse])
        console.error("Chat API error:", response.error)
      }
    } catch (error) {
      console.error("Error sending message:", error)
      
      // Add error message
      const errorResponse: Message = {
        id: messages.length + 2,
        content: "Sorry, there was an error connecting to the AI service. Please try again later.",
        sender: "ai",
        timestamp: new Date(),
      }
      
      setMessages((prev) => [...prev, errorResponse])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-white to-gray-50">
      <div className="absolute inset-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 h-screen max-w-4xl flex flex-col">
        {/* Chat header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl p-4 mb-4 bg-white bg-opacity-80 backdrop-blur-sm
                    shadow-[8px_8px_16px_#d9d9d9,-8px_-8px_16px_#ffffff]"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-inner">
              <Bot className="text-white" size={20} />
            </div>
            <div className="ml-3">
              <h2 className="font-semibold text-gray-800">Praxus AI Assistant</h2>
              <p className="text-xs text-gray-500">Powered by Mistral</p>
            </div>
          </div>
        </motion.div>

        {/* Chat messages container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-1 overflow-y-auto rounded-2xl p-6 mb-4 bg-white bg-opacity-80 backdrop-blur-sm
                    shadow-[8px_8px_16px_#d9d9d9,-8px_-8px_16px_#ffffff]"
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
                <div className={`flex items-start max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.sender === "user"
                        ? "bg-gradient-to-br from-blue-500 to-indigo-600 ml-2"
                        : "bg-gradient-to-br from-purple-400 to-pink-500 mr-2"
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
                        ? "bg-gradient-to-r from-blue-50 to-indigo-50 shadow-[3px_3px_6px_#d9d9d9,-3px_-3px_6px_#ffffff]"
                        : "bg-gradient-to-r from-gray-50 to-white shadow-[inset_3px_3px_6px_#d9d9d9,inset_-3px_-3px_6px_#ffffff]"
                    }`}
                  >
                    <p className="text-gray-800 whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                <div className="flex items-start max-w-[80%]">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center mr-2">
                    <Bot className="text-white" size={16} />
                  </div>
                  <div className="rounded-2xl px-4 py-3 bg-gradient-to-r from-gray-50 to-white shadow-[inset_3px_3px_6px_#d9d9d9,inset_-3px_-3px_6px_#ffffff]">
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
            
            {/* Invisible div for auto-scrolling */}
            <div ref={messagesEndRef} />
          </div>
        </motion.div>

        {/* Input area */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="rounded-2xl p-4 bg-white bg-opacity-80 backdrop-blur-sm
                    shadow-[8px_8px_16px_#d9d9d9,-8px_-8px_16px_#ffffff]"
        >
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-10 w-10 mr-2 bg-gradient-to-r from-gray-50 to-white
                        shadow-[3px_3px_6px_#d9d9d9,-3px_-3px_6px_#ffffff]
                        hover:shadow-[inset_3px_3px_6px_#d9d9d9,inset_-3px_-3px_6px_#ffffff]
                        transition-all duration-300"
            >
              <Image className="text-gray-500" size={18} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-10 w-10 mr-2 bg-gradient-to-r from-gray-50 to-white
                        shadow-[3px_3px_6px_#d9d9d9,-3px_-3px_6px_#ffffff]
                        hover:shadow-[inset_3px_3px_6px_#d9d9d9,inset_-3px_-3px_6px_#ffffff]
                        transition-all duration-300"
            >
              <Mic className="text-gray-500" size={18} />
            </Button>
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendMessage()
                }}
                placeholder="Type your message..."
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-gray-50 to-white
                          shadow-[inset_3px_3px_6px_#d9d9d9,inset_-3px_-3px_6px_#ffffff]
                          focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </div>
            <Button
              onClick={handleSendMessage}
              className="ml-2 rounded-full h-12 w-12 bg-gradient-to-br from-blue-400 to-purple-500
                        shadow-[3px_3px_6px_#d9d9d9,-3px_-3px_6px_#ffffff]
                        hover:shadow-[2px_2px_4px_#d9d9d9,-2px_-2px_4px_#ffffff]
                        hover:from-blue-500 hover:to-purple-600
                        transition-all duration-300"
              disabled={isTyping || !inputValue.trim()}
            >
              <Send className="text-white" size={18} />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

