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
      className="relative w-14 h-8 rounded-full bg-stone-200 dark:bg-stone-700 transition-colors duration-300 focus:outline-none shadow-inner flex items-center px-1"
      aria-label="Toggle Dark Mode"
    >
      {/* 1. 背景のアイコン：常に固定位置に配置し、背後に薄く見せる */}
      <div className="flex justify-between items-center w-full px-1">
        <Moon className={`w-4 h-4 transition-opacity ${isDark ? 'opacity-0' : 'opacity-40 text-gray-500'}`} />
        <Sun className={`w-4 h-4 transition-opacity ${isDark ? 'opacity-40 text-orange-200' : 'opacity-0'}`} />
      </div>

      {/* 2. スライドする丸（Thumb）：背景アイコンの上に重なる */}
      <div
        className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 flex items-center justify-center ${
          isDark ? 'translate-x-0' : 'translate-x-6'
        }`}
      >
        {/* 丸の中のアイコン：現在のモードに合わせて切り替え */}
        {isDark ? (
          <Moon className="w-4 h-4 text-gray-800" />
        ) : (
          <Sun className="w-4 h-4 text-orange-500" />
        )}
      </div>
    </button>
  )
}