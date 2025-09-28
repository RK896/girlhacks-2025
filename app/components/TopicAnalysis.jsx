'use client'

import { useMemo } from 'react'

// Topic extraction function
const extractTopics = (journalText) => {
  const text = journalText.toLowerCase()
  const topics = []
  
  // Define topic keywords and their categories
  const topicKeywords = {
    'Work & Career': ['work', 'job', 'career', 'office', 'meeting', 'project', 'boss', 'colleague', 'interview', 'promotion', 'salary', 'workplace', 'deadline', 'stress', 'burnout', 'working', 'worked', 'works', 'careers', 'jobs', 'office', 'meetings', 'projects', 'bosses', 'colleagues', 'interviews', 'promotions', 'salaries', 'workplaces', 'deadlines', 'stressed', 'stressing', 'burned out', 'burning out'],
    'Relationships': ['relationship', 'love', 'partner', 'boyfriend', 'girlfriend', 'spouse', 'marriage', 'dating', 'family', 'friend', 'social', 'lonely', 'breakup', 'divorce', 'loved', 'loving', 'loves', 'partners', 'boyfriends', 'girlfriends', 'spouses', 'marriages', 'dating', 'families', 'friends', 'socially', 'loneliness', 'breakups', 'divorces', 'mom', 'dad', 'mother', 'father', 'sister', 'brother', 'parent', 'parents', 'sibling', 'siblings'],
    'Health & Wellness': ['health', 'sick', 'illness', 'doctor', 'medicine', 'exercise', 'fitness', 'gym', 'diet', 'sleep', 'tired', 'energy', 'mental health', 'therapy', 'anxiety', 'depression', 'healthy', 'sickness', 'illnesses', 'doctors', 'medicines', 'exercising', 'exercised', 'exercises', 'fitness', 'gyms', 'diets', 'sleeping', 'slept', 'sleeps', 'tiring', 'tires', 'energetic', 'therapies', 'anxious', 'depressed', 'worried', 'worry', 'worries', 'worried', 'stressed', 'stress', 'stresses', 'pain', 'pains', 'painful', 'hurt', 'hurts', 'hurting', 'hurt'],
    'Personal Growth': ['goal', 'dream', 'future', 'plan', 'ambition', 'success', 'failure', 'learn', 'study', 'skill', 'hobby', 'passion', 'purpose', 'meaning', 'self-improvement', 'goals', 'dreams', 'dreaming', 'dreamed', 'futures', 'planning', 'planned', 'plans', 'ambitions', 'successes', 'successful', 'failures', 'failed', 'failing', 'fails', 'learning', 'learned', 'learns', 'studying', 'studied', 'studies', 'skills', 'hobbies', 'passions', 'passionate', 'purposes', 'meanings', 'meaningful', 'improvement', 'improving', 'improved', 'improves', 'grow', 'growing', 'grew', 'grows', 'growth', 'develop', 'developing', 'developed', 'develops', 'development'],
    'Finance': ['money', 'financial', 'budget', 'debt', 'saving', 'investment', 'expensive', 'cheap', 'broke', 'rich', 'poor', 'bills', 'rent', 'mortgage', 'finances', 'financially', 'budgets', 'budgeting', 'budgeted', 'debts', 'savings', 'saved', 'saves', 'investments', 'investing', 'invested', 'invests', 'expensiveness', 'cheapness', 'bills', 'renting', 'rented', 'rents', 'mortgages', 'mortgaging', 'mortgaged', 'dollar', 'dollars', 'cost', 'costs', 'costing', 'costed', 'price', 'prices', 'pricing', 'priced', 'pay', 'paying', 'paid', 'pays', 'payment', 'payments', 'buy', 'buying', 'bought', 'buys', 'purchase', 'purchases', 'purchasing', 'purchased'],
    'Travel & Adventure': ['travel', 'trip', 'vacation', 'holiday', 'adventure', 'explore', 'visit', 'journey', 'flight', 'hotel', 'destination', 'wanderlust', 'traveling', 'traveled', 'travels', 'trips', 'tripping', 'tripped', 'vacations', 'vacationing', 'vacationed', 'holidays', 'holidaying', 'holidayed', 'adventures', 'adventuring', 'adventured', 'exploring', 'explored', 'explores', 'visiting', 'visited', 'visits', 'journeys', 'journeying', 'journeyed', 'flights', 'flying', 'flew', 'flies', 'hotels', 'destinations', 'wanderlusting', 'wanderlusted', 'wanderlusts', 'explore', 'exploring', 'explored', 'explores'],
    'Creativity & Arts': ['art', 'music', 'write', 'paint', 'draw', 'creative', 'design', 'poetry', 'story', 'book', 'movie', 'show', 'performance', 'craft', 'arts', 'artistic', 'musical', 'musically', 'writing', 'written', 'writes', 'painting', 'painted', 'paints', 'drawing', 'drawn', 'draws', 'creativity', 'creatively', 'designs', 'designing', 'designed', 'poems', 'poetic', 'poetically', 'stories', 'storytelling', 'books', 'bookish', 'movies', 'cinematic', 'shows', 'showing', 'showed', 'performances', 'performing', 'performed', 'performs', 'crafts', 'crafting', 'crafted', 'crafts', 'creative', 'creatively', 'imagination', 'imaginative', 'imaginatively'],
    'Spirituality & Philosophy': ['spiritual', 'religion', 'faith', 'prayer', 'meditation', 'mindfulness', 'philosophy', 'meaning', 'purpose', 'belief', 'god', 'universe', 'karma', 'spiritually', 'religions', 'religious', 'religiously', 'faiths', 'faithful', 'faithfully', 'prayers', 'praying', 'prayed', 'prays', 'meditations', 'meditating', 'meditated', 'meditates', 'mindful', 'mindfully', 'philosophies', 'philosophical', 'philosophically', 'meanings', 'meaningful', 'meaningfully', 'purposes', 'purposeless', 'purposelessly', 'beliefs', 'believing', 'believed', 'believes', 'gods', 'godly', 'godliness', 'universes', 'universal', 'universally', 'karmas', 'karmic', 'karmically', 'soul', 'souls', 'soulful', 'soulfully', 'spirit', 'spirits', 'spiritual', 'spiritually'],
    'Technology': ['computer', 'phone', 'internet', 'social media', 'app', 'software', 'tech', 'digital', 'online', 'gaming', 'coding', 'programming', 'computers', 'computing', 'computed', 'phones', 'phoning', 'phoned', 'internets', 'interneting', 'interneted', 'apps', 'apping', 'apped', 'softwares', 'softwaring', 'softwared', 'techs', 'teching', 'teched', 'digitals', 'digitalizing', 'digitalized', 'onlines', 'onlining', 'onlined', 'gamings', 'gaming', 'gamed', 'games', 'codings', 'coding', 'coded', 'codes', 'programmings', 'programming', 'programmed', 'programs', 'code', 'codes', 'coding', 'coded', 'program', 'programs', 'programming', 'programmed', 'device', 'devices', 'screen', 'screens', 'keyboard', 'keyboards', 'mouse', 'mice', 'laptop', 'laptops', 'desktop', 'desktops', 'tablet', 'tablets', 'smartphone', 'smartphones'],
    'Nature & Environment': ['nature', 'outdoor', 'garden', 'park', 'beach', 'mountain', 'forest', 'weather', 'environment', 'climate', 'green', 'sustainable', 'natures', 'natural', 'naturally', 'outdoors', 'outdooring', 'outdoored', 'gardens', 'gardening', 'gardened', 'parks', 'parking', 'parked', 'beaches', 'beaching', 'beached', 'mountains', 'mountainous', 'mountainously', 'forests', 'forested', 'foresting', 'weathers', 'weathering', 'weathered', 'environments', 'environmental', 'environmentally', 'climates', 'climatic', 'climatically', 'greens', 'greening', 'greened', 'sustainables', 'sustaining', 'sustained', 'sustains', 'sustainability', 'sustainably', 'tree', 'trees', 'treed', 'treeing', 'flower', 'flowers', 'flowering', 'flowered', 'grass', 'grasses', 'grassing', 'grassed', 'sky', 'skies', 'skying', 'skied', 'sun', 'suns', 'sunning', 'sunned', 'moon', 'moons', 'mooning', 'mooned', 'star', 'stars', 'starring', 'starred', 'cloud', 'clouds', 'clouding', 'clouded', 'rain', 'rains', 'raining', 'rained', 'snow', 'snows', 'snowing', 'snowed', 'wind', 'winds', 'winding', 'winded']
  }
  
  // Count topic occurrences
  Object.entries(topicKeywords).forEach(([topic, keywords]) => {
    const count = keywords.reduce((acc, keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g')
      const matches = text.match(regex)
      const matchCount = matches ? matches.length : 0
      return acc + matchCount
    }, 0)
    
    if (count > 0) {
      topics.push({ topic, count })
    }
  })
  
  // If no specific topics found, try to catch some general patterns
  if (topics.length === 0) {
    // Look for common journal words and assign them to general categories
    const generalPatterns = {
      'Personal Growth': ['today', 'yesterday', 'tomorrow', 'feeling', 'feel', 'felt', 'think', 'thinking', 'thought', 'thoughts', 'hope', 'hoping', 'hoped', 'wish', 'wishing', 'wished', 'want', 'wanting', 'wanted', 'need', 'needing', 'needed', 'try', 'trying', 'tried', 'tries', 'change', 'changing', 'changed', 'changes', 'better', 'best', 'good', 'great', 'amazing', 'wonderful', 'happy', 'happiness', 'sad', 'sadness', 'angry', 'anger', 'frustrated', 'frustration', 'excited', 'excitement', 'nervous', 'nervousness', 'calm', 'calmness', 'peaceful', 'peace', 'confused', 'confusion', 'clear', 'clarity', 'understand', 'understanding', 'understood', 'learn', 'learning', 'learned', 'know', 'knowing', 'knew', 'known', 'remember', 'remembering', 'remembered', 'forget', 'forgetting', 'forgot', 'forgotten'],
      'Daily Life': ['morning', 'afternoon', 'evening', 'night', 'day', 'days', 'week', 'weeks', 'month', 'months', 'year', 'years', 'time', 'times', 'moment', 'moments', 'hour', 'hours', 'minute', 'minutes', 'second', 'seconds', 'home', 'house', 'room', 'rooms', 'bed', 'beds', 'food', 'foods', 'eat', 'eating', 'ate', 'eaten', 'drink', 'drinking', 'drank', 'drunk', 'cook', 'cooking', 'cooked', 'shower', 'showering', 'showered', 'dress', 'dressing', 'dressed', 'clothes', 'clothing', 'shoes', 'shoe', 'car', 'cars', 'drive', 'driving', 'drove', 'driven', 'walk', 'walking', 'walked', 'run', 'running', 'ran', 'sit', 'sitting', 'sat', 'stand', 'standing', 'stood', 'lie', 'lying', 'lay', 'lain'],
      'Emotions & Feelings': ['happy', 'happiness', 'sad', 'sadness', 'angry', 'anger', 'frustrated', 'frustration', 'excited', 'excitement', 'nervous', 'nervousness', 'calm', 'calmness', 'peaceful', 'peace', 'confused', 'confusion', 'clear', 'clarity', 'worried', 'worry', 'worries', 'anxious', 'anxiety', 'stressed', 'stress', 'stresses', 'relaxed', 'relaxation', 'tired', 'tiredness', 'energetic', 'energy', 'motivated', 'motivation', 'inspired', 'inspiration', 'hopeful', 'hope', 'hopes', 'hopeless', 'hopelessness', 'confident', 'confidence', 'insecure', 'insecurity', 'proud', 'pride', 'ashamed', 'shame', 'guilty', 'guilt', 'grateful', 'gratitude', 'thankful', 'thanks', 'blessed', 'blessing', 'lucky', 'luck', 'unlucky', 'unluckiness']
    }
    
    Object.entries(generalPatterns).forEach(([topic, keywords]) => {
      const count = keywords.reduce((acc, keyword) => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'g')
        const matches = text.match(regex)
        const matchCount = matches ? matches.length : 0
        return acc + matchCount
      }, 0)
      
      if (count > 0) {
        topics.push({ topic, count })
      }
    })
  }
  
  return topics.sort((a, b) => b.count - a.count)
}

const TopicAnalysis = ({ entries }) => {
  const topicData = useMemo(() => {
    if (!entries || entries.length === 0) return []
    
    // Combine all journal texts
    const allText = entries.map(entry => entry.journalText).join(' ')
    
    // Extract topics
    const topics = extractTopics(allText)
    
    // Return top 8 topics
    return topics.slice(0, 8)
  }, [entries])

  if (!entries || entries.length === 0) {
    return (
      <div className="temple-container p-8 sm:p-10">
        <h3 className="text-xl sm:text-2xl font-cinzel font-semibold text-athena-blue mb-6 flex items-center">
          <span className="mr-3">📊</span>
          Topic Analysis
        </h3>
        <div className="text-center text-gray-600 py-12">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-lg sm:text-xl font-cinzel mb-2">No Topics to Analyze</p>
          <p className="text-base">Start journaling to see your most common topics.</p>
        </div>
      </div>
    )
  }

  if (topicData.length === 0) {
    return (
      <div className="temple-container p-8 sm:p-10">
        <h3 className="text-xl sm:text-2xl font-cinzel font-semibold text-athena-blue mb-6 flex items-center">
          <span className="mr-3">📊</span>
          Topic Analysis
        </h3>
        <div className="text-center text-gray-600 py-12">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-lg sm:text-xl font-cinzel mb-2">Topics Emerging</p>
          <p className="text-base">Keep journaling to discover your recurring themes.</p>
        </div>
      </div>
    )
  }

  const maxCount = Math.max(...topicData.map(t => t.count))

  return (
    <div className="temple-container p-8 sm:p-10">
      <h3 className="text-xl sm:text-2xl font-cinzel font-semibold text-athena-blue mb-6 flex items-center">
        <span className="mr-3">🫧</span>
        Your Floating Topics
      </h3>
      
      {/* Bubble Chart Container */}
      <div className="relative w-full h-80 sm:h-96 mb-6 overflow-hidden rounded-xl bg-gradient-to-br from-blue-50/30 to-purple-50/30 border border-gold-main/20" style={{minHeight: '400px'}}>
        {topicData.map((topic, index) => {
          // Calculate bubble size based on count (minimum 60px, maximum 100px)
          const minSize = 60
          const maxSize = 100
          const size = minSize + ((topic.count / maxCount) * (maxSize - minSize))
          
          // Calculate position in central area with some randomness
          const totalBubbles = topicData.length
          const angle = (index / totalBubbles) * 2 * Math.PI - Math.PI / 2 // Start from top
          const radius = 25 + (index % 3) * 8 // Vary radius for natural distribution
          const centerX = 50 // Center X as percentage
          const centerY = 50 // Center Y as percentage
          const x = centerX + (radius * Math.cos(angle)) + (Math.random() - 0.5) * 10 // Add some randomness
          const y = centerY + (radius * Math.sin(angle)) + (Math.random() - 0.5) * 10 // Add some randomness
          
          // Bubble colors with gradients
          const bubbleColors = [
            'from-gold-main to-yellow-400',
            'from-athena-blue to-blue-400',
            'from-green-500 to-emerald-400',
            'from-purple-500 to-pink-400',
            'from-red-500 to-orange-400',
            'from-indigo-500 to-blue-400',
            'from-teal-500 to-cyan-400',
            'from-rose-500 to-pink-400'
          ]
          
          const bubbleColor = bubbleColors[index % bubbleColors.length]
          const isLargest = index === 0 // First topic is the largest
          
          return (
            <div
              key={topic.topic}
              className={`absolute rounded-full bg-gradient-to-br ${bubbleColor} shadow-lg hover:shadow-xl transition-all duration-500 ease-out cursor-pointer group flex items-center justify-center text-white font-medium text-center fade-in bubble-float ${isLargest ? 'bubble-glow' : ''}`}
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
                animationDelay: `${index * 0.3}s`,
                fontSize: `${Math.max(10, Math.min(14, size / 8))}px`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)'
                e.currentTarget.style.zIndex = '10'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)'
                e.currentTarget.style.zIndex = '1'
              }}
            >
              <div className="px-2 py-1 text-center">
                <div className="font-semibold leading-tight">
                  {topic.topic.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </div>
                <div className="text-xs opacity-90 mt-1">
                  {topic.count}
                </div>
              </div>
              
              {/* Floating animation */}
              <div 
                className="absolute inset-0 rounded-full bg-white/20 animate-pulse"
                style={{
                  animationDelay: `${index * 0.5}s`,
                  animationDuration: '3s'
                }}
              />
            </div>
          )
        })}
        
        
        {/* Background decorative elements */}
        <div className="absolute top-4 left-4 w-6 h-6 bg-gold-main/15 rounded-full animate-float"></div>
        <div className="absolute top-8 right-6 w-4 h-4 bg-athena-blue/15 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-6 left-8 w-3 h-3 bg-green-400/15 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-4 right-4 w-4 h-4 bg-purple-400/15 rounded-full animate-float" style={{animationDelay: '1.5s'}}></div>
      </div>
      
      {/* Topic Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {topicData.slice(0, 6).map((topic, index) => {
          const bubbleColors = [
            'bg-gradient-to-r from-gold-main to-yellow-400',
            'bg-gradient-to-r from-athena-blue to-blue-400',
            'bg-gradient-to-r from-green-500 to-emerald-400',
            'bg-gradient-to-r from-purple-500 to-pink-400',
            'bg-gradient-to-r from-red-500 to-orange-400',
            'bg-gradient-to-r from-indigo-500 to-blue-400'
          ]
          
          return (
            <div key={topic.topic} className="flex items-center space-x-2 p-2 rounded-lg bg-white/60 backdrop-blur-sm">
              <div className={`w-4 h-4 rounded-full ${bubbleColors[index % bubbleColors.length]}`}></div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-700 truncate">{topic.topic}</div>
                <div className="text-xs text-gray-500">{topic.count} mentions</div>
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="p-4 bg-gradient-to-r from-athena-blue/5 to-blue-50/50 rounded-lg border border-athena-blue/20">
        <p className="text-sm text-gray-600 text-center">
          <span className="font-semibold text-athena-blue">Insight:</span> Your journal topics float freely in your mind, each bubble representing a theme from your thoughts. 
          {topicData.length > 0 && ` The largest bubble represents ${topicData[0].topic.toLowerCase()}, your most discussed topic.`}
        </p>
      </div>
    </div>
  )
}

export default TopicAnalysis
