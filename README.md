# Athena's Journal 🏛️

A divine journaling experience where ancient Greek wisdom meets modern AI. Share your thoughts and receive counsel from Athena, the goddess of wisdom, powered by Azure AI sentiment analysis and Google's Gemini AI.                           

## Features

- **Sacred Interface**: Beautiful Greek temple-inspired UI with marble and gold aesthetics                                                                      
- **Azure AI Analysis**: Real-time sentiment analysis of your journal entries
- **Athena's Oracle**: AI-powered responses in the voice of the ancient Greek goddess                                                                           
- **Real-time Storage**: Firebase Firestore integration for persistent journal history                                                                          
- **Mobile Responsive**: Optimized for all devices

## Tech Stack

- **Frontend**: Next.js 14 with App Router, React, Tailwind CSS
- **Backend**: Firebase Firestore
- **AI Services**: Azure Cognitive Services, Google Gemini AI
- **Styling**: Custom Greek temple theme with Cinzel font

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Copy the example environment file and fill in your API keys:

```bash
cp env.example .env.local
```

### 3. Required API Keys

#### Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing
3. Enable Firestore Database
4. Get your config from Project Settings > General > Your apps

#### Azure AI Setup
1. Go to [Azure Portal](https://portal.azure.com/)
2. Create a Cognitive Services resource
3. Get your endpoint and key from the resource

#### Gemini AI Setup
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key

### 4. Update Environment Variables

Edit `.env.local` with your actual API keys:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_actual_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_actual_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_actual_app_id

# Azure AI Configuration
NEXT_PUBLIC_AZURE_AI_ENDPOINT=https://your-resource.cognitiveservices.azure.com 
NEXT_PUBLIC_AZURE_AI_KEY=your_actual_azure_key

# Gemini API Configuration
NEXT_PUBLIC_GEMINI_API_KEY=your_actual_gemini_key
```

### 5. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.    

## Usage

1. **Write Your Reflection**: Enter your thoughts in the sacred altar textarea  
2. **Seek Counsel**: Click "Seek Athena's Counsel" to get divine wisdom
3. **View Archives**: Scroll down to see your journal history with both your entries and Athena's responses                                                     
4. **Technical Transparency**: Each entry shows the Azure sentiment analysis results                                                                            

## Project Structure

```
athenas-journal/
├── app/
│   ├── globals.css          # Global styles and Greek temple theme     
│   ├── layout.jsx           # Root layout with Cinzel font
│   └── page.jsx             # Main application with all components     
├── package.json             # Dependencies
├── tailwind.config.js       # Tailwind configuration with custom colors  
├── next.config.js           # Next.js configuration
└── README.md               # This file
```

## Customization

The app uses a custom Greek temple theme with these colors:
- `marble-light`: #F8F8F8
- `marble-dark`: #EAEAEA
- `gold-main`: #D4AF37
- `athena-blue`: #104975

Font: Cinzel (Google Fonts) for headings

## Contributing

This is a hackathon project built for GirlHacks 2025. Feel free to fork and enhance!                                                                            

## License

MIT License - feel free to use this project as inspiration for your own divine AI applications!