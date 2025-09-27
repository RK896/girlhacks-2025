import { NextRequest, NextResponse } from 'next/server';
import { JournalService } from '@/lib/database-mock';
import { azureAIService } from '@/lib/azure-ai-real';
import { geminiAIService } from '@/lib/gemini-ai';
import { CreateJournalEntryRequest, CreateJournalEntryResponse, GetJournalEntriesRequest, GetJournalEntriesResponse } from '@/types';

// POST /api/journal/entries - Create a new journal entry
export async function POST(request: NextRequest): Promise<NextResponse<CreateJournalEntryResponse>> {
  try {
    const body: CreateJournalEntryRequest = await request.json();
    const { journalText, userId } = body;

    // Validate input
    if (!journalText || !userId) {
      return NextResponse.json(
        { success: false, error: 'Journal text and user ID are required' },
        { status: 400 }
      );
    }

    if (journalText.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Journal text cannot be empty' },
        { status: 400 }
      );
    }

    if (journalText.length > 5000) {
      return NextResponse.json(
        { success: false, error: 'Journal text is too long (max 5000 characters)' },
        { status: 400 }
      );
    }

    // Step 1: Analyze sentiment with Azure AI
    console.log('Analyzing sentiment with Azure AI...');
    const azureAnalysis = await azureAIService.analyzeJournalEntry(journalText);
    console.log('Azure analysis completed:', azureAnalysis);

    // Step 2: Generate Athena's response with Gemini
    console.log('Generating Athena response with Gemini...');
    const athenaResponse = await geminiAIService.generateAthenaResponse(journalText, azureAnalysis);
    console.log('Athena response generated:', athenaResponse);

    // Step 3: Save to database
    console.log('Saving journal entry to database...');
    const entry = await JournalService.createEntry(
      userId,
      journalText,
      azureAnalysis,
      athenaResponse
    );
    console.log('Journal entry saved successfully');

    return NextResponse.json({
      success: true,
      entry,
    });

  } catch (error) {
    console.error('Error creating journal entry:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

// GET /api/journal/entries - Get journal entries for a user
export async function GET(request: NextRequest): Promise<NextResponse<GetJournalEntriesResponse>> {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Validate limit
    if (limit < 1 || limit > 100) {
      return NextResponse.json(
        { success: false, error: 'Limit must be between 1 and 100' },
        { status: 400 }
      );
    }

    const entries = await JournalService.getEntries(userId, limit);

    return NextResponse.json({
      success: true,
      entries,
    });

  } catch (error) {
    console.error('Error fetching journal entries:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

