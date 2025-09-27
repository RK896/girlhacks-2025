// Real Azure AI integration using your endpoint
export interface AzureAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidenceScores: {
    positive: number;
    negative: number;
    neutral: number;
  };
  keyPhrases?: string[];
  entities?: AzureEntity[];
}

export interface AzureEntity {
  text: string;
  category: string;
  confidence: number;
}

export class AzureAIService {
  private configured: boolean;
  private endpoint: string;
  private apiKey: string;

  constructor() {
    this.endpoint = process.env.AZURE_AI_ENDPOINT || 'https://athena1.cognitiveservices.azure.com/';
    this.apiKey = process.env.AZURE_AI_KEY || '';
    this.configured = !!(this.apiKey && this.endpoint);
    
    console.log('🔧 Azure AI Service initialized:');
    console.log('  - Endpoint:', this.endpoint);
    console.log('  - API Key configured:', !!this.apiKey);
    console.log('  - Service ready:', this.configured);
  }

  /**
   * Analyze sentiment using Azure AI Language Service
   */
  async analyzeJournalEntry(text: string): Promise<AzureAnalysis> {
    try {
      if (!this.configured) {
        console.warn('Azure AI not configured, using mock analysis');
        return this.getMockAnalysis(text);
      }

      // Validate input
      if (!text || text.trim().length === 0) {
        throw new Error('Journal text cannot be empty');
      }

      if (text.length > 5000) {
        throw new Error('Journal text is too long (max 5000 characters)');
      }

      // Prepare the request
      const documents = [{
        id: '1',
        text: text,
        language: 'en'
      }];

      // Call Azure AI Language Service for sentiment analysis
      const sentimentResponse = await this.callAzureAPI('/text/analytics/v3.1/sentiment', {
        documents: documents
      });

      // Call Azure AI Language Service for key phrases
      const keyPhrasesResponse = await this.callAzureAPI('/text/analytics/v3.1/keyPhrases', {
        documents: documents
      });

      // Process sentiment results
      const sentiment = sentimentResponse.documents[0];
      if (!sentiment) {
        throw new Error('No sentiment analysis results returned');
      }

      // Process key phrases
      const keyPhrases = keyPhrasesResponse.documents[0]?.keyPhrases || [];

      // Determine overall sentiment
      const confidenceScores = sentiment.confidenceScores;
      let overallSentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
      
      if (confidenceScores.positive > confidenceScores.negative && confidenceScores.positive > confidenceScores.neutral) {
        overallSentiment = 'positive';
      } else if (confidenceScores.negative > confidenceScores.positive && confidenceScores.negative > confidenceScores.neutral) {
        overallSentiment = 'negative';
      }

      return {
        sentiment: overallSentiment,
        confidenceScores: {
          positive: confidenceScores.positive,
          negative: confidenceScores.negative,
          neutral: confidenceScores.neutral,
        },
        keyPhrases,
        entities: [],
      };

    } catch (error) {
      console.error('Azure AI analysis error:', error);
      
      // Return fallback analysis if Azure AI fails
      return this.getMockAnalysis(text);
    }
  }

  /**
   * Make API call to Azure AI Language Service
   */
  private async callAzureAPI(path: string, body: any): Promise<any> {
    const url = `${this.endpoint.replace(/\/$/, '')}${path}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': this.apiKey,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Azure AI API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Get mock analysis as fallback
   */
  private getMockAnalysis(text: string): AzureAnalysis {
    // Simple keyword-based sentiment analysis
    const positiveWords = ['happy', 'great', 'excited', 'wonderful', 'amazing', 'love', 'good', 'excellent', 'fantastic', 'joy', 'smile', 'success', 'proud', 'accomplished'];
    const negativeWords = ['sad', 'terrible', 'awful', 'hate', 'bad', 'horrible', 'depressed', 'angry', 'frustrated', 'stressed', 'worried', 'anxious', 'disappointed', 'upset'];
    
    const lowerText = text.toLowerCase();
    let positiveScore = 0;
    let negativeScore = 0;
    
    positiveWords.forEach(word => {
      if (lowerText.includes(word)) positiveScore += 1;
    });
    
    negativeWords.forEach(word => {
      if (lowerText.includes(word)) negativeScore += 1;
    });
    
    // Calculate sentiment
    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
    let confidenceScores = { positive: 0.33, negative: 0.33, neutral: 0.34 };
    
    if (positiveScore > negativeScore && positiveScore > 0) {
      sentiment = 'positive';
      const total = positiveScore + negativeScore;
      confidenceScores = {
        positive: Math.min(0.9, 0.5 + (positiveScore / total) * 0.4),
        negative: Math.max(0.05, 0.5 - (positiveScore / total) * 0.4),
        neutral: 0.1
      };
    } else if (negativeScore > positiveScore && negativeScore > 0) {
      sentiment = 'negative';
      const total = positiveScore + negativeScore;
      confidenceScores = {
        positive: Math.max(0.05, 0.5 - (negativeScore / total) * 0.4),
        negative: Math.min(0.9, 0.5 + (negativeScore / total) * 0.4),
        neutral: 0.1
      };
    }

    // Extract simple key phrases (mock)
    const words = text.split(' ').filter(word => word.length > 4);
    const keyPhrases = words.slice(0, 3);

    return {
      sentiment,
      confidenceScores,
      keyPhrases,
      entities: [],
    };
  }

  /**
   * Get a simple sentiment score for quick analysis
   */
  async getQuickSentiment(text: string): Promise<'positive' | 'negative' | 'neutral'> {
    try {
      const analysis = await this.analyzeJournalEntry(text);
      return analysis.sentiment;
    } catch (error) {
      console.error('Quick sentiment analysis error:', error);
      return 'neutral';
    }
  }

  /**
   * Check if the service is properly configured
   */
  isConfigured(): boolean {
    return this.configured;
  }
}

// Export singleton instance
export const azureAIService = new AzureAIService();
