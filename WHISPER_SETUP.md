# OpenAI Whisper Speech-to-Text Setup

## Overview
The application now uses OpenAI's Whisper API for speech-to-text conversion, which is much more reliable than Azure Speech Services.

## Configuration

### 1. Environment Variables
Add the following to your `.env.local` file:

```bash
# OpenAI API Configuration (for Whisper speech-to-text)
OPENAI_API_KEY=sk-proj-your-openai-api-key-here
```

### 2. API Key Setup
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Copy the key and add it to `.env.local`

## Testing

### 1. Test Configuration
Visit: `http://localhost:3000/api/test-openai`

Expected response:
```json
{
  "config": {
    "openai": {
      "key": "Set"
    }
  },
  "tests": {
    "openai": "Connected"
  },
  "environment": "development"
}
```

### 2. Test Voice Recording
1. Go to the main journal page
2. Click "Start Recording"
3. Speak clearly for at least 2 seconds
4. Click "Stop Recording"
5. Check the console for transcription results

## Features

- **Better Accuracy**: Whisper is more accurate than Azure Speech Services
- **Multiple Formats**: Supports WebM, MP4, WAV, and other audio formats
- **Language Support**: Automatically detects English language
- **Error Handling**: Clear error messages for configuration issues

## Troubleshooting

### Common Issues

1. **"OpenAI API key not configured"**
   - Check that `OPENAI_API_KEY` is set in `.env.local`
   - Restart the development server after adding the key

2. **"Whisper API error: 401"**
   - Invalid API key - check the key is correct
   - Make sure there are no extra spaces or characters

3. **"Whisper API error: 429"**
   - Rate limit exceeded - wait a moment and try again
   - Check your OpenAI usage limits

4. **No transcription results**
   - Ensure you're speaking clearly and loudly
   - Record for at least 2 seconds
   - Check microphone permissions

### Debug Information
The console will show:
- Audio file details (size, type)
- Whisper API response
- Transcribed text
- Any errors that occur

## Cost
- Whisper API costs approximately $0.006 per minute of audio
- Very affordable for most use cases
- Check [OpenAI Pricing](https://openai.com/pricing) for current rates
