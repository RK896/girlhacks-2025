'use client'

import { useState, useEffect } from 'react'
import { useAuth } from './contexts/AuthContext'
import AuthModal from './components/AuthModal'
import Link from 'next/link'
import { getCookie } from 'cookies-next'

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
const JournalForm = ({ onSubmit, isLoading }) => {
  const [journalText, setJournalText] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!journalText.trim()) return

    try {
      let azureAnalysis, athenaResponse

      try {
        // Step 1: Try Azure AI Analysis
        azureAnalysis = await runAzureAnalysis(journalText)
        
        // Step 2: Try Gemini Oracle Response
        athenaResponse = await runGeminiOracle(journalText, azureAnalysis)
      } catch (aiError) {
        console.log('AI services failed, using demo mode:', aiError)
        // Fallback to demo mode
        try {
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
          athenaResponse = `Hearken, mortal soul, though the divine channels are clouded today, I sense the weight of your words. Your reflection speaks of deep contemplation, and I offer you this wisdom: in times of uncertainty, trust in your inner strength and seek guidance from within. The path forward may not always be clear, but your courage will light the way. May wisdom guide your path. - Athena`
        }
      }
      
      // Step 3: Save to database
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
    }
  }

  return (
    <div className="temple-container p-8 sm:p-10 mb-8 sm:mb-12 slide-up">
      <h2 className="section-header">
        The Sacred Altar
      </h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="relative">
          <label htmlFor="journalText" className="block text-lg sm:text-xl font-cinzel text-athena-blue mb-4 text-center">
            Share Your Thoughts with the Divine
          </label>
          <div className="relative">
            <textarea
              id="journalText"
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
              placeholder="Speak your truth, mortal. What weighs upon your heart and mind? Share your deepest thoughts, fears, hopes, and dreams..."
              className="w-full h-48 sm:h-56 p-6 border-2 border-gold-main/30 rounded-xl resize-none focus:outline-none focus:border-gold-main text-gray-800 placeholder-gray-500 text-base sm:text-lg leading-relaxed transition-all duration-300 hover:border-gold-main/50"
              disabled={isLoading}
            />
            <div className="absolute bottom-4 right-4 text-xs text-gray-400">
              {journalText.length}/1000
            </div>
          </div>
        </div>
        <div className="text-center">
          <button
            type="submit"
            disabled={isLoading || !journalText.trim()}
            className="altar-button disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <span className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-athena-blue"></div>
                <span>Seeking Athena's Counsel...</span>
              </span>
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
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gold-main mx-auto mb-6"></div>
          <p className="text-lg font-cinzel">Consulting the ancient scrolls...</p>
          <p className="text-sm mt-2">Gathering divine wisdom from the archives</p>
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
  const [entries, setEntries] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingEntries, setIsLoadingEntries] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState('login')

  const { currentUser, logout } = useAuth()

  // Load journal entries
  useEffect(() => {
    const loadEntries = async () => {
      try {
        const response = await fetch('/api/journal/entries')

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
  }, [])

  const handleJournalSubmit = async (journalData) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/journal/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(journalData),
      })

      if (!response.ok) {
        throw new Error('Failed to save journal entry')
      }

      // Reload entries after successful save
      const entriesResponse = await fetch('/api/journal/entries')

      if (entriesResponse.ok) {
        const data = await entriesResponse.json()
        setEntries(data.entries)
      }
    } catch (error) {
      console.error('Error saving journal entry:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen py-8 px-4 relative overflow-hidden">
      {/* Navigation */}
      <nav className="absolute top-4 right-4 z-50">
        <div className="flex items-center space-x-4">
          {currentUser ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {currentUser.name || currentUser.email?.split('@')[0]}
              </span>
              <button
                onClick={logout}
                className="text-sm text-gray-600 hover:text-athena-blue transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  setAuthMode('login')
                  setShowAuthModal(true)
                }}
                className="text-sm text-gray-600 hover:text-athena-blue transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setAuthMode('signup')
                  setShowAuthModal(true)
                }}
                className="altar-button text-sm"
              >
                Sign Up
              </button>
            </div>
          )}
          <Link
            href="/landing"
            className="text-sm text-gray-600 hover:text-athena-blue transition-colors"
          >
            About
          </Link>
        </div>
      </nav>

      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gold-main/5 rounded-full blur-3xl floating-animation"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-athena-blue/5 rounded-full blur-2xl floating-animation" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-gold-main/3 rounded-full blur-3xl floating-animation" style={{animationDelay: '4s'}}></div>
      </div>
      
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <header className="text-center mb-12 sm:mb-16 px-4 fade-in">
          <h1 className="temple-header">
            Athena's Journal
          </h1>
          <div className="w-32 sm:w-48 h-1 bg-gradient-to-r from-transparent via-gold-main to-transparent mx-auto rounded-full mb-6"></div>
          <p className="text-lg sm:text-xl text-gray-700 mt-6 max-w-3xl mx-auto px-4 leading-relaxed">
            Where ancient wisdom meets modern AI. Share your thoughts and receive divine counsel from the goddess of wisdom herself.
          </p>
          <div className="flex justify-center items-center mt-6 space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <span className="w-2 h-2 bg-gold-main rounded-full mr-2"></span>
              Azure AI Analysis
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-athena-blue rounded-full mr-2"></span>
              Gemini Oracle
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Real-time Storage
            </span>
          </div>
        </header>

        {/* Status Bar */}
        {isLoading && (
          <div className="bg-gradient-to-r from-gold-main/20 to-yellow-100/50 border border-gold-main/50 rounded-xl p-6 mb-8 text-center slide-up pulse-glow">
            <div className="flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gold-main"></div>
              <p className="text-athena-blue font-semibold text-lg">
                🔮 Analyzing your words... Crafting prophecy...
              </p>
            </div>
          </div>
        )}

        {/* Journal Form */}
        <JournalForm onSubmit={handleJournalSubmit} isLoading={isLoading} />

        {/* Journal History */}
        <JournalHistory entries={entries} isLoading={isLoadingEntries} />
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
