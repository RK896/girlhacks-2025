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

    // Convert File to ArrayBuffer
    const audioBuffer = await audioFile.arrayBuffer()
    
    // Check audio file size - if too small, it might not contain speech
    if (audioBuffer.byteLength < 1000) {
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
    
    console.log('Audio buffer size:', audioBuffer.byteLength, 'bytes')
    
    // Convert audio to base64 for Google Cloud Speech-to-Text
    const base64Audio = Buffer.from(audioBuffer).toString('base64')
    
    // Determine audio encoding based on file type
    let encoding = 'WEBM_OPUS'
    let sampleRateHertz = 48000 // Default to 48kHz for WebM
    
    if (audioFile.type.includes('wav')) {
      encoding = 'LINEAR16'
      sampleRateHertz = 16000 // WAV typically uses 16kHz
    } else if (audioFile.type.includes('mp4')) {
      encoding = 'MP4'
      sampleRateHertz = 48000 // MP4 typically uses 48kHz
    } else if (audioFile.type.includes('webm')) {
      encoding = 'WEBM_OPUS'
      sampleRateHertz = 48000 // WebM Opus typically uses 48kHz
    }
    
    console.log('Using audio encoding:', encoding)
    console.log('Using sample rate:', sampleRateHertz)
    
    // Google Cloud Speech-to-Text API request
    const speechRequest = {
      config: {
        encoding: encoding,
        sampleRateHertz: sampleRateHertz,
        languageCode: 'en-US',
        enableAutomaticPunctuation: true,
        model: 'latest_long'
      },
      audio: {
        content: base64Audio
      }
    }
    
    console.log('Calling Google Cloud Speech-to-Text API...')
    
    const speechResponse = await fetch(`https://speech.googleapis.com/v1/speech:recognize?key=${process.env.GOOGLE_CLOUD_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(speechRequest)
    })
    
    console.log('Google Speech API response status:', speechResponse.status)
    
    if (!speechResponse.ok) {
      const errorText = await speechResponse.text()
      console.error('Google Speech API error:', errorText)
      throw new Error(`Google Speech API error: ${speechResponse.status} - ${errorText}`)
    }
    
    const speechData = await speechResponse.json()
    console.log('Google Speech API response:', JSON.stringify(speechData, null, 2))
    
    // Extract transcribed text from Google's response
    const transcribedText = speechData.results?.[0]?.alternatives?.[0]?.transcript || ''
    const confidence = speechData.results?.[0]?.alternatives?.[0]?.confidence || 0
    
    console.log('Transcribed text:', transcribedText)
    console.log('Confidence:', confidence)
    
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
    if (!process.env.GOOGLE_CLOUD_API_KEY) {
      console.error('Missing Google Cloud API key')
      return NextResponse.json({
        error: 'Google Cloud Speech-to-Text not configured. Please check environment variables.',
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
