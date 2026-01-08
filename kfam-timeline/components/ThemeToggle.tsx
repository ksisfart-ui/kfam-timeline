'use client'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className="w-14 h-8" />

  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative w-14 h-8 rounded-full bg-stone-200 dark:bg-stone-700 transition-colors duration-300 focus:outline-none shadow-inner"
      aria-label="Toggle Dark Mode"
    >
      {/* 背景のアイコン配置 */}
      <div className="flex justify-between items-center w-full px-1.5 text-[10px]">
        <Moon className="w=3 h=3 text-gray-800" />
        <Sun className="w=3 h=3 text-orange-500" />
      </div>

      {/* スライドする丸部分 */}
      <div
        className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 flex items-center justify-center text-xs ${
          isDark ? 'translate-x-0' : 'translate-x-6'
        }`}
      >
        {isDark ? <Moon className="w=3 h=3 text-gray-800" /> : <Sun className="w=3 h=3 text-orange-500" />}
      </div>
    </button>
  )
}