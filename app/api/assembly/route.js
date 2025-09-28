// In: app/api/ai/assembly/route.js

import { NextResponse } from 'next/server'
import axios from 'axios'

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// New helper function to normalize AssemblyAI sentiment into the Azure format
const normalizeSentiment = (assemblyResults) => {
  if (!assemblyResults || assemblyResults.length === 0) {
    return {
      sentiment: 'neutral',
      confidenceScores: { positive: 0.34, neutral: 0.33, negative: 0.33 }
    };
  }

  // Calculate average confidence scores
  const scoreSum = assemblyResults.reduce((acc, curr) => {
    acc.positive += curr.sentiment === 'POSITIVE' ? curr.confidence : 0;
    acc.negative += curr.sentiment === 'NEGATIVE' ? curr.confidence : 0;
    acc.neutral += curr.sentiment === 'NEUTRAL' ? curr.confidence : 0;
    return acc;
  }, { positive: 0, negative: 0, neutral: 0 });

  const total = assemblyResults.length;
  const confidenceScores = {
    positive: scoreSum.positive / total,
    negative: scoreSum.negative / total,
    neutral: scoreSum.neutral / total,
  };

  // Determine the overall sentiment
  let overallSentiment = 'neutral';
  if (confidenceScores.positive > confidenceScores.negative && confidenceScores.positive > confidenceScores.neutral) {
    overallSentiment = 'positive';
  } else if (confidenceScores.negative > confidenceScores.positive && confidenceScores.negative > confidenceScores.neutral) {
    overallSentiment = 'negative';
  }

  return {
    sentiment: overallSentiment,
    confidenceScores: confidenceScores
  };
};


export async function POST(request) {
  const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY;

  if (!ASSEMBLYAI_API_KEY) {
    console.error('Missing ASSEMBLYAI_API_KEY environment variable');
    return NextResponse.json({ error: 'AssemblyAI API key not configured.' }, { status: 500 });
  }

  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio');

    if (!audioFile) {
      return NextResponse.json({ error: 'Audio file is required' }, { status: 400 });
    }

    const audioBuffer = Buffer.from(await audioFile.arrayBuffer());

    const uploadResponse = await axios.post('https://api.assemblyai.com/v2/upload', audioBuffer, {
      headers: {
        'authorization': ASSEMBLYAI_API_KEY,
        'Content-Type': 'application/octet-stream',
      }
    });

    const upload_url = uploadResponse.data.upload_url;
    
    const submitResponse = await axios.post('https://api.assemblyai.com/v2/transcript', {
      audio_url: upload_url,
      sentiment_analysis: true
    }, {
      headers: {
        'authorization': ASSEMBLYAI_API_KEY,
        'content-type': 'application/json'
      }
    });

    const transcriptId = submitResponse.data.id;
    const pollEndpoint = `https://api.assemblyai.com/v2/transcript/${transcriptId}`;

    while (true) {
      const pollResult = await axios.get(pollEndpoint, {
        headers: { authorization: ASSEMBLYAI_API_KEY }
      });

      const { status, error, text, sentiment_analysis_results } = pollResult.data;

      if (status === 'completed') {
        // Normalize the sentiment before sending it back
        const azureCompatibleSentiment = normalizeSentiment(sentiment_analysis_results);
        
        return NextResponse.json({
          transcribedText: text,
          azureAnalysis: azureCompatibleSentiment, // Send in the expected format
        });
      } else if (status === 'error') {
        throw new Error(`Transcription failed: ${error}`);
      } else {
        await sleep(3000);
      }
    }
  } catch (error) {
    console.error('AssemblyAI processing failed:', error.message);
    return NextResponse.json(
      { error: `Speech processing failed: ${error.message}` },
      { status: 500 }
    );
  }
}