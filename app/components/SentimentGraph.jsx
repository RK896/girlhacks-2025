'use client'

import { useState, useEffect } from 'react'

export default function SentimentGraph({ entries }) {
  const [graphData, setGraphData] = useState([])
  const [selectedPeriod, setSelectedPeriod] = useState('7d')

  useEffect(() => {
    if (!entries || entries.length === 0) return

    const now = new Date()
    let daysToShow = 7
    
    switch (selectedPeriod) {
      case '7d':
        daysToShow = 7
        break
      case '30d':
        daysToShow = 30
        break
      case '90d':
        daysToShow = 90
        break
      default:
        daysToShow = 7
    }

    // Group entries by date and calculate average sentiment
    const dailySentiments = {}
    
    entries.forEach(entry => {
      const entryDate = new Date(entry.createdAt)
      const daysDiff = Math.floor((now - entryDate) / (1000 * 60 * 60 * 24))
      
      if (daysDiff < daysToShow) {
        const dateKey = entryDate.toDateString()
        if (!dailySentiments[dateKey]) {
          dailySentiments[dateKey] = []
        }
        
        // Convert sentiment to numeric value
        let sentimentValue = 0
        if (entry.azureAnalysis?.sentiment === 'positive') {
          sentimentValue = 1
        } else if (entry.azureAnalysis?.sentiment === 'negative') {
          sentimentValue = -1
        } else {
          sentimentValue = 0
        }
        
        dailySentiments[dateKey].push(sentimentValue)
      }
    })

    // Create graph data
    const data = []
    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const dateKey = date.toDateString()
      
      let avgSentiment = 0
      let entryCount = 0
      
      if (dailySentiments[dateKey]) {
        avgSentiment = dailySentiments[dateKey].reduce((sum, val) => sum + val, 0) / dailySentiments[dateKey].length
        entryCount = dailySentiments[dateKey].length
      }
      
      data.push({
        date: date.toISOString().split('T')[0],
        sentiment: avgSentiment,
        entryCount,
        dayName: date.toLocaleDateString('en', { weekday: 'short' })
      })
    }
    
    setGraphData(data)
  }, [entries, selectedPeriod])

  const getSentimentColor = (sentiment) => {
    if (sentiment > 0.3) return 'text-green-600'
    if (sentiment < -0.3) return 'text-red-600'
    return 'text-gray-600'
  }

  const getSentimentLabel = (sentiment) => {
    if (sentiment > 0.3) return 'Positive'
    if (sentiment < -0.3) return 'Negative'
    return 'Neutral'
  }

  const maxSentiment = Math.max(...graphData.map(d => Math.abs(d.sentiment)), 1)

  return (
    <div className="temple-container p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-cinzel font-bold text-athena-blue">
          Emotional Journey
        </h3>
        <div className="flex space-x-2">
          {['7d', '30d', '90d'].map(period => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                selectedPeriod === period
                  ? 'bg-athena-blue text-white'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Graph */}
      <div className="mb-4">
        <div className="h-32 flex items-end justify-between space-x-1">
          {graphData.map((point, index) => {
            const height = Math.abs(point.sentiment) / maxSentiment * 100
            const isPositive = point.sentiment > 0
            
            return (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="w-full flex flex-col items-center">
                  {/* Bar */}
                  <div
                    className={`w-full rounded-t ${
                      isPositive ? 'bg-green-400' : point.sentiment < 0 ? 'bg-red-400' : 'bg-gray-400'
                    }`}
                    style={{ height: `${Math.max(height, 2)}px` }}
                  />
                  
                  {/* Entry count indicator */}
                  {point.entryCount > 0 && (
                    <div className="text-xs text-gold-main font-bold mt-1">
                      {point.entryCount}
                    </div>
                  )}
                </div>
                
                {/* Day label */}
                <div className="text-xs text-gray-500 mt-2">
                  {point.dayName}
                </div>
              </div>
            )
          })}
        </div>
        
        {/* Zero line */}
        <div className="border-t border-gray-300 mt-2"></div>
      </div>

      {/* Legend */}
      <div className="flex justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-400 rounded"></div>
          <span className="text-gray-600">Positive</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-400 rounded"></div>
          <span className="text-gray-600">Neutral</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-400 rounded"></div>
          <span className="text-gray-600">Negative</span>
        </div>
      </div>

      {/* Recent sentiment summary */}
      {graphData.length > 0 && (
        <div className="mt-4 p-3 bg-white/60 rounded-lg">
          <div className="text-sm text-gray-600 mb-2">Recent Sentiment</div>
          <div className="flex justify-between items-center">
            <div className={`font-semibold ${getSentimentColor(graphData[graphData.length - 1].sentiment)}`}>
              {getSentimentLabel(graphData[graphData.length - 1].sentiment)}
            </div>
            <div className="text-xs text-gray-500">
              {graphData[graphData.length - 1].entryCount} entries today
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
