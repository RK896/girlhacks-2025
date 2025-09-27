import { NextRequest, NextResponse } from 'next/server';
import { azureAIService } from '@/lib/azure-ai-real';

// GET /api/test-azure - Test Azure AI endpoint
export async function GET(request: NextRequest) {
  try {
    const testText = "I feel amazing today! This is a test of the Azure AI service.";
    
    console.log('🧪 Testing Azure AI with text:', testText);
    console.log('🔧 Azure endpoint:', process.env.AZURE_AI_ENDPOINT);
    console.log('🔑 API key configured:', !!process.env.AZURE_AI_KEY);
    
    const analysis = await azureAIService.analyzeJournalEntry(testText);
    
    return NextResponse.json({
      success: true,
      message: 'Azure AI test completed',
      testText,
      analysis,
      endpoint: process.env.AZURE_AI_ENDPOINT,
      configured: azureAIService.isConfigured(),
    });

  } catch (error) {
    console.error('Azure AI test error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        endpoint: process.env.AZURE_AI_ENDPOINT,
        configured: azureAIService.isConfigured(),
      },
      { status: 500 }
    );
  }
}

