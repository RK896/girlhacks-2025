import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const endpoint = process.env.AZURE_SPEECH_ENDPOINT
    const key = process.env.AZURE_SPEECH_KEY
    
    console.log('Testing with endpoint:', endpoint)
    console.log('Key length:', key ? key.length : 'Missing')
    
    // Try different endpoint formats
    const endpoints = [
      `${endpoint}/speech/recognition/conversation/cognitiveservices/v1?language=en-US`,
      `https://eastus2.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US`,
      `https://eastus2.api.cognitive.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US`
    ]
    
    const results = []
    
    for (const testEndpoint of endpoints) {
      try {
        console.log('Testing endpoint:', testEndpoint)
        const response = await fetch(testEndpoint, {
          method: 'GET',
          headers: {
            'Ocp-Apim-Subscription-Key': key,
          }
        })
        
        results.push({
          endpoint: testEndpoint,
          status: response.status,
          statusText: response.statusText,
          ok: response.ok
        })
        
        console.log(`Endpoint ${testEndpoint}: ${response.status} ${response.statusText}`)
      } catch (err) {
        results.push({
          endpoint: testEndpoint,
          error: err.message
        })
        console.log(`Endpoint ${testEndpoint}: Error - ${err.message}`)
      }
    }
    
    return NextResponse.json({
      originalEndpoint: endpoint,
      keyPresent: !!key,
      results
    })
    
  } catch (error) {
    return NextResponse.json({
      error: error.message,
      originalEndpoint: process.env.AZURE_SPEECH_ENDPOINT,
      keyPresent: !!process.env.AZURE_SPEECH_KEY
    }, { status: 500 })
  }
}

