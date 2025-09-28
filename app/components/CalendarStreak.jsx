'use client'

import { useState, useEffect } from 'react'

export default function CalendarStreak({ entries }) {
  const [streak, setStreak] = useState(0)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [calendarData, setCalendarData] = useState({})

  useEffect(() => {
    if (!entries || entries.length === 0) return

    // Calculate streak and calendar data
    const today = new Date()
    const journalDates = entries.map(entry => {
      const date = new Date(entry.createdAt)
      return date.toDateString()
    })

    // Calculate current streak
    let currentStreak = 0
    const todayStr = today.toDateString()
    
    // Check if user journaled today
    if (journalDates.includes(todayStr)) {
      currentStreak = 1
      let checkDate = new Date(today)
      checkDate.setDate(checkDate.getDate() - 1)
      
      while (journalDates.includes(checkDate.toDateString())) {
        currentStreak++
        checkDate.setDate(checkDate.getDate() - 1)
      }
    } else {
      // Check if user journaled yesterday
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      if (journalDates.includes(yesterday.toDateString())) {
        currentStreak = 1
        let checkDate = new Date(yesterday)
        checkDate.setDate(checkDate.getDate() - 1)
        
        while (journalDates.includes(checkDate.toDateString())) {
          currentStreak++
          checkDate.setDate(checkDate.getDate() - 1)
        }
      }
    }

    setStreak(currentStreak)

    // Create calendar data for the current month
    const calendar = {}
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    
    // Get the day of week for first day (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfWeek = firstDay.getDay()
    
    // Create calendar grid (6 weeks × 7 days = 42 cells)
    for (let i = 0; i < 42; i++) {
      const dayNumber = i - firstDayOfWeek + 1
      if (dayNumber >= 1 && dayNumber <= daysInMonth) {
        const date = new Date(year, month, dayNumber)
        const dateStr = date.toDateString()
        calendar[dateStr] = journalDates.includes(dateStr)
      }
    }
    
    setCalendarData(calendar)
  }, [entries, currentDate])

  const getStreakMessage = () => {
    if (streak === 0) return "Begin your journey of wisdom"
    if (streak === 1) return "A single step on the path"
    if (streak < 7) return "Building your foundation"
    if (streak < 30) return "A dedicated seeker"
    if (streak < 100) return "A true disciple of wisdom"
    return "A master of reflection"
  }

  const getStreakEmoji = () => {
    if (streak === 0) return "🌱"
    if (streak < 7) return "📜"
    if (streak < 30) return "🏛️"
    if (streak < 100) return "⚡"
    return "👑"
  }

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + direction)
      return newDate
    })
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const getMonthName = () => {
    return currentDate.toLocaleDateString('en', { month: 'long', year: 'numeric' })
  }

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const firstDayOfWeek = firstDay.getDay()
    
    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const dateStr = date.toDateString()
      const today = new Date()
      const isToday = dateStr === today.toDateString()
      const hasEntry = calendarData[dateStr] || false
      
      days.push({
        day,
        date,
        dateStr,
        isToday,
        hasEntry
      })
    }
    
    return days
  }

  return (
    <div className="temple-container">
      <h3 className="text-xl font-cinzel font-bold text-athena-blue mb-4 text-center">
        Your Wisdom Journey
      </h3>
      
      {/* Streak Display */}
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">{getStreakEmoji()}</div>
        <div className="text-3xl font-bold text-gold-main mb-2">{streak}</div>
        <div className="text-sm text-gray-600 mb-1">Day Streak</div>
        <div className="text-xs text-gray-500 italic">{getStreakMessage()}</div>
      </div>

      {/* Calendar Header with Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-athena-blue"
          title="Previous Month"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="text-center">
          <h4 className="text-lg font-cinzel font-semibold text-athena-blue">
            {getMonthName()}
          </h4>
          <button
            onClick={goToToday}
            className="text-xs text-gray-500 hover:text-gold-main transition-colors"
          >
            Go to Today
          </button>
        </div>
        
        <button
          onClick={() => navigateMonth(1)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-athena-blue"
          title="Next Month"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {/* Day Headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-xs text-gray-500 font-medium py-2">
            {day}
          </div>
        ))}
        
        {/* Calendar Days */}
        {generateCalendarDays().map((dayData, index) => {
          if (!dayData) {
            return <div key={index} className="aspect-square"></div>
          }
          
          const { day, isToday, hasEntry } = dayData
          
          return (
            <div
              key={index}
              className={`
                aspect-square flex items-center justify-center text-sm rounded-lg transition-all
                ${hasEntry 
                  ? 'bg-gold-main text-white font-bold shadow-md' 
                  : isToday 
                    ? 'bg-athena-blue text-white font-bold ring-2 ring-athena-blue/50' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }
                ${isToday ? 'scale-110' : ''}
              `}
            >
              {day}
            </div>
          )
        })}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="bg-white/60 rounded-lg p-3">
          <div className="text-lg font-bold text-athena-blue">{entries.length}</div>
          <div className="text-xs text-gray-600">Total Entries</div>
        </div>
        <div className="bg-white/60 rounded-lg p-3">
          <div className="text-lg font-bold text-gold-main">
            {Math.round((Object.values(calendarData).filter(Boolean).length / Object.keys(calendarData).length) * 100)}%
          </div>
          <div className="text-xs text-gray-600">Monthly Activity</div>
        </div>
      </div>
    </div>
  )
}
