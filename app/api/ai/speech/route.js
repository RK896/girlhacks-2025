import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio')
    
    if (!audioFile) {
      return NextResponse.json(
        { error: 'Audio file is required' },
        { status: 400 }
      )
    }

    console.log('Received audio file:', {
      name: audioFile.name,
      type: audioFile.type,
      size: audioFile.size
    })

    // Check audio file size - if too small, it might not contain speech
    if (audioFile.size < 1000) {
      console.log('Audio file too small, might not contain speech')
      return NextResponse.json({
        transcribedText: '',
        sentiment: {
          sentiment: 'neutral',
          confidenceScores: {
            positive: 0.33,
            neutral: 0.34,
            negative: 0.33
          }
        },
        message: 'Audio file too short. Please record for at least 2-3 seconds.'
      })
    }
    
    console.log('Audio file size:', audioFile.size, 'bytes')
    
    // Use OpenAI Whisper API for speech-to-text
    const whisperFormData = new FormData()
    whisperFormData.append('file', audioFile, 'audio.webm')
    whisperFormData.append('model', 'whisper-1')
    whisperFormData.append('language', 'en')
    
    console.log('Sending to OpenAI Whisper API...')
    
    const whisperResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: whisperFormData
    })
    
    console.log('Whisper API response status:', whisperResponse.status)
    
    if (!whisperResponse.ok) {
      const errorText = await whisperResponse.text()
      console.error('Whisper API error:', errorText)
      throw new Error(`Whisper API error: ${whisperResponse.status} - ${errorText}`)
    }
    
    const whisperData = await whisperResponse.json()
    console.log('Whisper API response:', whisperData)
    
    const transcribedText = whisperData.text || ''
    console.log('Transcribed text:', transcribedText)
    
    // If no text was transcribed, provide a helpful message
    if (!transcribedText || transcribedText.trim() === '') {
      console.log('No text was transcribed from the audio')
      return NextResponse.json({
        transcribedText: '',
        sentiment: {
          sentiment: 'neutral',
          confidenceScores: {
            positive: 0.33,
            neutral: 0.34,
            negative: 0.33
          }
        },
        message: 'No speech was detected. Please try speaking more clearly or closer to the microphone.'
      })
    }

    // Now analyze sentiment of the transcribed text
    const sentimentResponse = await fetch(`${process.env.NEXT_PUBLIC_AZURE_AI_ENDPOINT}/text/analytics/v3.1/sentiment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': process.env.NEXT_PUBLIC_AZURE_AI_KEY,
      },
      body: JSON.stringify({
        documents: [{
          id: '1',
          text: transcribedText,
          language: 'en'
        }]
      })
    })

    if (!sentimentResponse.ok) {
      throw new Error(`Sentiment API error: ${sentimentResponse.status}`)
    }

    const sentimentData = await sentimentResponse.json()
    
    return NextResponse.json({
      transcribedText,
      sentiment: sentimentData.documents[0]
    })

  } catch (error) {
    console.error('Speech-to-text analysis failed:', error)
    
    // Check if it's an environment variable issue
    if (!process.env.OPENAI_API_KEY) {
      console.error('Missing OpenAI API key')
      return NextResponse.json({
        error: 'OpenAI API key not configured. Please check environment variables.',
        transcribedText: '',
        sentiment: {
          sentiment: 'neutral',
          confidenceScores: {
            positive: 0.33,
            neutral: 0.34,
            negative: 0.33
          }
        }
      }, { status: 500 })
    }
    
    // Fallback response
    return NextResponse.json({
      error: `Speech processing failed: ${error.message}`,
      transcribedText: '',
      sentiment: {
        sentiment: 'neutral',
        confidenceScores: {
          positive: 0.33,
          neutral: 0.34,
          negative: 0.33
        }
      }
    }, { status: 500 })
  }
}
