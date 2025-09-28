'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'
import EmailPreferences from '../components/EmailPreferences'

export default function PreferencesPage() {
  const { currentUser } = useAuth()
  const router = useRouter()
  const [reminderStats, setReminderStats] = useState({
    reminderCount: 0,
    lastReminderSent: null,
    enabled: false
  })

  useEffect(() => {
    if (!currentUser) {
      router.push('/landing')
    } else {
      fetchReminderStats()
    }
  }, [currentUser, router])

  const fetchReminderStats = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1]

      const response = await fetch('/api/reminders', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setReminderStats(data)
      }
    } catch (error) {
      console.error('Error fetching reminder stats:', error)
    }
  }

  const sendTestReminder = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1]

      const response = await fetch('/api/reminders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        alert('Test reminder sent successfully!')
        fetchReminderStats() // Refresh stats
      } else {
        const error = await response.json()
        alert(`Failed to send reminder: ${error.error}`)
      }
    } catch (error) {
      console.error('Error sending test reminder:', error)
      alert('Failed to send test reminder')
    }
  }

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
    <main className="min-h-screen py-8 px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gold-main/5 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-athena-blue/10 rounded-full blur-lg animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-marble-light/20 rounded-full blur-2xl animate-float" style={{animationDelay: '4s'}}></div>
        <div className="absolute bottom-40 right-1/3 w-28 h-28 bg-gold-main/8 rounded-full blur-xl animate-float" style={{animationDelay: '6s'}}></div>
      </div>

      {/* Status Bar */}
      <div className="fixed top-4 left-4 z-50">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg border border-gold-main/20">
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gray-700 font-medium">Athena's Journal</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="absolute top-4 right-4 z-50">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg px-6 py-3 shadow-lg border border-gold-main/20">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600 font-medium">Welcome, {currentUser.name}</span>
              </div>
              <button
                onClick={() => router.push('/')}
                className="text-sm text-gray-600 hover:text-athena-blue transition-colors font-medium px-3 py-1 rounded-md hover:bg-gray-100"
              >
                Back to Journal
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 fade-in">
          <h1 className="temple-header mb-6">
            ⚙️ Preferences
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Customize your Athena's Journal experience and manage your email reminders.
          </p>
        </div>

        {/* Reminder Statistics */}
        {reminderStats.enabled && (
          <div className="temple-container p-6 mb-8">
            <h3 className="section-header mb-6">📊 Reminder Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gold-main mb-2">{reminderStats.reminderCount}</div>
                <div className="text-gray-600">Total Reminders Sent</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-athena-blue mb-2">
                  {reminderStats.lastReminderSent 
                    ? new Date(reminderStats.lastReminderSent).toLocaleDateString()
                    : 'Never'
                  }
                </div>
                <div className="text-gray-600">Last Reminder Sent</div>
              </div>
              <div className="text-center">
                <button
                  onClick={sendTestReminder}
                  className="altar-button px-6 py-2 text-sm"
                >
                  Send Test Reminder
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Email Preferences Component */}
        <EmailPreferences />
      </div>
    </main>
  )
}
