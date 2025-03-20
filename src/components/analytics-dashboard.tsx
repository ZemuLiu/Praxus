import { useState } from "react"
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  Share2,
  ChevronDown,
} from "lucide-react"

import { TiltCard } from "./praxus-desktop"

interface AnalyticsDashboardProps {
  darkMode: boolean
}

export function AnalyticsDashboard({ darkMode }: AnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState<"day" | "week" | "month" | "year">("week")

  // Sample data
  const productivityData = {
    score: 78,
    change: 12,
    taskCompletion: 85,
    focusTime: 6.2,
    distractions: 14,
  }

  const taskData = {
    completed: 18,
    pending: 7,
    overdue: 3,
    categories: [
      { name: "Work", percentage: 45, color: "blue" },
      { name: "Personal", percentage: 25, color: "purple" },
      { name: "Health", percentage: 15, color: "green" },
      { name: "Learning", percentage: 15, color: "yellow" },
    ],
  }

  const timeData = {
    mostProductiveDay: "Tuesday",
    mostProductiveTime: "10:00 AM - 12:00 PM",
    averageFocusSession: 52,
    weeklyHours: 38.5,
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>Analytics Dashboard</h2>

        <div className="flex items-center space-x-3">
          <div className={`flex p-1 rounded-lg ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
            {["day", "week", "month", "year"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range as any)}
                className={`px-3 py-1 rounded-md text-sm ${
                  timeRange === range
                    ? darkMode
                      ? "bg-gray-700 text-white"
                      : "bg-white text-gray-800 shadow-sm"
                    : darkMode
                      ? "text-gray-400 hover:text-gray-300"
                      : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>

          <button
            className={`p-2 rounded-lg ${darkMode ? "bg-gray-800 hover:bg-gray-700 text-gray-300" : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200"}`}
          >
            <Filter size={18} />
          </button>

          <button
            className={`p-2 rounded-lg ${darkMode ? "bg-gray-800 hover:bg-gray-700 text-gray-300" : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200"}`}
          >
            <Download size={18} />
          </button>

          <button
            className={`p-2 rounded-lg ${darkMode ? "bg-gray-800 hover:bg-gray-700 text-gray-300" : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200"}`}
          >
            <Share2 size={18} />
          </button>
        </div>
      </div>

      {/* Productivity Score */}
      <div className="grid grid-cols-3 gap-6">
        <TiltCard
          className={`p-6 rounded-2xl col-span-1 ${
            darkMode
              ? "bg-gray-800/60 backdrop-blur-sm border border-gray-700/50"
              : "bg-white/30 backdrop-blur-sm border border-white/50"
          } 
          shadow-[0_10px_30px_rgba(0,0,0,0.07)]`}
        >
          <div className="flex flex-col h-full">
            <div className={`text-sm font-medium mb-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Productivity Score
            </div>
            <div className="flex items-end mt-2">
              <div className={`text-4xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
                {productivityData.score}
              </div>
              <div
                className={`ml-2 flex items-center ${
                  productivityData.change > 0
                    ? darkMode
                      ? "text-green-400"
                      : "text-green-500"
                    : darkMode
                      ? "text-red-400"
                      : "text-red-500"
                }`}
              >
                {productivityData.change > 0 ? (
                  <ArrowUpRight size={16} className="mr-1" />
                ) : (
                  <ArrowDownRight size={16} className="mr-1" />
                )}
                <span className="text-sm font-medium">{Math.abs(productivityData.change)}%</span>
              </div>
            </div>

            <div className="mt-6 flex-1 flex items-end">
              <div className="w-full">
                <div className="flex justify-between text-xs mb-1">
                  <span className={darkMode ? "text-gray-400" : "text-gray-500"}>Poor</span>
                  <span className={darkMode ? "text-gray-400" : "text-gray-500"}>Excellent</span>
                </div>
                <div className={`w-full h-2 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                  <div
                    className={`h-full rounded-full ${darkMode ? "bg-blue-500" : "bg-blue-600"}`}
                    style={{ width: `${productivityData.score}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </TiltCard>

        <TiltCard
          className={`p-6 rounded-2xl col-span-2 ${
            darkMode
              ? "bg-gray-800/60 backdrop-blur-sm border border-gray-700/50"
              : "bg-white/30 backdrop-blur-sm border border-white/50"
          } 
          shadow-[0_10px_30px_rgba(0,0,0,0.07)]`}
        >
          <div className={`text-sm font-medium mb-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            Productivity Trends
          </div>

          <div className="h-48 flex items-end">
            {/* Placeholder for chart - in a real app, you'd use a charting library */}
            <div className="w-full h-full flex items-end justify-between">
              {Array.from({ length: 7 }).map((_, i) => {
                const height = 30 + Math.random() * 70
                return (
                  <div key={i} className="flex flex-col items-center">
                    <div
                      className={`w-10 rounded-t-md ${i === 2 ? (darkMode ? "bg-blue-500" : "bg-blue-600") : darkMode ? "bg-gray-700" : "bg-gray-200"}`}
                      style={{ height: `${height}%` }}
                    ></div>
                    <div className={`text-xs mt-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </TiltCard>
      </div>

      {/* Task Metrics */}
      <div className="grid grid-cols-3 gap-6">
        <TiltCard
          className={`p-6 rounded-2xl ${
            darkMode
              ? "bg-gray-800/60 backdrop-blur-sm border border-gray-700/50"
              : "bg-white/30 backdrop-blur-sm border border-white/50"
          } 
          shadow-[0_10px_30px_rgba(0,0,0,0.07)]`}
        >
          <div className={`text-sm font-medium mb-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            Task Completion
          </div>

          <div className="flex items-center justify-center mb-4">
            <div className="relative w-32 h-32">
              {/* Placeholder for pie chart */}
              <div className="absolute inset-0 rounded-full border-8 border-gray-200 dark:border-gray-700"></div>
              <div
                className="absolute inset-0 rounded-full border-8 border-blue-500 dark:border-blue-600"
                style={{
                  clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((taskData.completed / (taskData.completed + taskData.pending + taskData.overdue)) * 2 * Math.PI)}% ${50 - 50 * Math.sin((taskData.completed / (taskData.completed + taskData.pending + taskData.overdue)) * 2 * Math.PI)}%, 100% 0%, 100% 100%, 0% 100%, 0% 0%)`,
                }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <div className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
                  {Math.round((taskData.completed / (taskData.completed + taskData.pending + taskData.overdue)) * 100)}%
                </div>
                <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Completed</div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                <span className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Completed</span>
              </div>
              <span className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>
                {taskData.completed}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <span className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Pending</span>
              </div>
              <span className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>
                {taskData.pending}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <span className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Overdue</span>
              </div>
              <span className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>
                {taskData.overdue}
              </span>
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
          <div className={`text-sm font-medium mb-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            Task Categories
          </div>

          <div className="space-y-4">
            {taskData.categories.map((category) => (
              <div key={category.name} className="space-y-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full bg-${category.color}-500 mr-2`}></div>
                    <span className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{category.name}</span>
                  </div>
                  <span className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>
                    {category.percentage}%
                  </span>
                </div>
                <div className={`w-full h-2 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                  <div
                    className={`h-full rounded-full bg-${category.color}-500`}
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
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
          <div className={`text-sm font-medium mb-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            Time Insights
          </div>

          <div className="space-y-4">
            <div className={`p-3 rounded-lg ${darkMode ? "bg-gray-700/50" : "bg-gray-100"}`}>
              <div className="flex items-center">
                <Calendar className={`mr-3 ${darkMode ? "text-blue-400" : "text-blue-600"}`} size={20} />
                <div>
                  <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Most Productive Day</div>
                  <div className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>
                    {timeData.mostProductiveDay}
                  </div>
                </div>
              </div>
            </div>

            <div className={`p-3 rounded-lg ${darkMode ? "bg-gray-700/50" : "bg-gray-100"}`}>
              <div className="flex items-center">
                <Clock className={`mr-3 ${darkMode ? "text-purple-400" : "text-purple-600"}`} size={20} />
                <div>
                  <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Peak Productivity</div>
                  <div className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>
                    {timeData.mostProductiveTime}
                  </div>
                </div>
              </div>
            </div>

            <div className={`p-3 rounded-lg ${darkMode ? "bg-gray-700/50" : "bg-gray-100"}`}>
              <div className="flex items-center">
                <CheckCircle2 className={`mr-3 ${darkMode ? "text-green-400" : "text-green-600"}`} size={20} />
                <div>
                  <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Avg. Focus Session</div>
                  <div className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>
                    {timeData.averageFocusSession} minutes
                  </div>
                </div>
              </div>
            </div>

            <div className={`p-3 rounded-lg ${darkMode ? "bg-gray-700/50" : "bg-gray-100"}`}>
              <div className="flex items-center">
                <XCircle className={`mr-3 ${darkMode ? "text-red-400" : "text-red-600"}`} size={20} />
                <div>
                  <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Weekly Hours</div>
                  <div className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>
                    {timeData.weeklyHours} hours
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TiltCard>
      </div>

      {/* Detailed Analytics */}
      <TiltCard
        className={`p-6 rounded-2xl ${
          darkMode
            ? "bg-gray-800/60 backdrop-blur-sm border border-gray-700/50"
            : "bg-white/30 backdrop-blur-sm border border-white/50"
        } 
        shadow-[0_10px_30px_rgba(0,0,0,0.07)]`}
      >
        <div className="flex justify-between items-center mb-6">
          <div className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            Detailed Analytics
          </div>

          <div className="flex items-center">
            <button
              className={`flex items-center px-3 py-1.5 rounded-lg text-sm ${darkMode ? "bg-gray-700 text-gray-300" : "bg-white text-gray-700 border border-gray-200"}`}
            >
              <span>This Week</span>
              <ChevronDown size={16} className="ml-1" />
            </button>
          </div>
        </div>

        <div className="h-64 flex items-end">
          {/* Placeholder for detailed chart - in a real app, you'd use a charting library */}
          <div className="w-full h-full flex flex-col">
            <div className="flex-1 border-b border-l border-gray-300 dark:border-gray-700 relative">
              {/* Line chart placeholder */}
              <svg className="w-full h-full" viewBox="0 0 800 200">
                <path
                  d="M0,150 C100,120 200,180 300,100 C400,20 500,80 600,60 C700,40 800,90 800,90"
                  fill="none"
                  stroke={darkMode ? "#3b82f6" : "#2563eb"}
                  strokeWidth="3"
                />
                <path
                  d="M0,150 C100,120 200,180 300,100 C400,20 500,80 600,60 C700,40 800,90 800,90"
                  fill="url(#gradient)"
                  fillOpacity="0.2"
                  stroke="none"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={darkMode ? "#3b82f6" : "#2563eb"} stopOpacity="0.5" />
                    <stop offset="100%" stopColor={darkMode ? "#3b82f6" : "#2563eb"} stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Axis labels */}
              <div className="absolute bottom-0 left-0 right-0 flexustify-between px-4">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <div key={day} className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    {day}
                  </div>
                ))}
              </div>
            </div>

            <div className="h-8 flex justify-between px-4 pt-2">
              <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Productivity</div>
              <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Focus Time</div>
              <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Task Completion</div>
            </div>
          </div>
        </div>
      </TiltCard>

      {/* Recommendations */}
      <TiltCard
        className={`p-6 rounded-2xl ${
          darkMode
            ? "bg-gray-800/60 backdrop-blur-sm border border-gray-700/50"
            : "bg-white/30 backdrop-blur-sm border border-white/50"
        } 
        shadow-[0_10px_30px_rgba(0,0,0,0.07)]`}
      >
        <div className={`text-sm font-medium mb-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          AI Recommendations
        </div>

        <div className="space-y-4">
          <div
            className={`p-4 rounded-xl ${darkMode ? "bg-blue-900/20 border border-blue-800/30" : "bg-blue-50 border border-blue-100"}`}
          >
            <div className={`font-medium mb-1 ${darkMode ? "text-blue-300" : "text-blue-700"}`}>
              Optimize Your Schedule
            </div>
            <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              Your most productive hours are between 10 AM and 12 PM. Consider scheduling your most important tasks
              during this time window.
            </p>
          </div>

          <div
            className={`p-4 rounded-xl ${darkMode ? "bg-purple-900/20 border border-purple-800/30" : "bg-purple-50 border border-purple-100"}`}
          >
            <div className={`font-medium mb-1 ${darkMode ? "text-purple-300" : "text-purple-700"}`}>
              Reduce Distractions
            </div>
            <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              You're experiencing an average of 14 distractions per day. Try using focus mode or time blocking to
              minimize interruptions.
            </p>
          </div>

          <div
            className={`p-4 rounded-xl ${darkMode ? "bg-green-900/20 border border-green-800/30" : "bg-green-50 border border-green-100"}`}
          >
            <div className={`font-medium mb-1 ${darkMode ? "text-green-300" : "text-green-700"}`}>
              Task Distribution
            </div>
            <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              Your work tasks take up 45% of your time. Consider balancing your schedule with more health and personal
              activities for better well-being.
            </p>
          </div>
        </div>
      </TiltCard>
    </div>
  )
}

