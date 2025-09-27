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

    // Demo mode - no AI required
    const demoResponses = [
      "Hearken, mortal soul, I sense the weight of your words upon the sacred altar. Your reflection speaks of deep contemplation, and I offer you this wisdom: in the silence between thoughts lies the greatest truth. Trust in your inner voice, for it carries the echoes of divine guidance. May wisdom guide your path. - Athena",
      
      "Hearken, mortal soul, your words resonate through the halls of Olympus like the gentle whisper of the wind. I perceive the journey you undertake, and I counsel you thus: every step forward, no matter how small, brings you closer to your destiny. Embrace the lessons that come with each dawn. May wisdom guide your path. - Athena",
      
      "Hearken, mortal soul, I feel the energy of your thoughts flowing through the divine realm. Your words carry the power of intention, and I offer you this guidance: like the olive tree that grows strong through storms, your resilience will see you through any challenge. Trust in your inner strength. May wisdom guide your path. - Athena"
    ]

    const randomResponse = demoResponses[Math.floor(Math.random() * demoResponses.length)]

    // Mock sentiment analysis
    const mockSentiment = {
      sentiment: 'positive',
      confidenceScores: {
        positive: 0.7,
        neutral: 0.2,
        negative: 0.1
      }
    }

    return NextResponse.json({
      azureAnalysis: mockSentiment,
      athenaResponse: randomResponse
    })

  } catch (error) {
    console.error('Demo mode failed:', error)
    return NextResponse.json(
      { error: 'Demo mode failed' },
      { status: 500 }
    )
  }
}
