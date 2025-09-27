import { NextRequest, NextResponse } from 'next/server';
import { azureAIService } from '@/lib/azure-ai-real';
import { geminiAIService } from '@/lib/gemini-ai';

// GET /api/health - Health check endpoint
export async function GET(request: NextRequest) {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        azureAI: {
          configured: azureAIService.isConfigured(),
          status: azureAIService.isConfigured() ? 'ready' : 'not_configured',
          endpoint: process.env.AZURE_AI_ENDPOINT || 'https://athena1.cognitiveservices.azure.com/'
        },
        geminiAI: {
          configured: geminiAIService.isConfigured(),
          status: geminiAIService.isConfigured() ? 'ready' : 'mock_mode'
        },
        database: {
          status: 'ready' // MongoDB is always ready if configured
        }
      }
    };

    // Check if critical services are configured (Gemini is optional)
    const allServicesReady = health.services.azureAI.configured;

    return NextResponse.json(health, { 
      status: allServicesReady ? 200 : 503 
    });

  } catch (error) {
    console.error('Health check error:', error);
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

