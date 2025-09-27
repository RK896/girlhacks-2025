import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { text } = await request.json()
    
    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }
    
    console.log('Testing sentiment analysis with text:', text)
    
    // Test sentiment analysis
    const sentimentResponse = await fetch(`${process.env.NEXT_PUBLIC_AZURE_AI_ENDPOINT}/text/analytics/v3.1/sentiment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': process.env.NEXT_PUBLIC_AZURE_AI_KEY,
      },
      body: JSON.stringify({
        documents: [{
          id: '1',
          text: text,
          language: 'en'
        }]
      })
    })

    if (!sentimentResponse.ok) {
      throw new Error(`Sentiment API error: ${sentimentResponse.status}`)
    }

    const sentimentData = await sentimentResponse.json()
    console.log('Sentiment analysis result:', sentimentData)

    return NextResponse.json({
      text,
      sentiment: sentimentData.documents[0]
    })

  } catch (error) {
    console.error('Sentiment test failed:', error)
    return NextResponse.json({
      error: `Sentiment test failed: ${error.message}`
    }, { status: 500 })
  }
}
