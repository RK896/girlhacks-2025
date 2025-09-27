import { NextResponse } from 'next/server'
import connectDB from '../../../../lib/mongodb'
import JournalEntry from '../../../../models/JournalEntry'
import User from '../../../../models/User'
import jwt from 'jsonwebtoken'

// Get all journal entries for a user
export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    await connectDB()
    
    const entries = await JournalEntry.find({ userId: decoded.userId })
      .sort({ createdAt: -1 })
      .limit(50) // Limit to last 50 entries

    return NextResponse.json({ entries })

  } catch (error) {
    console.error('Get entries error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch entries' },
      { status: 500 }
    )
  }
}

// Create a new journal entry
export async function POST(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const { journalText, azureAnalysis, athenaResponse } = await request.json()

    if (!journalText || !azureAnalysis || !athenaResponse) {
      return NextResponse.json(
        { error: 'Journal text, Azure analysis, and Athena response are required' },
        { status: 400 }
      )
    }

    await connectDB()
    
    const entry = new JournalEntry({
      userId: decoded.userId,
      journalText,
      azureAnalysis,
      athenaResponse
    })

    await entry.save()

    return NextResponse.json({
      message: 'Journal entry created successfully',
      entry: {
        id: entry._id,
        journalText: entry.journalText,
        azureAnalysis: entry.azureAnalysis,
        athenaResponse: entry.athenaResponse,
        createdAt: entry.createdAt
      }
    })

  } catch (error) {
    console.error('Create entry error:', error)
    return NextResponse.json(
      { error: 'Failed to create entry' },
      { status: 500 }
    )
  }
}
