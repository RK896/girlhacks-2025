import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const config = {
      googleCloud: {
        key: process.env.GOOGLE_CLOUD_API_KEY ? 'Set' : 'Missing'
      },
      azureAi: {
        endpoint: process.env.NEXT_PUBLIC_AZURE_AI_ENDPOINT ? 'Set' : 'Missing',
        key: process.env.NEXT_PUBLIC_AZURE_AI_KEY ? 'Set' : 'Missing'
      }
    }

    // Test Google Cloud Speech-to-Text API connectivity
    let speechTest = 'Not tested'
    if (process.env.GOOGLE_CLOUD_API_KEY) {
      try {
        // Test with a simple request to check API key validity
        const testResponse = await fetch(`https://speech.googleapis.com/v1/speech:recognize?key=${process.env.GOOGLE_CLOUD_API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            config: {
              encoding: 'WEBM_OPUS',
              sampleRateHertz: 16000,
              languageCode: 'en-US'
            },
            audio: {
              content: 'dGVzdA==' // base64 for "test"
            }
          })
        })
        
        if (testResponse.status === 400) {
          // 400 is expected for invalid audio, but means API key is valid
          speechTest = 'Connected (API key valid)'
        } else if (testResponse.status === 403) {
          speechTest = 'Error: API key invalid or quota exceeded'
        } else {
          speechTest = `Response: ${testResponse.status} - ${testResponse.statusText}`
        }
      } catch (err) {
        speechTest = `Error: ${err.message}`
      }
    }

    return NextResponse.json({
      config,
      tests: {
        googleSpeech: speechTest
      },
      environment: process.env.NODE_ENV
    })
  } catch (error) {
    return NextResponse.json({
      error: error.message,
      config: {
        googleCloud: {
          key: process.env.GOOGLE_CLOUD_API_KEY ? 'Set' : 'Missing'
        }
      }
    }, { status: 500 })
  }
}
