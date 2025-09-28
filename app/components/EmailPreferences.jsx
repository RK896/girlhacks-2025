'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function EmailPreferences() {
  const { currentUser } = useAuth()
  const [preferences, setPreferences] = useState({
    enabled: false,
    frequency: 'daily',
    timeOfDay: 'evening',
    specificTime: '20:00',
    daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    timezone: 'UTC'
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (currentUser) {
      fetchPreferences()
    }
  }, [currentUser])

  const fetchPreferences = async () => {
    try {
      // Demo mode - use default preferences
      console.log('Demo mode: Using default email preferences')
      setPreferences({
        enabled: false,
        frequency: 'daily',
        timeOfDay: 'evening',
        specificTime: '20:00',
        daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        timezone: 'UTC'
      })
    } catch (error) {
      console.error('Error setting default preferences:', error)
    } finally {
      setLoading(false)
    }
  }

  const savePreferences = async () => {
    setSaving(true)
    setMessage('')

    try {
      // Demo mode - simulate saving
      console.log('Demo mode: Saving preferences:', preferences)
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      setMessage('Preferences saved successfully! (Demo Mode)')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error saving preferences:', error)
      setMessage('Failed to save preferences. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleFrequencyChange = (frequency) => {
    setPreferences(prev => ({
      ...prev,
      frequency,
      // Reset days of week for non-weekly frequencies
      daysOfWeek: frequency === 'weekly' || frequency === 'biweekly' 
        ? prev.daysOfWeek 
        : ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }))
  }

  const handleDayToggle = (day) => {
    setPreferences(prev => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter(d => d !== day)
        : [...prev.daysOfWeek, day]
    }))
  }

  const days = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ]

  if (loading) {
    return (
      <div className="temple-container p-8">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gold-main border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading preferences...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="temple-container">
      <h2 className="section-header mb-8">
        📧 Email Reminder Preferences
      </h2>
      
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Enable/Disable Toggle */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-gold-main/30">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Email Reminders</h3>
              <p className="text-gray-600 text-sm">
                Receive gentle reminders to maintain your journaling practice
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.enabled}
                onChange={(e) => setPreferences(prev => ({ ...prev, enabled: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gold-main/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-main"></div>
            </label>
          </div>
        </div>

        {preferences.enabled && (
          <>
            {/* Frequency Selection */}
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-gold-main/30">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Reminder Frequency</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'daily', label: 'Daily', icon: '📅' },
                  { value: 'weekly', label: 'Weekly', icon: '📆' },
                  { value: 'biweekly', label: 'Bi-weekly', icon: '🗓️' },
                  { value: 'monthly', label: 'Monthly', icon: '📊' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleFrequencyChange(option.value)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      preferences.frequency === option.value
                        ? 'border-gold-main bg-gold-main/10 text-gold-main'
                        : 'border-gray-200 hover:border-gold-main/50'
                    }`}
                  >
                    <div className="text-lg mb-1">{option.icon}</div>
                    <div className="font-medium">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Time of Day */}
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-gold-main/30">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Time of Day</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'morning', label: 'Morning', icon: '🌅', time: '08:00' },
                  { value: 'afternoon', label: 'Afternoon', icon: '☀️', time: '14:00' },
                  { value: 'evening', label: 'Evening', icon: '🌙', time: '20:00' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setPreferences(prev => ({ 
                      ...prev, 
                      timeOfDay: option.value,
                      specificTime: option.time
                    }))}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      preferences.timeOfDay === option.value
                        ? 'border-gold-main bg-gold-main/10 text-gold-main'
                        : 'border-gray-200 hover:border-gold-main/50'
                    }`}
                  >
                    <div className="text-lg mb-1">{option.icon}</div>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-xs text-gray-500">{option.time}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Time */}
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-gold-main/30">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Custom Time</h3>
              <div className="flex items-center space-x-4">
                <label className="text-gray-600">Send reminders at:</label>
                <input
                  type="time"
                  value={preferences.specificTime}
                  onChange={(e) => setPreferences(prev => ({ ...prev, specificTime: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-main focus:border-gold-main"
                />
                <span className="text-sm text-gray-500">
                  (24-hour format)
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                💡 Tip: Choose a time when you're most likely to journal
              </p>
            </div>

            {/* Timezone Selection */}
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-gold-main/30">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Timezone</h3>
              <div className="flex items-center space-x-4">
                <label className="text-gray-600">Your timezone:</label>
                <select
                  value={preferences.timezone}
                  onChange={(e) => setPreferences(prev => ({ ...prev, timezone: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-main focus:border-gold-main"
                >
                  <option value="UTC">UTC (Coordinated Universal Time)</option>
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="Europe/London">London (GMT)</option>
                  <option value="Europe/Paris">Paris (CET)</option>
                  <option value="Asia/Tokyo">Tokyo (JST)</option>
                  <option value="Asia/Shanghai">Shanghai (CST)</option>
                  <option value="Australia/Sydney">Sydney (AEST)</option>
                </select>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                🌍 Reminders will be sent according to your local timezone
              </p>
            </div>
            {(preferences.frequency === 'weekly' || preferences.frequency === 'biweekly') && (
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-gold-main/30">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Days of Week</h3>
                <div className="grid grid-cols-7 gap-2">
                  {days.map((day) => (
                    <button
                      key={day.key}
                      onClick={() => handleDayToggle(day.key)}
                      className={`p-2 rounded-lg border-2 transition-all text-sm ${
                        preferences.daysOfWeek.includes(day.key)
                          ? 'border-gold-main bg-gold-main/10 text-gold-main'
                          : 'border-gray-200 hover:border-gold-main/50'
                      }`}
                    >
                      {day.label.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Summary */}
            <div className="bg-gradient-to-r from-gold-main/10 to-athena-blue/10 rounded-lg p-6 border border-gold-main/30">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 Summary</h3>
              <div className="space-y-2 text-gray-700">
                <p><strong>Frequency:</strong> {preferences.frequency.charAt(0).toUpperCase() + preferences.frequency.slice(1)}</p>
                <p><strong>Time:</strong> {preferences.specificTime} ({preferences.timeOfDay})</p>
                {(preferences.frequency === 'weekly' || preferences.frequency === 'biweekly') && (
                  <p><strong>Days:</strong> {preferences.daysOfWeek.map(day => day.charAt(0).toUpperCase() + day.slice(1)).join(', ')}</p>
                )}
              </div>
            </div>
          </>
        )}

        {/* Save Button */}
        <div className="flex justify-center">
          <button
            onClick={savePreferences}
            disabled={saving}
            className="altar-button px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className={`text-center p-4 rounded-lg ${
            message.includes('success') 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  )
}
