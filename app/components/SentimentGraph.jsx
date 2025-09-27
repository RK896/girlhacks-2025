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

    // Filter entries by date range
    const filteredEntries = entries.filter(entry => {
      const entryDate = new Date(entry.createdAt)
      const daysDiff = Math.floor((now - entryDate) / (1000 * 60 * 60 * 24))
      return daysDiff < daysToShow
    }).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

    // Create graph data - each entry is a data point
    const data = filteredEntries.map((entry, index) => {
      const entryDate = new Date(entry.createdAt)
      
      // Convert sentiment to numeric value
      let sentimentValue = 0
      if (entry.azureAnalysis?.sentiment === 'positive') {
        sentimentValue = 1
      } else if (entry.azureAnalysis?.sentiment === 'negative') {
        sentimentValue = -1
      } else {
        sentimentValue = 0
      }
      
      return {
        id: entry.id || index,
        date: entryDate.toISOString().split('T')[0],
        sentiment: sentimentValue,
        sentimentLabel: entry.azureAnalysis?.sentiment || 'neutral',
        confidence: entry.azureAnalysis?.confidenceScores || {},
        createdAt: entry.createdAt,
        dayName: entryDate.toLocaleDateString('en', { weekday: 'short' }),
        time: entryDate.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })
      }
    })
    
    setGraphData(data)
  }, [entries, selectedPeriod])

  const getSentimentColor = (sentiment) => {
    if (sentiment > 0.3) return 'text-green-600'
    if (sentiment < -0.3) return 'text-red-600'
    return 'text-gray-600'
  }

  const getSentimentLabel = (sentiment) => {
    if (sentiment > 0) return 'Positive'
    if (sentiment < 0) return 'Negative'
    return 'Neutral'
  }

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
        <div className="h-40 relative">
          {/* Zero line */}
          <div className="absolute top-1/2 left-0 right-0 border-t border-gray-300"></div>
          
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 text-xs text-green-600 font-medium">+</div>
          <div className="absolute left-0 bottom-0 text-xs text-red-600 font-medium">-</div>
          
          {/* Data points and connecting lines */}
          <div className="relative h-full">
            {/* SVG for connecting lines */}
            {graphData.length > 1 && (
              <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
                {graphData.map((point, index) => {
                  if (index === 0) return null
                  
                  const prevPoint = graphData[index - 1]
                  const isPositive = point.sentiment > 0
                  const isNegative = point.sentiment < 0
                  const isNeutral = point.sentiment === 0
                  const prevIsPositive = prevPoint.sentiment > 0
                  const prevIsNegative = prevPoint.sentiment < 0
                  const prevIsNeutral = prevPoint.sentiment === 0
                  
                  // Calculate positions
                  const position = isPositive ? 0.2 : isNegative ? 0.8 : 0.5
                  const prevPosition = prevIsPositive ? 0.2 : prevIsNegative ? 0.8 : 0.5
                  const leftPosition = (index / Math.max(graphData.length - 1, 1)) * 100
                  const prevLeftPosition = ((index - 1) / Math.max(graphData.length - 1, 1)) * 100
                  
                  // Convert percentages to actual coordinates
                  const x1 = (prevLeftPosition / 100) * 100 // SVG width is 100%
                  const y1 = prevPosition * 100 // SVG height is 100%
                  const x2 = (leftPosition / 100) * 100
                  const y2 = position * 100
                  
                  // Determine line color based on sentiment trend
                  let lineColor = '#9CA3AF' // default gray
                  if (point.sentiment > prevPoint.sentiment) {
                    lineColor = '#10B981' // green for improvement
                  } else if (point.sentiment < prevPoint.sentiment) {
                    lineColor = '#EF4444' // red for decline
                  }
                  
                  return (
                    <line
                      key={`line-${index}`}
                      x1={`${x1}%`}
                      y1={`${y1}%`}
                      x2={`${x2}%`}
                      y2={`${y2}%`}
                      stroke={lineColor}
                      strokeWidth="2"
                      strokeLinecap="round"
                      opacity="0.7"
                    />
                  )
                })}
              </svg>
            )}
            
            {/* Data points */}
            {graphData.map((point, index) => {
              const isPositive = point.sentiment > 0
              const isNegative = point.sentiment < 0
              const isNeutral = point.sentiment === 0
              
              // Position from top (0 = top, 1 = bottom)
              const position = isPositive ? 0.2 : isNegative ? 0.8 : 0.5
              const leftPosition = (index / Math.max(graphData.length - 1, 1)) * 100
              
              return (
                <div
                  key={point.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                  style={{
                    left: `${leftPosition}%`,
                    top: `${position * 100}%`,
                    zIndex: 2
                  }}
                >
                  {/* Data point */}
                  <div
                    className={`w-4 h-4 rounded-full border-2 border-white shadow-lg transition-all duration-200 group-hover:scale-125 ${
                      isPositive ? 'bg-green-500' : isNegative ? 'bg-red-500' : 'bg-gray-400'
                    }`}
                    title={`${point.sentimentLabel} - ${point.time}`}
                  />
                  
                  {/* Hover tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <div className="bg-gray-800 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap">
                      <div className="font-medium capitalize">{point.sentimentLabel}</div>
                      <div className="text-gray-300">{point.time}</div>
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-800"></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        
        {/* X-axis labels */}
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          {graphData.length > 0 && (
            <>
              <span>{graphData[0].dayName}</span>
              {graphData.length > 1 && (
                <span>{graphData[Math.floor(graphData.length / 2)].dayName}</span>
              )}
              {graphData.length > 2 && (
                <span>{graphData[graphData.length - 1].dayName}</span>
              )}
            </>
          )}
        </div>
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
          <div className="text-sm text-gray-600 mb-2">Recent Entries</div>
          <div className="flex justify-between items-center">
            <div className={`font-semibold ${getSentimentColor(graphData[graphData.length - 1].sentiment)}`}>
              {getSentimentLabel(graphData[graphData.length - 1].sentiment)}
            </div>
            <div className="text-xs text-gray-500">
              {graphData.length} entries in {selectedPeriod}
            </div>
          </div>
          
          {/* Entry distribution */}
          <div className="mt-2 flex justify-center space-x-4 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{graphData.filter(p => p.sentiment > 0).length} positive</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span>{graphData.filter(p => p.sentiment === 0).length} neutral</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>{graphData.filter(p => p.sentiment < 0).length} negative</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
