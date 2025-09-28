'use client'

import { useState, useRef, useEffect } from 'react'

export default function VoiceRecorder({ onTranscription, onSentiment, isRecording, setIsRecording }) {
  const [isSupported, setIsSupported] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)
  const [permissionGranted, setPermissionGranted] = useState(false)
  const [debugInfo, setDebugInfo] = useState({})
  const [recordingStartTime, setRecordingStartTime] = useState(null)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])

  useEffect(() => {
    // Check if browser supports media recording
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      setIsSupported(true)
      checkMicrophonePermission()
      
      // Gather debug information
      const debug = {
        userAgent: navigator.userAgent,
        isSecureContext: window.isSecureContext,
        protocol: window.location.protocol,
        hostname: window.location.hostname,
        mediaDevicesSupported: !!navigator.mediaDevices,
        getUserMediaSupported: !!navigator.mediaDevices?.getUserMedia,
        mediaRecorderSupported: !!window.MediaRecorder,
        supportedMimeTypes: []
      }
      
      // Check supported MIME types
      if (window.MediaRecorder) {
        const types = ['audio/wav', 'audio/webm', 'audio/mp4', 'audio/ogg']
        debug.supportedMimeTypes = types.filter(type => MediaRecorder.isTypeSupported(type))
      }
      
      setDebugInfo(debug)
    }
  }, [])

  const checkMicrophonePermission = async () => {
    try {
      // Try to actually access the microphone to check if it works
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setPermissionGranted(true)
      // Stop the stream immediately as we just wanted to check permission
      stream.getTracks().forEach(track => track.stop())
    } catch (err) {
      console.log('Microphone permission check failed:', err)
      setPermissionGranted(false)
    }
  }

  const requestMicrophonePermission = async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setPermissionGranted(true)
      // Stop the stream immediately as we just wanted to check permission
      stream.getTracks().forEach(track => track.stop())
    } catch (err) {
      console.error('Permission request failed:', err)
      setError('Please allow microphone access in your browser settings and refresh the page.')
    }
  }

  const startRecording = async () => {
    try {
      setError(null)
      
      // Check if getUserMedia is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia is not supported in this browser')
      }
      
      console.log('Attempting to access microphone...')
      
      // Request microphone permission with optimized settings for speech recognition
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000, // 16kHz is optimal for speech recognition
          channelCount: 1,   // Mono audio
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          latency: 0.01      // Low latency
        } 
      })
      
      console.log('Microphone access successful:', stream)
      
      // Force WAV format for best Azure compatibility
      let mimeType = 'audio/wav'
      if (!MediaRecorder.isTypeSupported('audio/wav')) {
        // Fallback to other formats if WAV not supported
        const fallbackTypes = [
          'audio/webm; codecs=opus',
          'audio/webm',
          'audio/mp4; codecs=mp4a.40.2',
          'audio/mp4'
        ]
        
        for (const type of fallbackTypes) {
          if (MediaRecorder.isTypeSupported(type)) {
            mimeType = type
            console.log('WAV not supported, using fallback:', type)
            break
          }
        }
      } else {
        console.log('Using WAV format for best Azure compatibility')
      }
      
      console.log('Using MIME type:', mimeType)
      console.log('WebM with Opus supported:', MediaRecorder.isTypeSupported('audio/webm; codecs=opus'))
      console.log('WebM supported:', MediaRecorder.isTypeSupported('audio/webm'))
      console.log('MP4 supported:', MediaRecorder.isTypeSupported('audio/mp4'))
      
      const mediaRecorderOptions = {
        mimeType: mimeType
      }
      
      // Add bitrate for better quality
      if (mimeType.includes('webm') || mimeType.includes('mp4')) {
        mediaRecorderOptions.audioBitsPerSecond = 128000
      }
      
      console.log('MediaRecorder options:', mediaRecorderOptions)
      
      mediaRecorderRef.current = new MediaRecorder(stream, mediaRecorderOptions)
      
      audioChunksRef.current = []
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }
      
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType })
        console.log('Audio blob created:', {
          size: audioBlob.size,
          type: audioBlob.type,
          chunks: audioChunksRef.current.length
        })
        await processAudio(audioBlob)
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop())
      }
      
      mediaRecorderRef.current.start()
      setIsRecording(true)
      setRecordingStartTime(Date.now())
      
    } catch (err) {
      console.error('Error starting recording:', err)
      
      let errorMessage = 'Failed to access microphone. '
      
      if (err.name === 'NotAllowedError') {
        errorMessage += 'Please allow microphone access and try again.'
      } else if (err.name === 'NotFoundError') {
        errorMessage += 'No microphone found. Please connect a microphone.'
      } else if (err.name === 'NotSupportedError') {
        errorMessage += 'Microphone access is not supported in this browser.'
      } else if (err.name === 'NotReadableError') {
        errorMessage += 'Microphone is being used by another application.'
      } else if (err.message.includes('getUserMedia is not supported')) {
        errorMessage += 'Voice recording is not supported in this browser.'
      } else {
        errorMessage += 'Please check your browser permissions and try again.'
      }
      
      setError(errorMessage)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      const recordingDuration = Date.now() - recordingStartTime
      console.log('Recording duration:', recordingDuration, 'ms')
      
      if (recordingDuration < 2000) {
        setError('Please record for at least 2 seconds for better speech recognition.')
        setIsRecording(false)
        setRecordingStartTime(null)
        return
      }
      
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setRecordingStartTime(null)
    }
  }

  const processAudio = async (audioBlob) => {
    setIsProcessing(true)
    
    try {
      console.log('Processing audio blob:', {
        size: audioBlob.size,
        type: audioBlob.type
      })
      
      const formData = new FormData()
      formData.append('audio', audioBlob, `recording.${audioBlob.type.split('/')[1]}`)
      
      console.log('Sending audio to API...')
      const response = await fetch('/api/ai/speech', {
        method: 'POST',
        body: formData
      })
      
      console.log('API response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('API error response:', errorText)
        throw new Error(`API error: ${response.status} - ${errorText}`)
      }
      
      const data = await response.json()
      console.log('API response data:', data)
      console.log('Transcribed text:', data.transcribedText)
      console.log('Sentiment:', data.sentiment)
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      // Call the parent component callbacks
      if (onTranscription && data.transcribedText) {
        onTranscription(data.transcribedText)
      }
      
      if (onSentiment && data.sentiment) {
        onSentiment(data.sentiment)
      }
      
    } catch (err) {
      console.error('Error processing audio:', err)
      setError(`Failed to process audio: ${err.message}. Please try again.`)
    } finally {
      setIsProcessing(false)
    }
  }

  const convertToWav = async (audioBlob) => {
    try {
      // For now, just return the original blob
      // In a production app, you'd want to use a library like lamejs or similar
      // to convert to proper WAV format
      return audioBlob
    } catch (err) {
      console.error('Error converting audio:', err)
      return audioBlob
    }
  }

  if (!isSupported) {
    return (
      <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">Voice recording is not supported in this browser.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Recording Controls */}
      <div className="flex justify-center">
        {!permissionGranted ? (
          <button
            onClick={requestMicrophonePermission}
            className="group flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 font-medium"
          >
            <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
            <span>Enable Microphone</span>
            <div className="text-xl">🎤</div>
          </button>
        ) : !isRecording ? (
          <button
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
            <span>Recording... Speak clearly for at least 2 seconds</span>
            <div className="text-lg">🎙️</div>
          </div>
          {recordingStartTime && (
            <div className="text-sm text-gray-500 mt-3 bg-gray-100 px-3 py-1 rounded-full inline-block">
              Duration: {Math.floor((Date.now() - recordingStartTime) / 1000)}s
            </div>
          )}
        </div>
      )}

      {/* Processing Status */}
      {isProcessing && (
        <div className="text-center">
          <div className="status-indicator status-processing">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Processing audio...</span>
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
        {!permissionGranted ? (
          <div>
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="text-lg">🎤</div>
              <p className="text-blue-600 font-medium">Microphone access required for voice recording</p>
            </div>
            <p className="text-gray-600">Click "Enable Microphone" to allow voice recording, then speak your journal entry.</p>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="text-lg">💬</div>
              <p className="text-gray-700 font-medium">Voice Recording Ready</p>
            </div>
            <p className="text-gray-600">Click to start recording your voice, then speak your journal entry.</p>
            <p className="text-gray-500 mt-1">The audio will be transcribed and analyzed for sentiment.</p>
          </div>
        )}
      </div>

      {/* Debug Information */}
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-4 p-3 bg-gray-100 rounded-lg text-xs">
          <summary className="cursor-pointer font-medium text-gray-700">Debug Information</summary>
          <div className="mt-2 space-y-1 text-gray-600">
            <div><strong>Protocol:</strong> {debugInfo.protocol}</div>
            <div><strong>Secure Context:</strong> {debugInfo.isSecureContext ? 'Yes' : 'No'}</div>
            <div><strong>MediaRecorder:</strong> {debugInfo.mediaRecorderSupported ? 'Supported' : 'Not Supported'}</div>
            <div><strong>Supported MIME Types:</strong> {debugInfo.supportedMimeTypes?.join(', ') || 'None'}</div>
            <div><strong>Permission Status:</strong> {permissionGranted ? 'Granted' : 'Denied/Unknown'}</div>
          </div>
        </details>
      )}
    </div>
  )
}
