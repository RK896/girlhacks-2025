import { GoogleGenerativeAI } from '@google/generative-ai';
import { AzureAnalysis } from '@/types';

export class GeminiAIService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private configured: boolean;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    this.configured = !!apiKey;

    if (this.configured) {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      });
    } else {
      console.warn('Gemini API key not configured, using mock responses');
    }
  }

  /**
   * Generate Athena's response based on journal entry and sentiment analysis
   */
  async generateAthenaResponse(
    journalText: string,
    azureAnalysis: AzureAnalysis
  ): Promise<string> {
    try {
      // If Gemini is not configured, use mock response
      if (!this.configured) {
        return this.getFallbackResponse(azureAnalysis.sentiment);
      }

      const systemPrompt = this.buildSystemPrompt();
      const userPrompt = this.buildUserPrompt(journalText, azureAnalysis);

      const prompt = `${systemPrompt}\n\n${userPrompt}`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Clean up the response
      return this.cleanResponse(text);

    } catch (error) {
      console.error('Gemini AI generation error:', error);
      
      // Return fallback response if Gemini fails
      return this.getFallbackResponse(azureAnalysis.sentiment);
    }
  }

  /**
   * Build the system prompt for Athena's persona
   */
  private buildSystemPrompt(): string {
    return `You are Athena, the Greek goddess of wisdom, courage, and strategic warfare. You serve as a wise, supportive journaling companion who helps people reflect deeply on their thoughts and experiences.

PERSONA TRAITS:
- Wise and insightful, like the goddess of wisdom
- Supportive but not overly coddling
- Asks thought-provoking questions that encourage deeper reflection
- Uses metaphors and wisdom from Greek mythology when appropriate
- Maintains a warm, encouraging tone
- Focuses on helping users understand themselves better

RESPONSE GUIDELINES:
- Keep responses between 1-3 sentences
- Ask one thoughtful follow-up question
- Use the sentiment analysis to tailor your approach
- For positive entries: celebrate and encourage deeper exploration
- For negative entries: be gentle but help them process and grow
- For neutral entries: help them find meaning or direction
- Use "I" when speaking as Athena
- Avoid being preachy or overly clinical

RESPONSE FORMAT:
- Start with a brief acknowledgment or insight
- Ask one open-ended question to encourage deeper reflection
- Keep it conversational and personal`;
  }

  /**
   * Build the user prompt with journal text and sentiment analysis
   */
  private buildUserPrompt(journalText: string, azureAnalysis: AzureAnalysis): string {
    const sentiment = azureAnalysis.sentiment;
    const confidence = Math.max(
      azureAnalysis.confidenceScores.positive,
      azureAnalysis.confidenceScores.negative,
      azureAnalysis.confidenceScores.neutral
    );

    let sentimentContext = '';
    if (sentiment === 'positive') {
      sentimentContext = 'The person seems to be feeling positive and optimistic.';
    } else if (sentiment === 'negative') {
      sentimentContext = 'The person seems to be going through a challenging time.';
    } else {
      sentimentContext = 'The person seems to be in a neutral or contemplative state.';
    }

    const keyPhrases = azureAnalysis.keyPhrases?.length > 0 
      ? `Key themes: ${azureAnalysis.keyPhrases.join(', ')}.`
      : '';

    return `JOURNAL ENTRY:
"${journalText}"

ANALYSIS:
${sentimentContext} ${keyPhrases} Confidence level: ${Math.round(confidence * 100)}%.

Please respond as Athena, acknowledging their entry and asking a thoughtful follow-up question to help them reflect deeper.`;
  }

  /**
   * Clean up the AI response
   */
  private cleanResponse(text: string): string {
    // Remove any unwanted prefixes or formatting
    let cleaned = text.trim();
    
    // Remove common AI response prefixes
    const prefixes = [
      'Athena:',
      'Response:',
      'Here\'s my response:',
      'I understand that',
      'Based on your entry,',
    ];
    
    for (const prefix of prefixes) {
      if (cleaned.startsWith(prefix)) {
        cleaned = cleaned.substring(prefix.length).trim();
      }
    }
    
    // Ensure it ends with a question mark or period
    if (!cleaned.endsWith('?') && !cleaned.endsWith('.')) {
      cleaned += '.';
    }
    
    return cleaned;
  }

  /**
   * Get a fallback response when AI generation fails
   */
  private getFallbackResponse(sentiment: 'positive' | 'negative' | 'neutral'): string {
    const responses = {
      positive: "I can sense the joy in your words. What made this moment particularly meaningful for you?",
      negative: "I hear the weight in your words. What would you like to explore about this experience?",
      neutral: "Thank you for sharing your thoughts with me. What aspect of this would you like to reflect on further?"
    };
    
    return responses[sentiment];
  }

  /**
   * Check if the service is properly configured
   */
  isConfigured(): boolean {
    return this.configured;
  }
}

// Export singleton instance
export const geminiAIService = new GeminiAIService();

