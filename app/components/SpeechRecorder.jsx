// In: app/components/SpeechRecorder.jsx

'use client'

import React, { useState, useRef, useEffect } from 'react'

export default function SpeechRecorder({ onTranscription, disabled = false }) {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [audioBlob, setAudioBlob] = useState(null)
  const [audioUrl, setAudioUrl] = useState(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [error, setError] = useState(null)

  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const timerRef = useRef(null)

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl)
    }
  }, [audioUrl])

  const startRecording = async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' })
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        stream.getTracks().forEach((t) => t.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)
      timerRef.current = setInterval(() => setRecordingTime((p) => p + 1), 1000)
    } catch (err) {
      console.error('Error starting recording:', err)
      setError('Unable to access microphone. Please check your permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const sendAudioForTranscription = async () => {
    if (!audioBlob) return
    setIsProcessing(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.webm')

      // This fetch call points to your AssemblyAI backend route
      const response = await fetch('/api/ai/assembly', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      if (response.ok) {
        if (typeof onTranscription === 'function' && data.transcribedText) {
          onTranscription(data)
        }
        setAudioBlob(null)
        if (audioUrl) URL.revokeObjectURL(audioUrl)
        setAudioUrl(null)
        setRecordingTime(0)
      } else {
        throw new Error(data.error || 'Transcription failed')
      }
    } catch (err) {
      console.error('Transcription error:', err)
      setError(err?.message || 'Failed to transcribe audio')
    } finally {
      setIsProcessing(false)
    }
  }

  const clearRecording = () => {
    setAudioBlob(null)
    if (audioUrl) URL.revokeObjectURL(audioUrl)
    setAudioUrl(null)
    setRecordingTime(0)
    setError(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {!isRecording && !audioBlob && (
          <button
            onClick={startRecording}
            disabled={disabled || isProcessing}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            🎤 Start Recording
          </button>
        )}

        {isRecording && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-red-600">
                Recording: {formatTime(recordingTime)}
              </span>
            </div>
            <button
              onClick={stopRecording}
              className="px-3 py-2 rounded bg-red-600 text-white"
            >
              ■ Stop
            </button>
          </div>
        )}

        {audioBlob && !isRecording && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Recording ready ({formatTime(recordingTime)})</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={sendAudioForTranscription}
                disabled={isProcessing}
                className="px-3 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
              >
                {isProcessing ? 'Transcribing...' : 'Transcribe'}
              </button>
              <button
                onClick={clearRecording}
                className="px-3 py-2 rounded border"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {audioUrl && (
        <div className="bg-gray-100 p-3 rounded-lg">
          <p className="text-sm font-medium text-gray-600 mb-2">Audio Preview:</p>
          <audio controls className="w-full">
            <source src={audioUrl} type="audio/webm" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="text-xs text-gray-500">
        <p>🎤 Click "Start Recording" to begin, then "Stop" when finished. Click "Transcribe" to convert your speech to text.</p>
      </div>
    </div>
  )
}