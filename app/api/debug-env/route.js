import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    azureSpeechEndpoint: process.env.AZURE_SPEECH_ENDPOINT ? 'Set' : 'Missing',
    azureSpeechKey: process.env.AZURE_SPEECH_KEY ? 'Set' : 'Missing',
    nodeEnv: process.env.NODE_ENV,
    allEnvKeys: Object.keys(process.env).filter(key => key.includes('AZURE'))
  })
}
