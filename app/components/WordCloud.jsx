'use client'

import { useMemo } from 'react'

const WordCloud = ({ entries }) => {
  const wordData = useMemo(() => {
    if (!entries || entries.length === 0) return []
    
    // Combine all journal texts
    const allText = entries.map(entry => entry.journalText).join(' ').toLowerCase()
    
    // Remove common words and extract meaningful words
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'her', 'its', 'our', 'their', 'am', 'are', 'is', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'not', 'no', 'yes', 'so', 'very', 'just', 'now', 'then', 'here', 'there', 'where', 'when', 'why', 'how', 'what', 'who', 'which', 'all', 'any', 'some', 'many', 'much', 'more', 'most', 'other', 'another', 'each', 'every', 'both', 'either', 'neither', 'one', 'two', 'three', 'first', 'second', 'last', 'next', 'previous', 'same', 'different', 'new', 'old', 'good', 'bad', 'big', 'small', 'long', 'short', 'high', 'low', 'great', 'little', 'much', 'more', 'most', 'less', 'least', 'better', 'best', 'worse', 'worst', 'right', 'wrong', 'true', 'false', 'real', 'fake', 'easy', 'hard', 'simple', 'complex', 'important', 'unimportant', 'interesting', 'boring', 'fun', 'funny', 'serious', 'sad', 'happy', 'angry', 'excited', 'nervous', 'calm', 'tired', 'energetic', 'confused', 'clear', 'sure', 'unsure', 'ready', 'not', 'really', 'actually', 'probably', 'maybe', 'definitely', 'absolutely', 'completely', 'totally', 'quite', 'rather', 'pretty', 'fairly', 'somewhat', 'kind', 'sort', 'type', 'way', 'time', 'times', 'day', 'days', 'week', 'weeks', 'month', 'months', 'year', 'years', 'today', 'yesterday', 'tomorrow', 'morning', 'afternoon', 'evening', 'night', 'tonight', 'weekend', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'
    ])
    
    // Extract words
    const words = allText
      .replace(/[^\w\s]/g, ' ') // Remove punctuation
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word))
    
    // Count word frequency
    const wordCount = {}
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1
    })
    
    // Convert to array and sort by frequency
    return Object.entries(wordCount)
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 30) // Top 30 words
  }, [entries])

  const getWordSize = (count, maxCount) => {
    const minSize = 12
    const maxSize = 32
    return minSize + ((count / maxCount) * (maxSize - minSize))
  }

  const getWordColor = (index) => {
    const colors = [
      'text-gold-main',
      'text-athena-blue',
      'text-green-600',
      'text-purple-600',
      'text-red-600',
      'text-indigo-600',
      'text-teal-600',
      'text-pink-600',
      'text-orange-600',
      'text-cyan-600'
    ]
    return colors[index % colors.length]
  }

  if (!entries || entries.length === 0) {
    return (
      <div className="temple-container p-8 sm:p-10">
        <h3 className="text-xl sm:text-2xl font-cinzel font-semibold text-athena-blue mb-6 flex items-center">
          <span className="mr-3">☁️</span>
          Word Cloud
        </h3>
        <div className="text-center text-gray-600 py-12">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-lg sm:text-xl font-cinzel mb-2">No Words to Analyze</p>
          <p className="text-base">Start journaling to see your most used words.</p>
        </div>
      </div>
    )
  }

  const maxCount = Math.max(...wordData.map(w => w.count))

  return (
    <div className="temple-container">
      <h3 className="text-xl sm:text-2xl font-cinzel font-semibold text-athena-blue mb-6 flex items-center">
        <span className="mr-3">☁️</span>
        Your Word Cloud
      </h3>
      
      {/* Word Cloud */}
      <div className="relative w-full h-64 sm:h-80 mb-6 overflow-hidden rounded-xl bg-gradient-to-br from-blue-50/30 to-purple-50/30 border border-gold-main/20 flex flex-wrap items-center justify-center p-4">
        {wordData.map((word, index) => {
          const size = getWordSize(word.count, maxCount)
          const color = getWordColor(index)
          
          return (
            <span
              key={word.word}
              className={`font-medium hover:scale-110 transition-transform duration-300 cursor-pointer fade-in ${color}`}
              style={{
                fontSize: `${size}px`,
                animationDelay: `${index * 0.1}s`,
                margin: '2px 4px'
              }}
              title={`${word.word}: ${word.count} times`}
            >
              {word.word}
            </span>
          )
        })}
      </div>
      
      {/* Top words list */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {wordData.slice(0, 12).map((word, index) => (
          <div key={word.word} className="flex items-center justify-between p-2 bg-white/60 rounded-lg">
            <span className="text-sm font-medium text-gray-700 truncate">{word.word}</span>
            <span className="text-xs text-gray-500 ml-2">{word.count}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-gradient-to-r from-athena-blue/5 to-blue-50/50 rounded-lg border border-athena-blue/20">
        <p className="text-sm text-gray-600 text-center">
          <span className="font-semibold text-athena-blue">Insight:</span> These are the words that appear most frequently in your journal entries, revealing your thoughts and experiences.
        </p>
      </div>
    </div>
  )
}

export default WordCloud
