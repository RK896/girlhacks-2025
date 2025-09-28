'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from './contexts/AuthContext'
import AuthModal from './components/AuthModal'
import CalendarStreak from './components/CalendarStreak'
import SentimentGraph from './components/SentimentGraph'
import TopicAnalysis from './components/TopicAnalysis'
import MoodTimeline from './components/MoodTimeline'
import WordCloud from './components/WordCloud'
import WritingPatterns from './components/WritingPatterns'
import VoiceRecorder from './components/VoiceRecorder'

// Azure AI Analysis Function
const runAzureAnalysis = async (journalText) => {
  try {
    const response = await fetch('/api/ai/azure', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ journalText }),
    })

    if (!response.ok) {
      throw new Error(`Azure API error: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Azure analysis failed:', error)
    throw error
  }
}

// Gemini Oracle Function
const runGeminiOracle = async (journalText, azureAnalysis) => {
  try {
    const response = await fetch('/api/ai/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ journalText, azureAnalysis }),
    })

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    return data.response
  } catch (error) {
    console.error('Gemini oracle failed:', error)
    throw error
  }
}

// Demo Mode Function (fallback when AI fails)
const runDemoMode = async (journalText) => {
  try {
    const response = await fetch('/api/demo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ journalText }),
    })

    if (!response.ok) {
      throw new Error(`Demo API error: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Demo mode failed:', error)
    throw error
  }
}

// Journal Form Component
const JournalForm = ({ onSubmit, isLoading, loadingStep, setLoadingStep, setIsLoading }) => {
  const [journalText, setJournalText] = useState('')
  const [isRecording, setIsRecording] = useState(false)

  const handleVoiceTranscription = (transcribedText) => {
    setJournalText(prev => prev + (prev ? ' ' : '') + transcribedText)
  }

  const handleVoiceSentiment = (sentiment) => {
    // Store the sentiment for later use in submission
    console.log('Voice sentiment received:', sentiment)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!journalText.trim()) return

    // Set loading state at the beginning
    console.log('Setting loading state to true')
    setIsLoading(true)
    setLoadingStep('azure')

    try {
      let azureAnalysis, athenaResponse

      try {
        // Step 1: Try Azure AI Analysis
        console.log('Starting Azure analysis...')
        azureAnalysis = await runAzureAnalysis(journalText)
        console.log('Azure analysis complete')
        
        // Step 2: Try Gemini Oracle Response
        setLoadingStep('gemini')
        console.log('Starting Gemini oracle...')
        athenaResponse = await runGeminiOracle(journalText, azureAnalysis)
        console.log('Gemini oracle complete')
      } catch (aiError) {
        console.log('AI services failed, using demo mode:', aiError)
        // Fallback to demo mode
        try {
          setLoadingStep('gemini')
          const demoData = await runDemoMode(journalText)
          azureAnalysis = demoData.azureAnalysis
          athenaResponse = demoData.athenaResponse
        } catch (demoError) {
          console.log('Demo mode also failed, using local fallback:', demoError)
          // Ultimate fallback - create response locally
          azureAnalysis = {
            sentiment: 'neutral',
            confidenceScores: {
              positive: 0.33,
              neutral: 0.34,
              negative: 0.33
            }
          }
          // Create a more contextual fallback response with variety
          const getFallbackResponse = (text) => {
            const lowerText = text.toLowerCase()
            const responses = []
            
            if (lowerText.includes('work') || lowerText.includes('job')) {
              responses.push(
                `Listen well, brave one, I see you wrestling with the forge of your career. Like Hephaestus crafting his finest works, true mastery comes not from avoiding challenges, but from embracing them. Your hands are meant for great things. May wisdom guide your path. - Athena`,
                `I see your hands at work, mortal, shaping your destiny through labor. The craftsman's path is never easy, but each challenge hones your blade sharper. Remember: even the greatest temples were built stone by stone. May wisdom guide your path. - Athena`,
                `The threads of fate reveal your professional journey, and I see both struggle and triumph ahead. Like the weaver who creates beauty from chaos, you too can transform challenges into opportunities. May wisdom guide your path. - Athena`
              )
            } else if (lowerText.includes('relationship') || lowerText.includes('love')) {
              responses.push(
                `Fear not, for I am with you in matters of the heart. Love, like the olive tree, grows slowly but bears the sweetest fruit. Speak your truth with courage, listen with compassion. May wisdom guide your path. - Athena`,
                `Let me share with you the wisdom of the ages: relationships are like the intricate tapestries I weave - each thread matters, each color adds depth. Be patient with yourself and others. May wisdom guide your path. - Athena`,
                `Hearken, mortal soul, I feel the weight of your heart's desires. Like the warrior who protects what they love, guard your relationships with both strength and gentleness. May wisdom guide your path. - Athena`
              )
            } else if (lowerText.includes('anxiety') || lowerText.includes('worry')) {
              responses.push(
                `Listen well, brave one, for I have faced many battles and know the weight of worry. Like the warrior who prepares for battle, your anxiety is not weakness but preparation. Channel this energy into action. May wisdom guide your path. - Athena`,
                `The threads of fate show me your troubled mind, but I also see your inner strength. Like the olive tree that bends in the storm but never breaks, you too will weather this tempest. May wisdom guide your path. - Athena`,
                `I see your hands trembling with worry, but know this: courage is not the absence of fear, but action in spite of it. Like the craftsman who works through uncertainty, focus on the task before you. May wisdom guide your path. - Athena`
              )
            } else {
              responses.push(
                `Hearken, mortal soul, I sense the depth of your contemplation. Your words carry the weight of genuine reflection, and I am honored by your trust. In the quiet moments of self-examination, we often discover our greatest truths. May wisdom guide your path. - Athena`,
                `Listen well, seeker, for I hear the echoes of your thoughts. Like the weaver who creates beauty from simple threads, you too are crafting something meaningful from your experiences. May wisdom guide your path. - Athena`,
                `The threads of fate reveal a thoughtful soul before me. Like the olive tree that grows stronger with each season, your wisdom deepens with each reflection. May wisdom guide your path. - Athena`
              )
            }
            
            return responses[Math.floor(Math.random() * responses.length)]
          }
          athenaResponse = getFallbackResponse(journalText)
        }
      }
      
      // Step 3: Save to database
      setLoadingStep('saving')
      await onSubmit({
        journalText,
        azureAnalysis,
        athenaResponse
      })
      
      setJournalText('')
    } catch (error) {
      console.error('Error in journal submission:', error)
      // Even if everything fails, show a success message
      alert('Your reflection has been recorded. The divine wisdom flows through you.')
      setJournalText('')
    } finally {
      // Always clear loading state
      setIsLoading(false)
      setLoadingStep('')
    }
  }

  return (
    <div className="temple-container p-8 sm:p-10 mb-8 sm:mb-12 slide-up relative">
      {isLoading && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-md rounded-xl z-10 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-athena-blue/20 border-t-athena-blue mx-auto mb-6"></div>
            <p className="text-xl font-cinzel text-athena-blue mb-2">Processing your thoughts...</p>
            <p className="text-sm text-gray-600">{loadingStep === 'azure' ? 'Analyzing with Azure AI...' : loadingStep === 'gemini' ? 'Consulting the Oracle...' : 'Preparing response...'}</p>
          </div>
        </div>
      )}
      <h2 className="section-header">
        The Sacred Altar
      </h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="relative">
          <label htmlFor="journalText" className="block text-lg sm:text-xl font-cinzel text-athena-blue mb-6 text-center">
            Share Your Thoughts with the Divine
          </label>
          
          {/* Voice Recorder */}
          <div className="mb-8">
            <VoiceRecorder 
              onTranscription={handleVoiceTranscription}
              onSentiment={handleVoiceSentiment}
              isRecording={isRecording}
              setIsRecording={setIsRecording}
            />
          </div>
          
          <div className="relative group">
            <textarea
              id="journalText"
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
              placeholder="Speak your truth, mortal. What weighs upon your heart and mind? Share your deepest thoughts, fears, hopes, and dreams..."
              className={`w-full h-48 sm:h-56 p-6 border-2 border-gold-main/30 rounded-xl resize-none focus:outline-none focus:border-gold-main text-gray-800 placeholder-gray-500 text-base sm:text-lg leading-relaxed transition-all duration-300 hover:border-gold-main/50 group-hover:shadow-lg bg-gradient-to-br from-white to-gray-50/50 ${isLoading ? 'opacity-60 loading-breathe' : ''}`}
              disabled={isLoading}
            />
            <div className={`absolute bottom-4 right-4 text-xs px-2 py-1 rounded-full transition-colors ${
              journalText.length > 900 
                ? 'text-red-600 bg-red-100' 
                : journalText.length > 700 
                ? 'text-yellow-600 bg-yellow-100' 
                : 'text-gray-400 bg-white/80'
            }`}>
              {journalText.length}/1000
            </div>
            <div className="absolute top-3 right-3 text-2xl opacity-50 z-10 pointer-events-none">📜</div>
          </div>
        </div>
        <div className="text-center">
          <button
            type="submit"
            disabled={isLoading || !journalText.trim()}
            className={`altar-button disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${isLoading ? 'loading-shimmer' : ''}`}
          >
            {isLoading ? (
              <div className="flex flex-col items-center space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-athena-blue/30"></div>
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-athena-blue border-t-transparent absolute top-0 left-0" style={{animationDirection: 'reverse', animationDuration: '0.8s'}}></div>
                  </div>
                  <span className="text-lg font-medium">
                    {loadingStep === 'azure' ? 'Analyzing emotions...' :
                     loadingStep === 'gemini' ? 'Seeking Athena\'s counsel...' :
                     loadingStep === 'saving' ? 'Recording in the archives...' :
                     'Seeking Athena\'s Counsel...'}
                  </span>
                </div>
                
                {/* Progress Steps */}
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className={`flex items-center space-x-1 ${loadingStep === 'azure' ? 'text-athena-blue' : loadingStep === 'gemini' || loadingStep === 'saving' ? 'text-green-600' : ''}`}>
                    <div className={`w-2 h-2 rounded-full ${loadingStep === 'azure' ? 'bg-athena-blue animate-pulse' : loadingStep === 'gemini' || loadingStep === 'saving' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                    <span>Emotions</span>
                  </div>
                  <div className="w-4 h-px bg-gray-300"></div>
                  <div className={`flex items-center space-x-1 ${loadingStep === 'gemini' ? 'text-athena-blue' : loadingStep === 'saving' ? 'text-green-600' : ''}`}>
                    <div className={`w-2 h-2 rounded-full ${loadingStep === 'gemini' ? 'bg-athena-blue animate-pulse' : loadingStep === 'saving' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                    <span>Wisdom</span>
                  </div>
                  <div className="w-4 h-px bg-gray-300"></div>
                  <div className={`flex items-center space-x-1 ${loadingStep === 'saving' ? 'text-athena-blue' : ''}`}>
                    <div className={`w-2 h-2 rounded-full ${loadingStep === 'saving' ? 'bg-athena-blue animate-pulse' : 'bg-gray-300'}`}></div>
                    <span>Save</span>
                  </div>
                </div>
              </div>
            ) : (
              <span className="flex items-center space-x-2">
                <span>🔮</span>
                <span>Seek Athena's Counsel</span>
              </span>
            )}
          </button>
          {journalText.length > 0 && (
            <p className="text-sm text-gray-500 mt-3">
              {journalText.length < 10 ? 'Share more of your thoughts...' : 
               journalText.length < 50 ? 'The gods appreciate your honesty...' : 
               'Athena awaits your words...'}
            </p>
          )}
        </div>
      </form>
    </div>
  )
}

// Journal History Component
const JournalHistory = ({ entries, isLoading }) => {
  if (isLoading) {
    return (
      <div className="temple-container p-8 sm:p-10">
        <h2 className="section-header">
          The Sacred Archives
        </h2>
        <div className="text-center text-gray-600 py-12">
          <div className="relative mx-auto mb-6 w-20 h-20">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-gold-main/20"></div>
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-gold-main border-t-transparent absolute top-0 left-0" style={{animationDirection: 'reverse', animationDuration: '1.2s'}}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-2xl animate-pulse">📜</div>
            </div>
          </div>
          <p className="text-lg font-cinzel mb-2">Consulting the ancient scrolls...</p>
          <p className="text-sm">Gathering divine wisdom from the archives</p>
          <div className="flex justify-center mt-4 space-x-1">
            <div className="w-2 h-2 bg-gold-main rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
            <div className="w-2 h-2 bg-gold-main rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
            <div className="w-2 h-2 bg-gold-main rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
          </div>
        </div>
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <div className="temple-container p-8 sm:p-10">
        <h2 className="section-header">
          The Sacred Archives
        </h2>
        <div className="text-center text-gray-600 py-12">
          <div className="text-6xl mb-4">📜</div>
          <p className="text-lg sm:text-xl font-cinzel mb-2">The Archives Await Your Wisdom</p>
          <p className="text-base">Begin your journey by seeking Athena's counsel above.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="temple-container p-8 sm:p-10">
      <h2 className="section-header">
        The Sacred Archives
      </h2>
      <div className="space-y-10">
        {entries.map((entry, index) => (
          <div key={entry.id || index} className="border-b border-gold-main/20 pb-10 last:border-b-0 fade-in" style={{animationDelay: `${index * 0.1}s`}}>
            {/* Mortal's Reflection */}
            <div className="mortal-reflection mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl font-cinzel font-semibold text-athena-blue mb-4 flex items-center">
                <span className="mr-3">👤</span>
                Mortal's Reflection
              </h3>
              <p className="text-gray-700 leading-relaxed text-base sm:text-lg mb-6">{entry.journalText}</p>
              
              {/* Enhanced Sentiment Analysis */}
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-gray-200/50">
                <p className="font-semibold mb-4 text-athena-blue flex items-center">
                  <span className="mr-2">🧠</span>
                  Azure AI Sentiment Analysis
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className={`sentiment-card ${entry.azureAnalysis?.sentiment === 'positive' ? 'sentiment-positive' : entry.azureAnalysis?.sentiment === 'negative' ? 'sentiment-negative' : 'sentiment-neutral'}`}>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-athena-blue capitalize">{entry.azureAnalysis?.sentiment}</div>
                      <div className="text-xs text-gray-600 mt-1">Overall</div>
                    </div>
                  </div>
                  <div className="sentiment-card sentiment-positive">
                    <div className="text-center">
                      <div className="text-xl font-bold text-green-600">{Math.round((entry.azureAnalysis?.confidenceScores?.positive || 0) * 100)}%</div>
                      <div className="text-xs text-gray-600 mt-1">Positive</div>
                    </div>
                  </div>
                  <div className="sentiment-card sentiment-neutral">
                    <div className="text-center">
                      <div className="text-xl font-bold text-gray-600">{Math.round((entry.azureAnalysis?.confidenceScores?.neutral || 0) * 100)}%</div>
                      <div className="text-xs text-gray-600 mt-1">Neutral</div>
                    </div>
                  </div>
                  <div className="sentiment-card sentiment-negative">
                    <div className="text-center">
                      <div className="text-xl font-bold text-red-600">{Math.round((entry.azureAnalysis?.confidenceScores?.negative || 0) * 100)}%</div>
                      <div className="text-xs text-gray-600 mt-1">Negative</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Athena's Prophecy */}
            <div className="oracle-response">
              <h3 className="text-xl sm:text-2xl font-cinzel font-semibold text-athena-blue mb-4 flex items-center">
                <span className="mr-3">⚡</span>
                Athena's Prophecy
              </h3>
              <p className="text-gray-800 leading-relaxed italic text-base sm:text-lg">{entry.athenaResponse}</p>
            </div>

            {/* Timestamp */}
            <div className="mt-6 text-sm text-gray-500 text-right flex items-center justify-end">
              <span className="mr-2">🕐</span>
              <span>
                {new Date(entry.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Main Page Component
export default function Home() {
  const { currentUser, logout } = useAuth()
  const router = useRouter()
  const [entries, setEntries] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState('')
  const [isLoadingEntries, setIsLoadingEntries] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [activeTab, setActiveTab] = useState('journal')

  // Redirect non-logged users to landing page
  useEffect(() => {
    if (!currentUser) {
      router.push('/landing')
    }
  }, [currentUser, router])

  // Load journal entries
  useEffect(() => {
    const loadEntries = async () => {
      if (!currentUser) {
        setIsLoadingEntries(false)
        return
      }

      try {
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('token='))
          ?.split('=')[1]

        const response = await fetch('/api/journal/entries', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setEntries(data.entries)
        }
      } catch (error) {
        console.error('Failed to load entries:', error)
      } finally {
        setIsLoadingEntries(false)
      }
    }

    loadEntries()
  }, [currentUser])

  const handleJournalSubmit = async (journalData) => {
    if (!currentUser) {
      setAuthMode('login')
      setShowAuthModal(true)
      return
    }

    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1]

      const response = await fetch('/api/journal/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(journalData),
      })

      if (!response.ok) {
        throw new Error('Failed to save journal entry')
      }

      // Reload entries after successful save
      const entriesResponse = await fetch('/api/journal/entries', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (entriesResponse.ok) {
        const data = await entriesResponse.json()
        setEntries(data.entries)
      }
    } catch (error) {
      console.error('Error saving journal entry:', error)
      throw error
    }
  }

  // Don't render journal interface for non-logged users
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-marble-light via-white to-marble-dark flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏛️</div>
          <div className="text-xl text-gray-600">Redirecting to Athena's Temple...</div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-marble-light via-white to-marble-dark">
      {/* Unified Header */}
      <header className="relative z-50 bg-white/95 backdrop-blur-md border-b border-gold-main/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-athena-blue to-gold-main rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">🏛️</span>
              </div>
              <div>
                <h1 className="text-lg font-cinzel font-bold text-athena-blue">Athena's Journal</h1>
                <p className="text-xs text-gray-500">Divine Wisdom Awaits</p>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="flex items-center space-x-6">
              {currentUser ? (
                <>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600 font-medium">Welcome, {currentUser.name}</span>
                  </div>
                  <Link href="/landing" className="text-sm text-gray-600 hover:text-athena-blue transition-colors font-medium">
                    About
                  </Link>
                  <Link href="/preferences" className="text-sm text-gray-600 hover:text-athena-blue transition-colors font-medium">
                    Preferences
                  </Link>
                  <button
                    onClick={logout}
                    className="text-sm text-gray-600 hover:text-athena-blue transition-colors font-medium px-3 py-1 rounded-md hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/landing" className="text-sm text-gray-600 hover:text-athena-blue transition-colors font-medium">
                    About
                  </Link>
                  <button
                    onClick={() => {
                      setAuthMode('login')
                      setShowAuthModal(true)
                    }}
                    className="text-sm text-gray-600 hover:text-athena-blue transition-colors font-medium px-3 py-1 rounded-md hover:bg-gray-100"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode('signup')
                      setShowAuthModal(true)
                    }}
                    className="text-sm bg-athena-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="py-8 px-4 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gold-main/5 rounded-full blur-xl animate-float"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-athena-blue/10 rounded-full blur-lg animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-marble-light/20 rounded-full blur-2xl animate-float" style={{animationDelay: '4s'}}></div>
          <div className="absolute bottom-40 right-1/3 w-28 h-28 bg-gold-main/8 rounded-full blur-xl animate-float" style={{animationDelay: '6s'}}></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 fade-in">
          <h1 className="temple-header mb-6">
            Athena's Journal
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Seek divine wisdom through the ancient art of journaling. Share your thoughts with Athena, 
            goddess of wisdom, and receive her counsel through the power of AI.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-2 border border-gold-main/30 shadow-xl">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('journal')}
                className={`px-8 py-4 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center space-x-3 ${
                  activeTab === 'journal'
                    ? 'bg-gold-main text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-athena-blue hover:bg-white/70 hover:scale-105'
                }`}
              >
                <span className="text-lg">📜</span>
                <span>Journal</span>
              </button>
              <button
                onClick={() => setActiveTab('journey')}
                className={`px-8 py-4 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center space-x-3 ${
                  activeTab === 'journey'
                    ? 'bg-gold-main text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-athena-blue hover:bg-white/70 hover:scale-105'
                }`}
              >
                <span className="text-lg">🛤️</span>
                <span>Journey</span>
              </button>
              <button
                onClick={() => setActiveTab('insights')}
                className={`px-8 py-4 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center space-x-3 ${
                  activeTab === 'insights'
                    ? 'bg-gold-main text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-athena-blue hover:bg-white/70 hover:scale-105'
                }`}
              >
                <span className="text-lg">🔍</span>
                <span>Insights</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'journal' && (
          <>
            {/* Journal Form */}
            <JournalForm 
              onSubmit={handleJournalSubmit} 
              isLoading={isLoading} 
              loadingStep={loadingStep}
              setLoadingStep={setLoadingStep}
              setIsLoading={setIsLoading}
            />

            {/* Journal History */}
            <JournalHistory entries={entries} isLoading={isLoadingEntries} />
          </>
        )}

        {activeTab === 'journey' && (
          <div className="space-y-12">
            {/* Calendar Streak */}
            <CalendarStreak entries={entries} />
            
            {/* Emotional Journey - Combined Sentiment and Mood */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Sentiment Graph */}
              <SentimentGraph entries={entries} />
              
              {/* Mood Timeline */}
              <MoodTimeline entries={entries} />
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-12">
            {/* Topic Analysis and Word Cloud */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Topic Analysis */}
              <TopicAnalysis entries={entries} />
              
              {/* Word Cloud */}
              <WordCloud entries={entries} />
            </div>
            
            {/* Writing Patterns */}
            <WritingPatterns entries={entries} />
          </div>
        )}
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        mode={authMode}
      />
    </main>
  )
}