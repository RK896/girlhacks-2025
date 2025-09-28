'use client'

import { useMemo } from 'react'

const MoodTimeline = ({ entries }) => {
  const timelineData = useMemo(() => {
    if (!entries || entries.length === 0) return []
    
    return entries
      .map(entry => ({
        id: entry.id,
        date: new Date(entry.createdAt),
        sentiment: entry.azureAnalysis?.sentiment || 'neutral',
        confidence: entry.azureAnalysis?.confidenceScores || {},
        text: entry.journalText,
        dayName: new Date(entry.createdAt).toLocaleDateString('en', { weekday: 'short' }),
        monthDay: new Date(entry.createdAt).toLocaleDateString('en', { month: 'short', day: 'numeric' })
      }))
      .sort((a, b) => a.date - b.date)
  }, [entries])

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-100 border-green-300'
      case 'negative': return 'text-red-600 bg-red-100 border-red-300'
      default: return 'text-gray-600 bg-gray-100 border-gray-300'
    }
  }

  const getSentimentEmoji = (sentiment) => {
    switch (sentiment) {
      case 'positive': return '😊'
      case 'negative': return '😔'
      default: return '😐'
    }
  }

  const getSentimentLabel = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'Positive'
      case 'negative': return 'Negative'
      default: return 'Neutral'
    }
  }

  if (!entries || entries.length === 0) {
    return (
      <div className="temple-container">
        <h3 className="text-xl sm:text-2xl font-cinzel font-semibold text-athena-blue mb-6 flex items-center">
          <span className="mr-3">📈</span>
          Mood Timeline
        </h3>
        <div className="text-center text-gray-600 py-12">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-lg sm:text-xl font-cinzel mb-2">No Mood Data Yet</p>
          <p className="text-base">Start journaling to see your emotional journey over time.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="temple-container">
      <h3 className="text-xl sm:text-2xl font-cinzel font-semibold text-athena-blue mb-6 flex items-center">
        <span className="mr-3">📈</span>
        Your Emotional Journey
        {timelineData.length > 4 && (
          <span className="ml-3 text-sm text-gray-500 font-normal">
            ({timelineData.length} entries - scroll to see more)
          </span>
        )}
      </h3>
      
      {/* Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gold-main/30 via-athena-blue/30 to-gold-main/30"></div>
        
        {/* Scrollable timeline container */}
        <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gold-main/30 scrollbar-track-gray-100 hover:scrollbar-thumb-gold-main/50 pr-2 relative">
          {/* Scroll indicator */}
          {timelineData.length > 4 && (
            <div className="absolute top-0 right-0 z-20 bg-gradient-to-b from-white/90 to-transparent w-8 h-6 pointer-events-none">
              <div className="text-xs text-gold-main/60 text-center mt-1">↓</div>
            </div>
          )}
          <div className="space-y-6">
          {timelineData.map((entry, index) => (
            <div key={entry.id} className="relative flex items-start space-x-4 fade-in" style={{animationDelay: `${index * 0.1}s`}}>
              {/* Timeline dot */}
              <div className={`relative z-10 w-4 h-4 rounded-full border-2 ${getSentimentColor(entry.sentiment).split(' ')[2]} ${getSentimentColor(entry.sentiment).split(' ')[1]}`}>
                <div className="absolute -top-1 -left-1 w-6 h-6 rounded-full bg-white flex items-center justify-center text-xs">
                  {getSentimentEmoji(entry.sentiment)}
                </div>
              </div>
              
              {/* Entry content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-900">{entry.monthDay}</span>
                    <span className="text-xs text-gray-500">{entry.dayName}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(entry.sentiment)}`}>
                      {getSentimentLabel(entry.sentiment)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {entry.date.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                
                {/* Entry preview */}
                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-gray-200/50">
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {entry.text.length > 100 ? `${entry.text.substring(0, 100)}...` : entry.text}
                  </p>
                  
                  {/* Confidence scores */}
                  {entry.confidence && (
                    <div className="mt-2 flex space-x-4 text-xs">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-600">
                          {Math.round((entry.confidence.positive || 0) * 100)}% positive
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <span className="text-gray-600">
                          {Math.round((entry.confidence.neutral || 0) * 100)}% neutral
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-gray-600">
                          {Math.round((entry.confidence.negative || 0) * 100)}% negative
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>
      
      {/* Summary stats */}
      <div className="mt-8 grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-600">
            {timelineData.filter(e => e.sentiment === 'positive').length}
          </div>
          <div className="text-sm text-green-700">Positive Days</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-600">
            {timelineData.filter(e => e.sentiment === 'neutral').length}
          </div>
          <div className="text-sm text-gray-700">Neutral Days</div>
        </div>
        <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
          <div className="text-2xl font-bold text-red-600">
            {timelineData.filter(e => e.sentiment === 'negative').length}
          </div>
          <div className="text-sm text-red-700">Challenging Days</div>
        </div>
      </div>
    </div>
  )
}

export default MoodTimeline
