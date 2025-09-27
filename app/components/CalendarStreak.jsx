'use client'

import { useState, useEffect } from 'react'

export default function CalendarStreak({ entries }) {
  const [streak, setStreak] = useState(0)
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

    // Create calendar data for the last 30 days
    const calendar = {}
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toDateString()
      calendar[dateStr] = journalDates.includes(dateStr)
    }
    setCalendarData(calendar)
  }, [entries])

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

  return (
    <div className="temple-container p-6 mb-8">
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

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
          <div key={day} className="text-center text-xs text-gray-500 font-medium py-1">
            {day}
          </div>
        ))}
        
        {Object.entries(calendarData).map(([dateStr, hasEntry]) => {
          const date = new Date(dateStr)
          const isToday = date.toDateString() === new Date().toDateString()
          
          return (
            <div
              key={dateStr}
              className={`
                aspect-square flex items-center justify-center text-xs rounded
                ${hasEntry 
                  ? 'bg-gold-main text-white font-bold' 
                  : isToday 
                    ? 'bg-athena-blue/20 text-athena-blue border border-athena-blue/30' 
                    : 'bg-gray-100 text-gray-400'
                }
                ${isToday ? 'ring-2 ring-athena-blue/50' : ''}
              `}
            >
              {date.getDate()}
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
            {Math.round((Object.values(calendarData).filter(Boolean).length / 30) * 100)}%
          </div>
          <div className="text-xs text-gray-600">30-Day Activity</div>
        </div>
      </div>
    </div>
  )
}
