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

    // Demo mode - no AI required, but try to be more contextual with varied Athena personalities
    const getContextualResponse = (journalText) => {
      const text = journalText.toLowerCase()
      
      // Array of different Athena response styles for each theme
      const workResponses = [
        "Listen well, brave one, I see you wrestling with the forge of your career. Like Hephaestus crafting his finest works, true mastery comes not from avoiding challenges, but from embracing them. Your hands are meant for great things - trust the process and let your skills speak through your work. May wisdom guide your path. - Athena",
        "I see your hands at work, mortal, shaping your destiny through labor. The craftsman's path is never easy, but each challenge hones your blade sharper. Remember: even the greatest temples were built stone by stone. Your dedication will carve your name in the annals of excellence. May wisdom guide your path. - Athena",
        "The threads of fate reveal your professional journey, and I see both struggle and triumph ahead. Like the weaver who creates beauty from chaos, you too can transform challenges into opportunities. Trust in your abilities and let your work be your testament. May wisdom guide your path. - Athena"
      ]
      
      const relationshipResponses = [
        "Fear not, for I am with you in matters of the heart. Love, like the olive tree, grows slowly but bears the sweetest fruit. Speak your truth with courage, listen with compassion, and remember that the strongest bonds are forged through understanding and patience. May wisdom guide your path. - Athena",
        "Let me share with you the wisdom of the ages: relationships are like the intricate tapestries I weave - each thread matters, each color adds depth. Be patient with yourself and others, for true connection blooms in the garden of mutual respect. May wisdom guide your path. - Athena",
        "Hearken, mortal soul, I feel the weight of your heart's desires. Like the warrior who protects what they love, guard your relationships with both strength and gentleness. True love requires both courage and vulnerability - give both freely. May wisdom guide your path. - Athena"
      ]
      
      const anxietyResponses = [
        "Listen well, brave one, for I have faced many battles and know the weight of worry. Like the warrior who prepares for battle, your anxiety is not weakness but preparation. Channel this energy into action - focus on what you can control and let go of what you cannot. May wisdom guide your path. - Athena",
        "The threads of fate show me your troubled mind, but I also see your inner strength. Like the olive tree that bends in the storm but never breaks, you too will weather this tempest. Take one step at a time, and remember: even the darkest night gives way to dawn. May wisdom guide your path. - Athena",
        "I see your hands trembling with worry, but know this: courage is not the absence of fear, but action in spite of it. Like the craftsman who works through uncertainty, focus on the task before you. Breathe deeply, center yourself, and trust in your inner wisdom. May wisdom guide your path. - Athena"
      ]
      
      const decisionResponses = [
        "The threads of fate reveal a crossroads before you, mortal. Like the oracle who reads the signs, trust your inner wisdom. Consider not just what you want, but who you wish to become. The right path will align with your deepest values and lead to your highest good. May wisdom guide your path. - Athena",
        "Listen well, brave one, for I have guided many through difficult choices. Like the warrior who must choose their battles, weigh your options carefully but do not let fear paralyze you. Sometimes the greatest wisdom is knowing when to act and when to wait. May wisdom guide your path. - Athena",
        "Let me share with you the wisdom of choice: every decision is a thread in the tapestry of your life. Consider the consequences, trust your intuition, and remember that even wrong choices can lead to valuable lessons. Choose with courage and learn with grace. May wisdom guide your path. - Athena"
      ]
      
      const successResponses = [
        "Hearken, mortal soul, I celebrate your victories with great joy! Like the athlete who wins the olive wreath, you have earned this triumph through dedication and hard work. Savor this moment, but let it fuel your hunger for even greater achievements. May wisdom guide your path. - Athena",
        "Listen well, champion, for your success echoes through the halls of Olympus! Like the craftsman who creates a masterpiece, you have proven your worth through skill and perseverance. Use this victory as a foundation for even greater works ahead. May wisdom guide your path. - Athena",
        "The threads of fate show me your glorious achievement, and I am proud! Like the warrior who returns victorious from battle, you have proven your mettle. Remember this moment when challenges arise, for you have shown what you are capable of. May wisdom guide your path. - Athena"
      ]
      
      const generalResponses = [
        "Hearken, mortal soul, I sense the depth of your contemplation. Your words carry the weight of genuine reflection, and I am honored by your trust. In the quiet moments of self-examination, we often discover our greatest truths. Continue this sacred practice of inner wisdom. May wisdom guide your path. - Athena",
        "Listen well, seeker, for I hear the echoes of your thoughts. Like the weaver who creates beauty from simple threads, you too are crafting something meaningful from your experiences. Trust in your process and know that every reflection brings you closer to understanding. May wisdom guide your path. - Athena",
        "The threads of fate reveal a thoughtful soul before me. Like the olive tree that grows stronger with each season, your wisdom deepens with each reflection. Continue to nurture this sacred practice of self-discovery, for it is the path to true enlightenment. May wisdom guide your path. - Athena"
      ]
      
      // Check for specific themes and provide varied responses
      if (text.includes('work') || text.includes('job') || text.includes('career')) {
        return workResponses[Math.floor(Math.random() * workResponses.length)]
      }
      
      if (text.includes('relationship') || text.includes('love') || text.includes('partner') || text.includes('friend')) {
        return relationshipResponses[Math.floor(Math.random() * relationshipResponses.length)]
      }
      
      if (text.includes('anxiety') || text.includes('worry') || text.includes('stress') || text.includes('fear')) {
        return anxietyResponses[Math.floor(Math.random() * anxietyResponses.length)]
      }
      
      if (text.includes('decision') || text.includes('choose') || text.includes('option') || text.includes('path')) {
        return decisionResponses[Math.floor(Math.random() * decisionResponses.length)]
      }
      
      if (text.includes('success') || text.includes('achievement') || text.includes('accomplish') || text.includes('proud')) {
        return successResponses[Math.floor(Math.random() * successResponses.length)]
      }
      
      // Default response for general reflection
      return generalResponses[Math.floor(Math.random() * generalResponses.length)]
    }

    const athenaResponse = getContextualResponse(journalText)

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
