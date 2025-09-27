# Azure Speech-to-Text Integration Setup

This guide will help you set up Azure Speech Services for voice recording and sentiment analysis in your journal application.

## Prerequisites

1. An Azure account with an active subscription
2. A Speech Services resource in Azure

## Step 1: Create Azure Speech Services Resource

1. Go to the [Azure Portal](https://portal.azure.com)
2. Click "Create a resource"
3. Search for "Speech Services" and select it
4. Click "Create"
5. Fill in the required details:
   - **Subscription**: Your Azure subscription
   - **Resource Group**: Create new or use existing
   - **Region**: Choose a region close to your users
   - **Name**: Give your resource a unique name
   - **Pricing Tier**: Choose F0 (free) for testing or S0 for production
6. Click "Review + create" then "Create"

## Step 2: Get Your Keys and Endpoint

1. Once your resource is created, go to it in the Azure Portal
2. In the left sidebar, click "Keys and Endpoint"
3. Copy the following values:
   - **Key 1** or **Key 2** (either will work)
   - **Endpoint** (the URL)

## Step 3: Update Environment Variables

Add these to your `.env.local` file:

```env
# Azure Speech Services Configuration
AZURE_SPEECH_ENDPOINT=https://your-speech-resource-name.cognitiveservices.azure.com
AZURE_SPEECH_KEY=your_32_character_speech_key_here
```

## Step 4: Test the Integration

1. Start your development server: `npm run dev`
2. Go to the journal page
3. Click the "Start Recording" button
4. Allow microphone permissions when prompted
5. Speak your journal entry
6. Click "Stop Recording"
7. The text should appear in the textarea and be analyzed for sentiment

## Features

- **Voice Recording**: Click to start/stop recording
- **Real-time Transcription**: Speech is converted to text using Azure Speech Services
- **Automatic Sentiment Analysis**: Transcribed text is analyzed for emotional sentiment
- **Browser Compatibility**: Works in modern browsers that support MediaRecorder API
- **Error Handling**: Graceful fallbacks when services are unavailable

## Troubleshooting

### Microphone Not Working
- Check browser permissions for microphone access
- Ensure you're using HTTPS (required for microphone access)
- Try refreshing the page and allowing permissions again

### Speech Recognition Failing
- Verify your Azure Speech Services keys are correct
- Check that your Speech Services resource is active
- Ensure you have sufficient quota/credits

### Transcription Quality Issues
- Speak clearly and at a moderate pace
- Reduce background noise
- Use a good quality microphone if possible

## Browser Support

The voice recording feature works in:
- Chrome 47+
- Firefox 25+
- Safari 14.1+
- Edge 79+

## Security Notes

- Audio is processed in real-time and not stored
- Only the transcribed text is sent to Azure for sentiment analysis
- All communication uses HTTPS encryption
