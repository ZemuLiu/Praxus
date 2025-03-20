"use client"

import { useState } from "react"
import { Palette, ChevronRight, Check, Moon, Sun } from "lucide-react"

interface SettingsPageProps {
  darkMode: boolean
}

export function AppearanceSettings({ darkMode }: SettingsPageProps) {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system")
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">("medium")

  return (
    <div className="space-y-6">
      <h2 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>Appearance Settings</h2>

      <div className="space-y-4">
        <div>
          <h3 className={`text-md font-medium ${darkMode ? "text-gray-200" : "text-gray-700"} mb-3`}>Theme</h3>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setTheme("light")}
              className={`p-4 rounded-xl flex flex-col items-center justify-center border ${
                theme === "light"
                  ? darkMode
                    ? "bg-blue-900/30 border-blue-700"
                    : "bg-blue-50 border-blue-200"
                  : darkMode
                    ? "bg-gray-800 border-gray-700 hover:bg-gray-700"
                    : "bg-white border-gray-200 hover:bg-gray-50"
              }`}
            >
              <Sun size={24} className={darkMode ? "text-gray-300" : "text-gray-700"} />
              <span className={`mt-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Light</span>
              {theme === "light" && (
                <div className={`absolute top-2 right-2 rounded-full p-1 ${darkMode ? "bg-blue-700" : "bg-blue-500"}`}>
                  <Check size={12} className="text-white" />
                </div>
              )}
            </button>

            <button
              onClick={() => setTheme("dark")}
              className={`p-4 rounded-xl flex flex-col items-center justify-center border ${
                theme === "dark"
                  ? darkMode
                    ? "bg-blue-900/30 border-blue-700"
                    : "bg-blue-50 border-blue-200"
                  : darkMode
                    ? "bg-gray-800 border-gray-700 hover:bg-gray-700"
                    : "bg-white border-gray-200 hover:bg-gray-50"
              }`}
            >
              <Moon size={24} className={darkMode ? "text-gray-300" : "text-gray-700"} />
              <span className={`mt-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Dark</span>
              {theme === "dark" && (
                <div className={`absolute top-2 right-2 rounded-full p-1 ${darkMode ? "bg-blue-700" : "bg-blue-500"}`}>
                  <Check size={12} className="text-white" />
                </div>
              )}
            </button>

            <button
              onClick={() => setTheme("system")}
              className={`p-4 rounded-xl flex flex-col items-center justify-center border ${
                theme === "system"
                  ? darkMode
                    ? "bg-blue-900/30 border-blue-700"
                    : "bg-blue-50 border-blue-200"
                  : darkMode
                    ? "bg-gray-800 border-gray-700 hover:bg-gray-700"
                    : "bg-white border-gray-200 hover:bg-gray-50"
              }`}
            >
              <Palette size={24} className={darkMode ? "text-gray-300" : "text-gray-700"} />
              <span className={`mt-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>System</span>
              {theme === "system" && (
                <div className={`absolute top-2 right-2 rounded-full p-1 ${darkMode ? "bg-blue-700" : "bg-blue-500"}`}>
                  <Check size={12} className="text-white" />
                </div>
              )}
            </button>
          </div>
        </div>

        <div>
          <h3 className={`text-md font-medium ${darkMode ? "text-gray-200" : "text-gray-700"} mb-3`}>Font Size</h3>
          <div className="space-y-2">
            {["small", "medium", "large"].map((size) => (
              <button
                key={size}
                onClick={() => setFontSize(size as any)}
                className={`w-full p-3 rounded-lg flex items-center justify-between ${
                  fontSize === size
                    ? darkMode
                      ? "bg-blue-900/30 border border-blue-700"
                      : "bg-blue-50 border border-blue-200"
                    : darkMode
                      ? "bg-gray-800 border border-gray-700 hover:bg-gray-700"
                      : "bg-white border border-gray-200 hover:bg-gray-50"
                }`}
              >
                <span className={`${darkMode ? "text-gray-300" : "text-gray-700"} capitalize`}>{size}</span>
                {fontSize === size && <Check size={16} className={darkMode ? "text-blue-400" : "text-blue-600"} />}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className={`text-md font-medium ${darkMode ? "text-gray-200" : "text-gray-700"} mb-3`}>Animation</h3>
          <div
            className={`p-4 rounded-xl border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className={`font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Reduce Motion</div>
                <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Minimize animations throughout the app
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function NotificationSettings({ darkMode }: SettingsPageProps) {
  return (
    <div className="space-y-6">
      <h2 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>Notification Settings</h2>

      <div className="space-y-4">
        <div
          className={`p-4 rounded-xl border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className={`font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Push Notifications</div>
              <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                Receive notifications on your device
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        <div
          className={`p-4 rounded-xl border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className={`font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Email Notifications</div>
              <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                Receive notifications via email
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        <div
          className={`p-4 rounded-xl border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className={`font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Sound</div>
              <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                Play sound for notifications
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        <div>
          <h3 className={`text-md font-medium ${darkMode ? "text-gray-200" : "text-gray-700"} mb-3`}>
            Notification Types
          </h3>
          <div className="space-y-3">
            {["Task reminders", "Schedule changes", "AI suggestions", "System updates"].map((item) => (
              <div
                key={item}
                className={`p-4 rounded-xl border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
              >
                <div className="flex items-center justify-between">
                  <div className={`font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>{item}</div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      value=""
                      className="sr-only peer"
                      defaultChecked={item !== "System updates"}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function PrivacySecuritySettings({ darkMode }: SettingsPageProps) {
  return (
    <div className="space-y-6">
      <h2 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>Privacy & Security</h2>

      <div className="space-y-4">
        <div
          className={`p-4 rounded-xl border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className={`font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
                Two-Factor Authentication
              </div>
              <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                Add an extra layer of security
              </div>
            </div>
            <button
              className={`px-3 py-1 rounded-lg text-sm ${darkMode ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600"}`}
            >
              Enable
            </button>
          </div>
        </div>

        <div
          className={`p-4 rounded-xl border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className={`font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Data Collection</div>
              <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                Allow anonymous usage data collection
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        <div
          className={`p-4 rounded-xl border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className={`font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Show Online Status</div>
              <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                Let others see when you're active
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        <div>
          <h3 className={`text-md font-medium ${darkMode ? "text-gray-200" : "text-gray-700"} mb-3`}>Security</h3>
          <div className="space-y-3">
            <button
              className={`w-full p-4 rounded-xl border text-left flex items-center justify-between ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
            >
              <div className={`font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Change Password</div>
              <ChevronRight size={18} className={darkMode ? "text-gray-400" : "text-gray-500"} />
            </button>

            <button
              className={`w-full p-4 rounded-xl border text-left flex items-center justify-between ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
            >
              <div className={`font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Manage Devices</div>
              <ChevronRight size={18} className={darkMode ? "text-gray-400" : "text-gray-500"} />
            </button>

            <button
              className={`w-full p-4 rounded-xl border text-left flex items-center justify-between ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
            >
              <div className={`font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Privacy Policy</div>
              <ChevronRight size={18} className={darkMode ? "text-gray-400" : "text-gray-500"} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function LanguageRegionSettings({ darkMode }: SettingsPageProps) {
  return (
    <div className="space-y-6">
      <h2 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>Language & Region</h2>

      <div className="space-y-4">
        <div>
          <h3 className={`text-md font-medium ${darkMode ? "text-gray-200" : "text-gray-700"} mb-3`}>Language</h3>
          <div
            className={`p-4 rounded-xl border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
          >
            <select
              className={`w-full bg-transparent ${darkMode ? "text-gray-200" : "text-gray-700"} focus:outline-none`}
            >
              <option value="en">English (US)</option>
              <option value="en-gb">English (UK)</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="es">Español</option>
              <option value="ja">日本語</option>
              <option value="zh">中文</option>
            </select>
          </div>
        </div>

        <div>
          <h3 className={`text-md font-medium ${darkMode ? "text-gray-200" : "text-gray-700"} mb-3`}>Time Zone</h3>
          <div
            className={`p-4 rounded-xl border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
          >
            <select
              className={`w-full bg-transparent ${darkMode ? "text-gray-200" : "text-gray-700"} focus:outline-none`}
            >
              <option value="pst">Pacific Time (US & Canada)</option>
              <option value="est">Eastern Time (US & Canada)</option>
              <option value="cst">Central Time (US & Canada)</option>
              <option value="mst">Mountain Time (US & Canada)</option>
              <option value="utc">UTC</option>
              <option value="gmt">GMT (London)</option>
              <option value="cet">CET (Paris, Berlin)</option>
              <option value="jst">JST (Tokyo)</option>
            </select>
          </div>
        </div>

        <div>
          <h3 className={`text-md font-medium ${darkMode ? "text-gray-200" : "text-gray-700"} mb-3`}>Date Format</h3>
          <div className="grid grid-cols-3 gap-3">
            {["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"].map((format) => (
              <button
                key={format}
                className={`p-3 rounded-xl flex items-center justify-center border ${
                  format === "MM/DD/YYYY"
                    ? darkMode
                      ? "bg-blue-900/30 border-blue-700"
                      : "bg-blue-50 border-blue-200"
                    : darkMode
                      ? "bg-gray-800 border-gray-700 hover:bg-gray-700"
                      : "bg-white border-gray-200 hover:bg-gray-50"
                }`}
              >
                <span className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{format}</span>
                {format === "MM/DD/YYYY" && (
                  <div className="absolute top-2 right-2 rounded-full p-1 bg-blue-500">
                    <Check size={10} className="text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className={`text-md font-medium ${darkMode ? "text-gray-200" : "text-gray-700"} mb-3`}>Time Format</h3>
          <div className="grid grid-cols-2 gap-3">
            {["12-hour", "24-hour"].map((format) => (
              <button
                key={format}
                className={`p-3 rounded-xl flex items-center justify-center border ${
                  format === "12-hour"
                    ? darkMode
                      ? "bg-blue-900/30 border-blue-700"
                      : "bg-blue-50 border-blue-200"
                    : darkMode
                      ? "bg-gray-800 border-gray-700 hover:bg-gray-700"
                      : "bg-white border-gray-200 hover:bg-gray-50"
                }`}
              >
                <span className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{format}</span>
                {format === "12-hour" && (
                  <div className="absolute top-2 right-2 rounded-full p-1 bg-blue-500">
                    <Check size={10} className="text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function SubscriptionSettings({ darkMode }: SettingsPageProps) {
  return (
    <div className="space-y-6">
      <h2 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>Subscription</h2>

      <div
        className={`p-6 rounded-2xl border ${darkMode ? "bg-gray-800/80 border-gray-700" : "bg-white border-gray-200"} mb-6`}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>Premium Plan</div>
            <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Your subscription is active</div>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium ${darkMode ? "bg-green-900/30 text-green-400" : "bg-green-100 text-green-600"}`}
          >
            Active
          </div>
        </div>

        <div className={`p-4 rounded-xl ${darkMode ? "bg-gray-700/50" : "bg-gray-50"} mb-4`}>
          <div className="flex justify-between items-center">
            <div>
              <div className={`font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Next billing date</div>
              <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>April 15, 2025</div>
            </div>
            <div className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>$9.99/mo</div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            className={`w-full p-3 rounded-lg ${darkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-800"}`}
          >
            Manage Payment Methods
          </button>
          <button
            className={`w-full p-3 rounded-lg ${darkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-800"}`}
          >
            View Billing History
          </button>
          <button
            className={`w-full p-3 rounded-lg ${darkMode ? "bg-red-900/30 hover:bg-red-900/50 text-red-400" : "bg-red-50 hover:bg-red-100 text-red-600"}`}
          >
            Cancel Subscription
          </button>
        </div>
      </div>

      <div>
        <h3 className={`text-md font-medium ${darkMode ? "text-gray-200" : "text-gray-700"} mb-4`}>Available Plans</h3>
        <div className="space-y-4">
          <div
            className={`p-4 rounded-xl border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className={`font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Basic</div>
                <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Limited features</div>
              </div>
              <div className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>Free</div>
            </div>
            <button
              className={`w-full p-2 rounded-lg ${darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-500"}`}
              disabled
            >
              Current Plan
            </button>
          </div>

          <div
            className={`p-4 rounded-xl border ${darkMode ? "bg-blue-900/20 border-blue-800/30" : "bg-blue-50 border-blue-200"}`}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className={`font-medium ${darkMode ? "text-blue-300" : "text-blue-700"}`}>Premium</div>
                <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>All features included</div>
              </div>
              <div className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>$9.99/mo</div>
            </div>
            <button
              className={`w-full p-2 rounded-lg ${darkMode ? "bg-blue-600 text-white" : "bg-blue-500 text-white"}`}
            >
              Upgrade
            </button>
          </div>

          <div
            className={`p-4 rounded-xl border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className={`font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Enterprise</div>
                <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  For teams and organizations
                </div>
              </div>
              <div className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>Contact Us</div>
            </div>
            <button
              className={`w-full p-2 rounded-lg ${darkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-800"}`}
            >
              Get in Touch
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function HelpSupportSettings({ darkMode }: SettingsPageProps) {
  return (
    <div className="space-y-6">
      <h2 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>Help & Support</h2>

      <div className="space-y-4">
        <div
          className={`p-4 rounded-xl border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
        >
          <h3 className={`font-medium ${darkMode ? "text-gray-200" : "text-gray-700"} mb-2`}>
            Frequently Asked Questions
          </h3>
          <div className="space-y-3 mt-4">
            {[
              "How do I create a new task?",
              "Can I export my schedule?",
              "How does the AI optimization work?",
              "How do I change my password?",
              "Can I use Praxus offline?",
            ].map((question) => (
              <button
                key={question}
                className={`w-full p-3 rounded-lg text-left flex items-center justify-between ${darkMode ? "bg-gray-700 hover:bg-gray-600 text-gray-300" : "bg-gray-50 hover:bg-gray-100 text-gray-700"}`}
              >
                <span>{question}</span>
                <ChevronRight size={18} className={darkMode ? "text-gray-400" : "text-gray-500"} />
              </button>
            ))}
          </div>
        </div>

        <div
          className={`p-4 rounded-xl border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
        >
          <h3 className={`font-medium ${darkMode ? "text-gray-200" : "text-gray-700"} mb-2`}>Contact Support</h3>
          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"} mb-4`}>
            Our support team is available 24/7 to help you with any issues.
          </p>
          <button
            className={`w-full p-3 rounded-lg ${darkMode ? "bg-blue-600 hover:bg-blue-500 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
          >
            Contact Support
          </button>
        </div>

        <div
          className={`p-4 rounded-xl border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
        >
          <h3 className={`font-medium ${darkMode ? "text-gray-200" : "text-gray-700"} mb-2`}>Documentation</h3>
          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"} mb-4`}>
            Explore our comprehensive documentation to learn more about Praxus.
          </p>
          <button
            className={`w-full p-3 rounded-lg ${darkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-800"}`}
          >
            View Documentation
          </button>
        </div>
      </div>
    </div>
  )
}

export function AboutSettings({ darkMode }: SettingsPageProps) {
  return (
    <div className="space-y-6">
      <h2 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>About Praxus</h2>

      <div
        className={`p-6 rounded-2xl border ${darkMode ? "bg-gray-800/80 border-gray-700" : "bg-white border-gray-200"} mb-6`}
      >
        <div className="flex items-center mb-6">
          <div
            className={`w-16 h-16 rounded-xl ${darkMode ? "bg-blue-600" : "bg-gradient-to-br from-blue-500 to-purple-500"} flex items-center justify-center mr-4`}
          >
            <span className="text-white text-2xl font-bold">P</span>
          </div>
          <div>
            <div className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>Praxus</div>
            <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Version 1.2.4</div>
          </div>
        </div>

        <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} mb-4`}>
          Praxus is an AI-powered productivity assistant designed to help you organize your tasks, optimize your
          schedule, and boost your productivity.
        </p>

        <div className={`p-3 rounded-lg ${darkMode ? "bg-gray-700/50" : "bg-gray-50"} mb-4`}>
          <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            © 2025 Praxus Technologies, Inc. All rights reserved.
          </div>
        </div>

        <div className="space-y-3">
          <button
            className={`w-full p-3 rounded-lg ${darkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-800"}`}
          >
            Terms of Service
          </button>
          <button
            className={`w-full p-3 rounded-lg ${darkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-800"}`}
          >
            Privacy Policy
          </button>
          <button
            className={`w-full p-3 rounded-lg ${darkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-800"}`}
          >
            Licenses
          </button>
        </div>
      </div>

      <div>
        <h3 className={`text-md font-medium ${darkMode ? "text-gray-200" : "text-gray-700"} mb-4`}>Development Team</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { name: "Alex Johnson", role: "Lead Developer" },
            { name: "Sarah Chen", role: "UI/UX Designer" },
            { name: "Michael Rodriguez", role: "AI Engineer" },
            { name: "Emma Wilson", role: "Product Manager" },
          ].map((person) => (
            <div
              key={person.name}
              className={`p-4 rounded-xl border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
            >
              <div className={`font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>{person.name}</div>
              <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{person.role}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

