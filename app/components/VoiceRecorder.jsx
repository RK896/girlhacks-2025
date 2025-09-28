'use client'

import { useState, useRef, useEffect } from 'react'

export default function VoiceRecorder({ onTranscription, onSentiment, isRecording, setIsRecording }) {
  const [isSupported, setIsSupported] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)
  const [permissionGranted, setPermissionGranted] = useState(true)
  const [recordingStartTime, setRecordingStartTime] = useState(null)
  const [interimResults, setInterimResults] = useState('')
  const recognitionRef = useRef(null)

  useEffect(() => {
    // Check if browser supports Web Speech API
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true)
      initializeSpeechRecognition()
    }
  }, [])

  const initializeSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    recognitionRef.current = new SpeechRecognition()
    
    // Configure recognition settings
    recognitionRef.current.continuous = true
    recognitionRef.current.interimResults = true
    recognitionRef.current.lang = 'en-US'
    recognitionRef.current.maxAlternatives = 1

    // Handle recognition results
    recognitionRef.current.onresult = (event) => {
      let finalTranscript = ''
      let interimTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript
        } else {
          interimTranscript += transcript
        }
      }

      // Update interim results for real-time display
      setInterimResults(interimTranscript)

      // If we have final results, process them
      if (finalTranscript) {
        console.log('Final transcript:', finalTranscript)
        handleTranscription(finalTranscript)
      }
    }

    // Handle recognition end
    recognitionRef.current.onend = () => {
      console.log('Speech recognition ended')
      setIsRecording(false)
      setRecordingStartTime(null)
      setInterimResults('')
    }

    // Handle recognition errors
    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      setIsRecording(false)
      setRecordingStartTime(null)
      setInterimResults('')
      
      let errorMessage = 'Speech recognition failed. '
      
      switch (event.error) {
        case 'no-speech':
          errorMessage += 'No speech was detected. Please try speaking more clearly.'
          break
        case 'audio-capture':
          errorMessage += 'Microphone not found or not accessible.'
          break
        case 'not-allowed':
          errorMessage += 'Microphone permission denied. Please allow microphone access.'
          break
        case 'network':
          errorMessage += 'Network error occurred during speech recognition.'
          break
        case 'aborted':
          errorMessage += 'Speech recognition was aborted.'
          break
        default:
          errorMessage += `Unknown error: ${event.error}`
      }
      
      setError(errorMessage)
    }

    // Handle recognition start
    recognitionRef.current.onstart = () => {
      console.log('Speech recognition started')
      setIsRecording(true)
      setRecordingStartTime(Date.now())
      setError(null)
    }
  }



  const startRecording = async () => {
    if (!recognitionRef.current) {
      setError('Speech recognition not initialized. Please refresh the page.')
      return
    }

    try {
      setError(null)
      
      // Request microphone permission if not already granted
      if (!permissionGranted) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
          setPermissionGranted(true)
          // Stop the stream immediately as we just wanted to check permission
          stream.getTracks().forEach(track => track.stop())
        } catch (err) {
          console.error('Permission request failed:', err)
          setError('Please allow microphone access in your browser settings and try again.')
          return
        }
      }
      
      // Always start recording - this will add to existing text
      recognitionRef.current.start()
    } catch (err) {
      console.error('Error starting speech recognition:', err)
      setError('Failed to start speech recognition. Please try again.')
    }
  }

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop()
    }
  }

  const handleTranscription = async (transcribedText) => {
    setIsProcessing(true)
    
    try {
      console.log('Processing transcribed text:', transcribedText)
      
      // Call the parent component callback for transcription
      if (onTranscription && transcribedText) {
        onTranscription(transcribedText)
      }
      
      // For sentiment analysis, we'll use a simple keyword-based approach
      // This provides basic sentiment analysis for voice recordings
      const sentiment = analyzeSentiment(transcribedText)
      
      if (onSentiment && sentiment) {
        onSentiment(sentiment)
      }
      
    } catch (err) {
      console.error('Error processing transcription:', err)
      setError(`Failed to process transcription: ${err.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const analyzeSentiment = (text) => {
    // Simple sentiment analysis based on keywords
    // This provides basic sentiment analysis for voice recordings
    const positiveWords = ['happy', 'good', 'great', 'excellent', 'wonderful', 'amazing', 'love', 'like', 'enjoy']
    const negativeWords = ['sad', 'bad', 'terrible', 'awful', 'hate', 'dislike', 'angry', 'frustrated', 'worried']
    
    const lowerText = text.toLowerCase()
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length
    
    let sentiment = 'neutral'
    if (positiveCount > negativeCount) {
      sentiment = 'positive'
    } else if (negativeCount > positiveCount) {
      sentiment = 'negative'
    }
    
    return {
      sentiment,
      confidenceScores: {
        positive: sentiment === 'positive' ? 0.8 : sentiment === 'neutral' ? 0.3 : 0.1,
        neutral: sentiment === 'neutral' ? 0.8 : 0.3,
        negative: sentiment === 'negative' ? 0.8 : sentiment === 'neutral' ? 0.3 : 0.1
      }
    }
  }

  if (!isSupported) {
    return (
      <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">Speech recognition is not supported in this browser.</p>
        <p className="text-yellow-700 text-sm mt-2">Please use Chrome, Edge, or Safari for voice recording.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Recording Controls */}
      <div className="flex justify-center">
        {!isRecording ? (
          <button
            type="button"
            onClick={startRecording}
            disabled={isProcessing}
            className="group flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-medium"
          >
            <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            </div>
            <span>
              {isProcessing ? 'Processing...' : 'Start Recording'}
            </span>
            <div className="text-xl">{isProcessing ? '⏳' : '🎙️'}</div>
          </button>
        ) : (
          <button
            type="button"
            onClick={stopRecording}
            className="group flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 font-medium"
          >
            <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-gray-600 rounded-full animate-pulse"></div>
            </div>
            <span>Stop Recording</span>
            <div className="text-xl">⏹️</div>
          </button>
        )}
      </div>

      {/* Recording Status */}
      {isRecording && (
        <div className="text-center">
          <div className="status-indicator status-recording">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span>Listening... Speak clearly</span>
            <div className="text-lg">🎙️</div>
          </div>
          {recordingStartTime && (
            <div className="text-sm text-gray-500 mt-3 bg-gray-100 px-3 py-1 rounded-full inline-block">
              Duration: {Math.floor((Date.now() - recordingStartTime) / 1000)}s
            </div>
          )}
        </div>
      )}

      {/* Interim Results */}
      {interimResults && (
        <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-blue-800 text-sm italic">"{interimResults}"</p>
          <p className="text-blue-600 text-xs mt-1">Listening...</p>
        </div>
      )}

      {/* Processing Status */}
      {isProcessing && (
        <div className="text-center">
          <div className="status-indicator status-processing">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Processing speech...</span>
            <div className="text-lg">⏳</div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="text-center p-4 bg-red-50 border border-red-200 rounded-xl shadow-sm">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="text-lg">⚠️</div>
            <p className="text-red-800 font-medium">Error</p>
          </div>
          <p className="text-red-700 text-sm">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-3 text-sm text-red-600 hover:text-red-800 underline bg-white px-3 py-1 rounded-full border border-red-200 hover:bg-red-50 transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Instructions */}
      <div className="text-center text-sm text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-200">
        <div>
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="text-lg">💬</div>
            <p className="text-gray-700 font-medium">Voice Recording Ready</p>
          </div>
          <p className="text-gray-600">Click "Start Recording" to begin voice recording, then speak your journal entry. You can record multiple times to add more text.</p>
        </div>
      </div>

    </div>
  )
}