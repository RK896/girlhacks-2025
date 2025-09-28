'use client'

import { useEffect, useRef } from 'react'

// Invisible component that mirrors recording state and captures raw audio with MediaRecorder.
// On stop, it posts the blob to /api/assembly, logs the sentiment, and forwards
// transcribedText/sentiment via provided callbacks. No UI rendered.
export default function AssemblyAudioTap({ isRecording, onTranscription, onSentiment }) {
  const mediaRecorderRef = useRef(null)
  const mediaStreamRef = useRef(null)
  const chunksRef = useRef([])
  const mimeTypeRef = useRef('audio/webm')

  useEffect(() => {
    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        mediaStreamRef.current = stream
        const preferred = 'audio/webm; codecs=opus'
        const mimeType = (window.MediaRecorder && MediaRecorder.isTypeSupported(preferred)) ? preferred : 'audio/webm'
        mimeTypeRef.current = mimeType
        const mr = new MediaRecorder(stream, { mimeType })
        chunksRef.current = []
        mr.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) chunksRef.current.push(e.data)
        }
        mr.onstop = async () => {
          try {
            const blob = new Blob(chunksRef.current, { type: mimeTypeRef.current })
            await sendToAssembly(blob)
          } catch (e) {
            console.error('AssemblyAudioTap: failed to process blob', e)
          } finally {
            try { mediaStreamRef.current?.getTracks().forEach(t => t.stop()) } catch {}
            mediaStreamRef.current = null
            mediaRecorderRef.current = null
            chunksRef.current = []
          }
        }
        mediaRecorderRef.current = mr
        mr.start()
      } catch (err) {
        console.error('AssemblyAudioTap: getUserMedia failed', err)
      }
    }

    const stop = () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop()
      }
    }

    if (isRecording) start()
    else stop()

    return () => {
      // Cleanup if unmounted while recording
      try {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop()
        }
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach(t => t.stop())
        }
      } catch {}
    }
  }, [isRecording])

  const sendToAssembly = async (audioBlob) => {
    try {
      const ext = ((audioBlob.type || 'audio/webm').split('/')[1]) || 'webm'
      const form = new FormData()
      form.append('audio', audioBlob, `recording.${ext}`)
      const resp = await fetch('/api/assembly', { method: 'POST', body: form })
      if (!resp.ok) {
        const t = await resp.text()
        throw new Error(`Assembly API error: ${resp.status} - ${t}`)
      }
      const data = await resp.json()
      const sentiment = data?.azureAnalysis || data?.sentiment
      console.log('Final sentiment from audio:', sentiment)
      if (typeof onTranscription === 'function' && data?.transcribedText) onTranscription(data.transcribedText)
      if (typeof onSentiment === 'function' && sentiment) onSentiment(sentiment)
    } catch (err) {
      console.error('AssemblyAudioTap: sendToAssembly failed', err)
    }
  }

  return null
}
