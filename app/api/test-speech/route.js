import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check environment variables
    const hasEndpoint = !!process.env.AZURE_SPEECH_ENDPOINT
    const hasKey = !!process.env.AZURE_SPEECH_KEY
    const hasAzureAiEndpoint = !!process.env.NEXT_PUBLIC_AZURE_AI_ENDPOINT
    const hasAzureAiKey = !!process.env.NEXT_PUBLIC_AZURE_AI_KEY

    const config = {
      azureSpeech: {
        endpoint: hasEndpoint ? 'Set' : 'Missing',
        key: hasKey ? 'Set' : 'Missing'
      },
      azureAi: {
        endpoint: hasAzureAiEndpoint ? 'Set' : 'Missing',
        key: hasAzureAiKey ? 'Set' : 'Missing'
      }
    }

    // Test Azure Speech endpoint connectivity
    let speechTest = 'Not tested'
    if (hasEndpoint && hasKey) {
      try {
        // Extract region and construct the proper speech endpoint
        const region = process.env.AZURE_SPEECH_ENDPOINT.replace('https://', '').replace('.api.cognitive.microsoft.com', '')
        const testEndpoint = `https://${region}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US`
        console.log('Testing endpoint:', testEndpoint)
        
        // Try a simple GET request to check connectivity
        const testResponse = await fetch(testEndpoint, {
          method: 'GET',
          headers: {
            'Ocp-Apim-Subscription-Key': process.env.AZURE_SPEECH_KEY,
          }
        })
        speechTest = testResponse.ok ? 'Connected' : `Error: ${testResponse.status} - ${testResponse.statusText}`
      } catch (err) {
        speechTest = `Error: ${err.message}`
        console.error('Speech test error:', err)
      }
    }

    // Test Azure AI endpoint connectivity
    let aiTest = 'Not tested'
    if (hasAzureAiEndpoint && hasAzureAiKey) {
      try {
        const testResponse = await fetch(`${process.env.NEXT_PUBLIC_AZURE_AI_ENDPOINT}/text/analytics/v3.1/sentiment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': process.env.NEXT_PUBLIC_AZURE_AI_KEY,
          },
          body: JSON.stringify({
            documents: [{
              id: '1',
              text: 'test',
              language: 'en'
            }]
          })
        })
        aiTest = testResponse.ok ? 'Connected' : `Error: ${testResponse.status}`
      } catch (err) {
        aiTest = `Error: ${err.message}`
      }
    }

    return NextResponse.json({
      config,
      tests: {
        azureSpeech: speechTest,
        azureAi: aiTest
      },
      environment: process.env.NODE_ENV
    })

  } catch (error) {
    return NextResponse.json({
      error: error.message,
      config: {
        azureSpeech: {
          endpoint: process.env.AZURE_SPEECH_ENDPOINT ? 'Set' : 'Missing',
          key: process.env.AZURE_SPEECH_KEY ? 'Set' : 'Missing'
        },
        azureAi: {
          endpoint: process.env.NEXT_PUBLIC_AZURE_AI_ENDPOINT ? 'Set' : 'Missing',
          key: process.env.NEXT_PUBLIC_AZURE_AI_KEY ? 'Set' : 'Missing'
        }
      }
    }, { status: 500 })
  }
}
