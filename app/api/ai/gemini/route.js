import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY)

export async function POST(request) {
  try {
    const { journalText, azureAnalysis } = await request.json()

    if (!journalText || !azureAnalysis) {
      return NextResponse.json(
        { error: 'Journal text and Azure analysis are required' },
        { status: 400 }
      )
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" })
    
    const prompt = `
You are Athena, the ancient Greek goddess of wisdom, warfare, and crafts. A mortal has shared their journal entry with you, seeking divine counsel. 

MORTAL'S REFLECTION:
"${journalText}"

DIVINE ANALYSIS (from Azure AI):
- Overall Sentiment: ${azureAnalysis.sentiment}
- Confidence in Positive emotions: ${Math.round(azureAnalysis.confidenceScores.positive * 100)}%
- Confidence in Neutral emotions: ${Math.round(azureAnalysis.confidenceScores.neutral * 100)}%
- Confidence in Negative emotions: ${Math.round(azureAnalysis.confidenceScores.negative * 100)}%

As Athena, respond with divine wisdom and ancient insight. Use the sentiment analysis to understand the mortal's emotional state and provide appropriate counsel. 

Guidelines:
- Use poetic, mystical language befitting a goddess
- Reference Greek mythology and classical philosophy
- Be compassionate yet profound
- Address their emotional state based on the sentiment analysis
- Offer practical wisdom wrapped in divine metaphor
- Keep response between 150-300 words
- Begin with "Hearken, mortal soul..." 
- End with "May wisdom guide your path. - Athena"

If the sentiment is positive, celebrate their joy and encourage continued growth. If negative, offer comfort and strength. If neutral, provide gentle guidance for deeper reflection.
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({ response: text })

  } catch (error) {
    console.error('Gemini oracle failed:', error)
    
    // Fallback response when AI fails
    const fallbackResponse = `Hearken, mortal soul, though the divine channels are clouded today, I sense the weight of your words. Your reflection speaks of deep contemplation, and I offer you this wisdom: in times of uncertainty, trust in your inner strength and seek guidance from within. The path forward may not always be clear, but your courage will light the way. May wisdom guide your path. - Athena`
    
    return NextResponse.json({ response: fallbackResponse })
  }
}
