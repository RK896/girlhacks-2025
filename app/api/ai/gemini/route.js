import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY)

export async function POST(request) {
  try {
    const { journalText, azureAnalysis, verbalAnalysis } = await request.json()

    if (!journalText || !azureAnalysis) {
      return NextResponse.json(
        { error: 'Journal text and Azure analysis are required' },
        { status: 400 }
      )
    }

    const verbalBlock = verbalAnalysis ? `
    VERBAL EMOTIONAL ANALYSIS (from voice):
    - Overall Sentiment: ${verbalAnalysis.sentiment}
    - Positive: ${Math.round((verbalAnalysis.confidenceScores?.positive || 0) * 100)}%
    - Neutral: ${Math.round((verbalAnalysis.confidenceScores?.neutral || 0) * 100)}%
    - Negative: ${Math.round((verbalAnalysis.confidenceScores?.negative || 0) * 100)}%
    Mention how the user sounds and include that in your response.
    ` : ''
    console.log('Verbal Block:', verbalBlock)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
    
    const prompt = `
You are Athena, the Greek goddess of wisdom, warfare, and crafts. A mortal has shared their journal entry with you, seeking guidance. 

MORTAL'S REFLECTION:
"${journalText}"

EMOTIONAL ANALYSIS (from Azure AI):
- Overall Sentiment: ${azureAnalysis.sentiment}
- Positive emotions: ${Math.round(azureAnalysis.confidenceScores.positive * 100)}%
- Neutral emotions: ${Math.round(azureAnalysis.confidenceScores.neutral * 100)}%
- Negative emotions: ${Math.round(azureAnalysis.confidenceScores.negative * 100)}%

${verbalBlock}

As Athena, provide specific, relevant advice based on their exact words and situation. Vary your response style and personality based on their emotional state and content.

RESPONSE STYLES (choose one that fits best):
1. WISE MENTOR: "Hearken, mortal soul..." - Gentle, philosophical guidance
2. WARRIOR GODDESS: "Listen well, brave one..." - Strong, empowering, action-oriented
3. CRAFTSPERSON: "I see your hands at work..." - Practical, skill-focused advice
4. ORACLE: "The threads of fate reveal..." - Mystical, prophetic insights
5. TEACHER: "Let me share with you..." - Educational, instructive tone
6. PROTECTOR: "Fear not, for I am with you..." - Comforting, protective guidance

Guidelines:
- Reference specific details from their journal entry
- Address their exact concerns or celebrate their specific achievements
- Vary your opening and closing based on the situation
- Use different metaphors and analogies (olive trees, weaving, battles, temples, etc.)
- Match your tone to their emotional state
- Provide actionable advice tailored to their situation
- Keep response between 40-60 words
- End with "May wisdom guide your path. - Athena" or similar

Focus on their specific situation and choose the most appropriate Athena personality for their needs.
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({ response: text })

  } catch (error) {
    console.error('Gemini oracle failed:', error)
    
    // Fallback response when AI fails
    // Create a more contextual fallback response with variety
    const getFallbackResponse = (text) => {
      const lowerText = text.toLowerCase()
      const responses = []
      
      if (lowerText.includes('work') || lowerText.includes('job')) {
        responses.push(
          `Listen well, brave one, I see you wrestling with the forge of your career. Like Hephaestus crafting his finest works, true mastery comes not from avoiding challenges, but from embracing them. Your hands are meant for great things. May wisdom guide your path. - Athena`,
          `I see your hands at work, mortal, shaping your destiny through labor. The craftsman's path is never easy, but each challenge hones your blade sharper. Remember: even the greatest temples were built stone by stone. May wisdom guide your path. - Athena`,
          `The threads of fate reveal your professional journey, and I see both struggle and triumph ahead. Like the weaver who creates beauty from chaos, you too can transform challenges into opportunities. May wisdom guide your path. - Athena`
        )
      } else if (lowerText.includes('relationship') || lowerText.includes('love')) {
        responses.push(
          `Fear not, for I am with you in matters of the heart. Love, like the olive tree, grows slowly but bears the sweetest fruit. Speak your truth with courage, listen with compassion. May wisdom guide your path. - Athena`,
          `Let me share with you the wisdom of the ages: relationships are like the intricate tapestries I weave - each thread matters, each color adds depth. Be patient with yourself and others. May wisdom guide your path. - Athena`,
          `Hearken, mortal soul, I feel the weight of your heart's desires. Like the warrior who protects what they love, guard your relationships with both strength and gentleness. May wisdom guide your path. - Athena`
        )
      } else if (lowerText.includes('anxiety') || lowerText.includes('worry')) {
        responses.push(
          `Listen well, brave one, for I have faced many battles and know the weight of worry. Like the warrior who prepares for battle, your anxiety is not weakness but preparation. Channel this energy into action. May wisdom guide your path. - Athena`,
          `The threads of fate show me your troubled mind, but I also see your inner strength. Like the olive tree that bends in the storm but never breaks, you too will weather this tempest. May wisdom guide your path. - Athena`,
          `I see your hands trembling with worry, but know this: courage is not the absence of fear, but action in spite of it. Like the craftsman who works through uncertainty, focus on the task before you. May wisdom guide your path. - Athena`
        )
      } else {
        responses.push(
          `Hearken, mortal soul, I sense the depth of your contemplation. Your words carry the weight of genuine reflection, and I am honored by your trust. In the quiet moments of self-examination, we often discover our greatest truths. May wisdom guide your path. - Athena`,
          `Listen well, seeker, for I hear the echoes of your thoughts. Like the weaver who creates beauty from simple threads, you too are crafting something meaningful from your experiences. May wisdom guide your path. - Athena`,
          `The threads of fate reveal a thoughtful soul before me. Like the olive tree that grows stronger with each season, your wisdom deepens with each reflection. May wisdom guide your path. - Athena`
        )
      }
      
      return responses[Math.floor(Math.random() * responses.length)]
    }
    
    const fallbackResponse = getFallbackResponse(journalText)
    
    return NextResponse.json({ response: fallbackResponse })
  }
}
