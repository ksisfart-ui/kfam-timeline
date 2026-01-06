'use client'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // マウント完了を待つ
  useEffect(() => {
    setMounted(true)
  }, [])

  // マウント前は空の要素を返す（Hydration Error防止）
  if (!mounted) {
    return <div className="w-8 h-8 md:w-9 md:h-9" />
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-xl bg-card hover:opacity-80 transition-all border border-card-border shadow-sm flex items-center justify-center w-8 h-8 md:w-9 md:h-9"
      aria-label="Toggle Dark Mode"
    >
      <span className="text-sm md:text-base leading-none">
        {theme === 'dark' ? '🌙' : '☀️'}
      </span>
    </button>
  )
}