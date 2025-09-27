import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { journalText } = await request.json()

    if (!journalText) {
      return NextResponse.json(
        { error: 'Journal text is required' },
        { status: 400 }
      )
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_AZURE_AI_ENDPOINT}/text/analytics/v3.1/sentiment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': process.env.NEXT_PUBLIC_AZURE_AI_KEY,
      },
      body: JSON.stringify({
        documents: [{
          id: '1',
          text: journalText,
          language: 'en'
        }]
      })
    })

    if (!response.ok) {
      throw new Error(`Azure API error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data.documents[0])

  } catch (error) {
    console.error('Azure analysis failed:', error)
    
    // Fallback sentiment analysis when Azure fails
    const fallbackAnalysis = {
      sentiment: 'neutral',
      confidenceScores: {
        positive: 0.33,
        neutral: 0.34,
        negative: 0.33
      }
    }
    
    return NextResponse.json(fallbackAnalysis)
  }
}
