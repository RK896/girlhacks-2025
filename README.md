# 🏛️ Athena's Journal

AI-powered journaling app that transforms self-reflection into supportive dialogue.

## ✨ Features

- **🤖 AI Conversations**: Chat with Athena for deeper self-reflection
- **📊 Sentiment Analysis**: Azure AI analyzes your emotional state
- **📝 Journal History**: View past entries with insights
- **🎨 Beautiful UI**: Modern design with Greek mythology theming

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **AI**: Azure AI Language Service + Google Gemini API

## 🚀 Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment**
   ```bash
   cp env.example .env.local
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open** [http://localhost:3000](http://localhost:3000)

## 🔧 Environment Variables

```env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=athenas-journal
AZURE_AI_KEY=your_azure_ai_key_here
AZURE_AI_ENDPOINT=https://athena1.cognitiveservices.azure.com/
GEMINI_API_KEY=your_gemini_api_key_here
```

## 🎯 Usage

1. **Type your thoughts** in the input field
2. **Get AI responses** from Athena
3. **View your history** to track patterns
4. **Analyze your mood** with sentiment insights

Built with ❤️ for mental wellness