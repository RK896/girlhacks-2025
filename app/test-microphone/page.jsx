'use client'

import { useState, useEffect } from 'react'

export default function TestMicrophone() {
  const [status, setStatus] = useState('Checking...')
  const [debugInfo, setDebugInfo] = useState({})
  const [stream, setStream] = useState(null)

  useEffect(() => {
    checkMicrophoneAccess()
  }, [])

  const checkMicrophoneAccess = async () => {
    const info = {
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
      info.supportedMimeTypes = types.filter(type => MediaRecorder.isTypeSupported(type))
    }

    setDebugInfo(info)

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setStatus('❌ getUserMedia not supported')
        return
      }

      if (!window.isSecureContext) {
        setStatus('❌ Not secure context - HTTPS required')
        return
      }

      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setStream(audioStream)
      setStatus('✅ Microphone access successful!')
      
      // Test MediaRecorder
      try {
        const recorder = new MediaRecorder(audioStream)
        setStatus(prev => prev + ' ✅ MediaRecorder works!')
      } catch (recorderError) {
        setStatus(prev => prev + ' ❌ MediaRecorder failed: ' + recorderError.message)
      }

    } catch (error) {
      setStatus('❌ Microphone access failed: ' + error.message)
    }
  }

  const cleanup = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
  }

  useEffect(() => {
    return cleanup
  }, [stream])

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Microphone Test Page</h1>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Status:</h2>
          <div className="p-3 bg-gray-100 rounded">
            <pre className="whitespace-pre-wrap">{status}</pre>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Debug Information:</h2>
          <div className="p-3 bg-gray-100 rounded text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div><strong>Protocol:</strong> {debugInfo.protocol}</div>
              <div><strong>Secure Context:</strong> {debugInfo.isSecureContext ? 'Yes' : 'No'}</div>
              <div><strong>MediaDevices:</strong> {debugInfo.mediaDevicesSupported ? 'Supported' : 'Not Supported'}</div>
              <div><strong>getUserMedia:</strong> {debugInfo.getUserMediaSupported ? 'Supported' : 'Not Supported'}</div>
              <div><strong>MediaRecorder:</strong> {debugInfo.mediaRecorderSupported ? 'Supported' : 'Not Supported'}</div>
              <div><strong>Supported MIME Types:</strong> {debugInfo.supportedMimeTypes?.join(', ') || 'None'}</div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Troubleshooting Steps:</h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-start">
              <span className="text-red-500 mr-2">1.</span>
              <span>Check if you're using HTTPS (not HTTP)</span>
            </div>
            <div className="flex items-start">
              <span className="text-red-500 mr-2">2.</span>
              <span>Look for microphone icon in browser address bar and click "Allow"</span>
            </div>
            <div className="flex items-start">
              <span className="text-red-500 mr-2">3.</span>
              <span>Try refreshing the page after granting permission</span>
            </div>
            <div className="flex items-start">
              <span className="text-red-500 mr-2">4.</span>
              <span>Close other applications that might be using the microphone</span>
            </div>
            <div className="flex items-start">
              <span className="text-red-500 mr-2">5.</span>
              <span>Try a different browser (Chrome recommended)</span>
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={checkMicrophoneAccess}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Test Again
          </button>
          <button
            onClick={cleanup}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Stop Microphone
          </button>
        </div>

        {stream && (
          <div className="mt-4 p-3 bg-green-100 text-green-800 rounded">
            ✅ Microphone is currently active. You should see a microphone indicator in your browser.
          </div>
        )}
      </div>
    </div>
  )
}
