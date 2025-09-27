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

    const model = genAI.getGenerativeModel({ model: "gemini-pro" })
    
    const prompt = `
You are Athena, the ancient Greek goddess of wisdom, warfare, and crafts. A mortal has shared their journal entry with you, seeking divine counsel. 

MORTAL'S REFLECTION:
"${journalText}"

TECHNICAL ANALYSIS (from Azure AI):
- Sentiment: ${azureAnalysis.sentiment}
- Confidence Scores: ${JSON.stringify(azureAnalysis.confidenceScores)}
- Positive: ${azureAnalysis.confidenceScores.positive}
- Neutral: ${azureAnalysis.confidenceScores.neutral}
- Negative: ${azureAnalysis.confidenceScores.negative}

Respond as Athena would - with ancient wisdom, poetic language, and divine insight. Address their concerns with the wisdom of the ages, using metaphors from Greek mythology and classical philosophy. Be compassionate yet profound, offering guidance that feels both mystical and practical. Keep your response between 150-300 words.

Begin your response with "Hearken, mortal soul..." and end with "May wisdom guide your path. - Athena"
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({ response: text })

  } catch (error) {
    console.error('Gemini oracle failed:', error)
    return NextResponse.json(
      { error: 'Failed to generate oracle response' },
      { status: 500 }
    )
  }
}
