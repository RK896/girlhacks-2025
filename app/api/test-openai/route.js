import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const config = {
      openai: {
        key: process.env.OPENAI_API_KEY ? 'Set' : 'Missing'
      },
      environment: process.env.NODE_ENV
    }

    // Test OpenAI API connectivity
    let testResult = 'Not tested'
    if (process.env.OPENAI_API_KEY) {
      try {
        const response = await fetch('https://api.openai.com/v1/models', {
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          }
        })
        
        if (response.ok) {
          testResult = 'Connected'
        } else {
          testResult = `Error: ${response.status} - ${response.statusText}`
        }
      } catch (error) {
        testResult = `Error: ${error.message}`
      }
    }

    return NextResponse.json({
      config,
      tests: {
        openai: testResult
      },
      environment: process.env.NODE_ENV
    })
  } catch (error) {
    return NextResponse.json({
      error: error.message,
      config: {
        openai: {
          key: process.env.OPENAI_API_KEY ? 'Set' : 'Missing'
        }
      }
    }, { status: 500 })
  }
}
