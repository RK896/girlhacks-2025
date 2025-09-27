import { NextResponse } from 'next/server'
import connectDB from '../../../../lib/mongodb'
import JournalEntry from '../../../../models/JournalEntry'
import User from '../../../../models/User'
import jwt from 'jsonwebtoken'

// In-memory storage for demo mode
let demoEntries = []

// Get all journal entries for a user
export async function GET(request) {
  try {
    // Check for authentication token
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Verify token and get user ID
    const jwt = require('jsonwebtoken')
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const userId = decoded.userId

    try {
      await connectDB()
      
      const entries = await JournalEntry.find({ userId: userId })
        .sort({ createdAt: -1 })
        .limit(50) // Limit to last 50 entries

      return NextResponse.json({ entries })
    } catch (dbError) {
      console.log('Database not available, using in-memory storage:', dbError)
      // Return in-memory entries if database fails
      return NextResponse.json({ entries: demoEntries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) })
    }

  } catch (error) {
    console.error('Get entries error:', error)
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to fetch entries' },
      { status: 500 }
    )
  }
}

// Create a new journal entry
export async function POST(request) {
  try {
    // Check for authentication token
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Verify token and get user ID
    const jwt = require('jsonwebtoken')
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const userId = decoded.userId

    const { journalText, azureAnalysis, athenaResponse } = await request.json()

    if (!journalText || !azureAnalysis || !athenaResponse) {
      return NextResponse.json(
        { error: 'Journal text, Azure analysis, and Athena response are required' },
        { status: 400 }
      )
    }

    try {
      await connectDB()
      
      const entry = new JournalEntry({
        userId: userId,
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
    } catch (dbError) {
      console.log('Database not available, using in-memory storage:', dbError)
      // Store in memory when database fails
      const entry = {
        id: 'demo-' + Date.now(),
        journalText,
        azureAnalysis,
        athenaResponse,
        createdAt: new Date()
      }
      
      demoEntries.push(entry)
      
      return NextResponse.json({
        message: 'Journal entry processed successfully (demo mode)',
        entry
      })
    }

  } catch (error) {
    console.error('Create entry error:', error)
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create entry' },
      { status: 500 }
    )
  }
}
