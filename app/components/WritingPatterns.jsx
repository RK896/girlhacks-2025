'use client'

import { useMemo } from 'react'

const WritingPatterns = ({ entries }) => {
  const patternData = useMemo(() => {
    if (!entries || entries.length === 0) return null
    
    // Analyze writing patterns
    const patterns = {
      totalEntries: entries.length,
      totalWords: 0,
      avgWordsPerEntry: 0,
      longestEntry: 0,
      shortestEntry: Infinity,
      timeOfDay: { morning: 0, afternoon: 0, evening: 0, night: 0 },
      dayOfWeek: { monday: 0, tuesday: 0, wednesday: 0, thursday: 0, friday: 0, saturday: 0, sunday: 0 },
      entryLengths: [],
      writingStreak: 0,
      avgSentiment: 0
    }
    
    let totalSentiment = 0
    
    entries.forEach(entry => {
      const wordCount = entry.journalText.split(/\s+/).length
      patterns.totalWords += wordCount
      patterns.entryLengths.push(wordCount)
      patterns.longestEntry = Math.max(patterns.longestEntry, wordCount)
      patterns.shortestEntry = Math.min(patterns.shortestEntry, wordCount)
      
      // Time of day analysis
      const hour = new Date(entry.createdAt).getHours()
      if (hour >= 5 && hour < 12) patterns.timeOfDay.morning++
      else if (hour >= 12 && hour < 17) patterns.timeOfDay.afternoon++
      else if (hour >= 17 && hour < 22) patterns.timeOfDay.evening++
      else patterns.timeOfDay.night++
      
      // Day of week analysis
      const dayName = new Date(entry.createdAt).toLocaleDateString('en', { weekday: 'long' }).toLowerCase()
      patterns.dayOfWeek[dayName]++
      
      // Sentiment analysis
      if (entry.azureAnalysis?.sentiment) {
        const sentimentValue = entry.azureAnalysis.sentiment === 'positive' ? 1 : 
                             entry.azureAnalysis.sentiment === 'negative' ? -1 : 0
        totalSentiment += sentimentValue
      }
    })
    
    patterns.avgWordsPerEntry = Math.round(patterns.totalWords / patterns.totalEntries)
    patterns.avgSentiment = totalSentiment / patterns.totalEntries
    
    // Calculate writing streak
    const sortedEntries = entries
      .map(entry => new Date(entry.createdAt).toDateString())
      .sort()
      .filter((date, index, arr) => arr.indexOf(date) === index) // Remove duplicates
    
    let currentStreak = 0
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()
    
    if (sortedEntries.includes(today)) {
      currentStreak = 1
      for (let i = sortedEntries.length - 2; i >= 0; i--) {
        const currentDate = new Date(sortedEntries[i + 1])
        const previousDate = new Date(sortedEntries[i])
        const dayDiff = (currentDate - previousDate) / (1000 * 60 * 60 * 24)
        if (dayDiff === 1) currentStreak++
        else break
      }
    } else if (sortedEntries.includes(yesterday)) {
      currentStreak = 1
      for (let i = sortedEntries.length - 2; i >= 0; i--) {
        const currentDate = new Date(sortedEntries[i + 1])
        const previousDate = new Date(sortedEntries[i])
        const dayDiff = (currentDate - previousDate) / (1000 * 60 * 60 * 24)
        if (dayDiff === 1) currentStreak++
        else break
      }
    }
    
    patterns.writingStreak = currentStreak
    
    return patterns
  }, [entries])

  if (!entries || entries.length === 0) {
    return (
      <div className="temple-container p-8 sm:p-10">
        <h3 className="text-xl sm:text-2xl font-cinzel font-semibold text-athena-blue mb-6 flex items-center">
          <span className="mr-3">📊</span>
          Writing Patterns
        </h3>
        <div className="text-center text-gray-600 py-12">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-lg sm:text-xl font-cinzel mb-2">No Patterns Yet</p>
          <p className="text-base">Start journaling to discover your writing habits.</p>
        </div>
      </div>
    )
  }

  const getTimeOfDayLabel = (time) => {
    switch (time) {
      case 'morning': return 'Morning (5AM-12PM)'
      case 'afternoon': return 'Afternoon (12PM-5PM)'
      case 'evening': return 'Evening (5PM-10PM)'
      case 'night': return 'Night (10PM-5AM)'
      default: return time
    }
  }

  const getDayOfWeekLabel = (day) => {
    return day.charAt(0).toUpperCase() + day.slice(1)
  }

  const getSentimentLabel = (avg) => {
    if (avg > 0.3) return { label: 'Generally Positive', color: 'text-green-600', emoji: '😊' }
    if (avg < -0.3) return { label: 'Generally Reflective', color: 'text-blue-600', emoji: '🤔' }
    return { label: 'Balanced', color: 'text-gray-600', emoji: '😐' }
  }

  const sentimentInfo = getSentimentLabel(patternData.avgSentiment)

  return (
    <div className="temple-container">
      <h3 className="text-xl sm:text-2xl font-cinzel font-semibold text-athena-blue mb-6 flex items-center">
        <span className="mr-3">📊</span>
        Your Writing Patterns
      </h3>
      
      {/* Key Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="text-center p-4 bg-gradient-to-br from-gold-main/10 to-yellow-100 rounded-lg border border-gold-main/20">
          <div className="text-2xl font-bold text-gold-main">{patternData.totalEntries}</div>
          <div className="text-sm text-gray-700">Total Entries</div>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-athena-blue/10 to-blue-100 rounded-lg border border-athena-blue/20">
          <div className="text-2xl font-bold text-athena-blue">{patternData.avgWordsPerEntry}</div>
          <div className="text-sm text-gray-700">Avg Words</div>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-green-500/10 to-green-100 rounded-lg border border-green-500/20">
          <div className="text-2xl font-bold text-green-600">{patternData.writingStreak}</div>
          <div className="text-sm text-gray-700">Day Streak</div>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-purple-500/10 to-purple-100 rounded-lg border border-purple-500/20">
          <div className="text-2xl font-bold text-purple-600">{patternData.totalWords}</div>
          <div className="text-sm text-gray-700">Total Words</div>
        </div>
      </div>

      {/* Writing Length Analysis */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Entry Length Analysis</h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-white/60 rounded-lg">
            <div className="text-lg font-bold text-gray-800">{patternData.shortestEntry}</div>
            <div className="text-sm text-gray-600">Shortest Entry</div>
          </div>
          <div className="text-center p-3 bg-white/60 rounded-lg">
            <div className="text-lg font-bold text-gray-800">{patternData.longestEntry}</div>
            <div className="text-sm text-gray-600">Longest Entry</div>
          </div>
          <div className="text-center p-3 bg-white/60 rounded-lg">
            <div className="text-lg font-bold text-gray-800">{sentimentInfo.emoji}</div>
            <div className={`text-sm ${sentimentInfo.color}`}>{sentimentInfo.label}</div>
          </div>
        </div>
      </div>

      {/* Time Patterns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Time of Day</h4>
          <div className="space-y-2">
            {Object.entries(patternData.timeOfDay).map(([time, count]) => (
              <div key={time} className="flex justify-between items-center p-2 bg-white/60 rounded-lg">
                <span className="text-sm text-gray-700">{getTimeOfDayLabel(time)}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gold-main h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(count / patternData.totalEntries) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600 w-8">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Day of Week</h4>
          <div className="space-y-2">
            {Object.entries(patternData.dayOfWeek).map(([day, count]) => (
              <div key={day} className="flex justify-between items-center p-2 bg-white/60 rounded-lg">
                <span className="text-sm text-gray-700">{getDayOfWeekLabel(day)}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-athena-blue h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(count / patternData.totalEntries) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600 w-8">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="p-4 bg-gradient-to-r from-athena-blue/5 to-blue-50/50 rounded-lg border border-athena-blue/20">
        <p className="text-sm text-gray-600 text-center">
          <span className="font-semibold text-athena-blue">Insight:</span> You write most during{' '}
          {Object.entries(patternData.timeOfDay).reduce((a, b) => patternData.timeOfDay[a[0]] > patternData.timeOfDay[b[0]] ? a : b)[0]} 
          {' '}and on {Object.entries(patternData.dayOfWeek).reduce((a, b) => patternData.dayOfWeek[a[0]] > patternData.dayOfWeek[b[0]] ? a : b)[0]}s.
        </p>
      </div>
    </div>
  )
}

export default WritingPatterns
