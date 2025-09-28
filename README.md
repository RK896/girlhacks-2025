# Athena's Journal 🏛️

> *Where Ancient Wisdom Meets Modern AI*

A divine journaling experience that combines the wisdom of Athena, the Greek goddess of wisdom, with cutting-edge AI technology. Share your thoughts and receive counsel powered by Azure AI sentiment analysis and Google's Gemini AI.

![Athena's Journal](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)
![Azure AI](https://img.shields.io/badge/Azure-AI-blue?style=for-the-badge&logo=microsoft-azure)
![Gemini AI](https://img.shields.io/badge/Google-Gemini-orange?style=for-the-badge&logo=google)

## ✨ Features

### 🧠 **Intelligent Analysis**
- **Real-time Sentiment Analysis** - Azure Cognitive Services analyze your emotions as you write
- **Emotional Intelligence** - Track mood patterns and emotional growth over time
- **Writing Pattern Analysis** - Understand your journaling habits and insights

### 🔮 **Athena's Oracle**
- **AI-Powered Counsel** - Receive wisdom and guidance from Google's Gemini AI
- **Divine Voice** - Responses crafted in the voice of the ancient Greek goddess
- **Personalized Insights** - Tailored advice based on your journal entries

### 🏛️ **Sacred Experience**
- **Temple-Inspired Design** - Beautiful Greek architecture with marble and gold aesthetics
- **Sacred Interface** - Cinzel font and classical design elements
- **Immersive Experience** - Floating elements and smooth animations

### 📱 **Modern Technology**
- **Mobile-First Design** - Fully responsive across all devices
- **Real-time Storage** - MongoDB integration for persistent journal history
- **Secure Authentication** - JWT-based user authentication
- **Voice Recording** - Optional voice-to-text journaling capabilities

### 📊 **Analytics & Insights**
- **Mood Timeline** - Visual representation of your emotional journey
- **Calendar Streak** - Track your journaling consistency
- **Topic Analysis** - Discover recurring themes in your thoughts
- **Word Cloud** - Visual representation of your most common words

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Custom Components** - Modular React components

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication

### AI Services
- **Azure Cognitive Services** - Sentiment analysis
- **Google Gemini AI** - Large language model
- **bcryptjs** - Password hashing

### Development
- **TypeScript** - Type safety
- **ESLint** - Code linting
- **PostCSS** - CSS processing

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account (free tier available)
- Azure AI account (optional for full features)
- Google AI Studio account (optional for full features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/athenas-journal.git
   cd athenas-journal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp env.example .env.local
   ```

4. **Configure your environment variables**
   
   Edit `.env.local` with your credentials:
   ```env
   # MongoDB Configuration
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/athenas-journal
   
   # JWT Secret (generate with: openssl rand -base64 32)
   JWT_SECRET=your_super_secret_jwt_key_here
   
   # Azure AI (optional)
   NEXT_PUBLIC_AZURE_AI_ENDPOINT=https://your-resource.cognitiveservices.azure.com
   NEXT_PUBLIC_AZURE_AI_KEY=your_azure_key
   
   # Gemini AI (optional)
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
athenas-journal/
├── app/
│   ├── api/                    # API routes
│   │   ├── ai/                # AI service endpoints
│   │   │   ├── azure/         # Azure AI sentiment analysis
│   │   │   └── gemini/        # Gemini AI oracle responses
│   │   ├── auth/              # Authentication endpoints
│   │   │   ├── login/         # User login
│   │   │   ├── register/      # User registration
│   │   │   └── me/            # User profile
│   │   └── journal/           # Journal entry endpoints
│   ├── components/            # React components
│   │   ├── AuthModal.jsx      # Authentication modal
│   │   ├── CalendarStreak.jsx # Journaling streak tracker
│   │   ├── MoodTimeline.jsx   # Mood visualization
│   │   ├── SentimentGraph.jsx # Sentiment analysis chart
│   │   ├── TopicAnalysis.jsx  # Topic extraction
│   │   ├── VoiceRecorder.jsx  # Voice recording component
│   │   ├── WordCloud.jsx      # Word cloud visualization
│   │   └── WritingPatterns.jsx# Writing pattern analysis
│   ├── contexts/              # React contexts
│   │   └── AuthContext.jsx    # Authentication state
│   ├── landing/               # Landing page
│   ├── globals.css            # Global styles
│   ├── layout.jsx             # Root layout
│   └── page.jsx               # Main application
├── lib/
│   └── mongodb.js             # MongoDB connection
├── models/                    # Database models
│   ├── JournalEntry.js        # Journal entry schema
│   └── User.js                # User schema
├── env.example                # Environment variables template
├── package.json               # Dependencies
├── tailwind.config.js         # Tailwind configuration
└── next.config.js             # Next.js configuration
```

## 🎨 Design System

### Colors
- **Marble Light**: `#F8F8F8` - Primary background
- **Marble Dark**: `#EAEAEA` - Secondary background
- **Gold Main**: `#D4AF37` - Accent color
- **Athena Blue**: `#104975` - Primary text color

### Typography
- **Headings**: Cinzel (Google Fonts) - Classical Greek aesthetic
- **Body**: Inter (Google Fonts) - Modern readability

### Components
- Temple containers with gold accents
- Gradient buttons with hover effects
- Animated background elements
- Responsive grid layouts

## 🎯 Demo Features

- **Email Preferences Demo**: Visit `/preferences` to see the email reminder settings interface (frontend demo only)
- **Voice Recording**: Test browser-based speech-to-text functionality  
- **Journal Entries**: Create and view journal entries with AI analysis
- **Scrollable Timeline**: "Your Emotional Journey" section with custom scrollable interface

## 🤝 Contributing

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Journal Entries
- `GET /api/journal/entries` - Get user's journal entries
- `POST /api/journal/entries` - Create new journal entry

### AI Services
- `POST /api/ai/azure` - Azure sentiment analysis
- `POST /api/ai/gemini` - Gemini AI oracle response


## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- **Netlify** - Static site hosting
- **Railway** - Full-stack deployment
- **Heroku** - Container-based deployment

## 🔐 Security Features

- **JWT Authentication** - Secure user sessions
- **Password Hashing** - bcrypt encryption
- **MongoDB Security** - Database access controls
- **Environment Variables** - Secure API key storage
- **Input Validation** - XSS and injection protection

## 📱 Mobile Optimization

- **Responsive Design** - Works on all screen sizes
- **Touch-Friendly** - Optimized for mobile interaction
- **Fast Loading** - Optimized performance
- **PWA Ready** - Progressive Web App capabilities

## 🎯 Demo Mode

The application works in demo mode without API keys:
- ✅ User authentication (requires MongoDB)
- ✅ Journal entry storage
- ❌ AI sentiment analysis (shows placeholder)
- ❌ Athena's oracle responses (shows placeholder)

## 🤝 Contributing

This project was built for **GirlHacks 2025**. We welcome contributions!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **GirlHacks 2025** - For the inspiration and platform
- **Azure Cognitive Services** - For sentiment analysis capabilities
- **Google Gemini AI** - For intelligent responses
- **MongoDB Atlas** - For database hosting
- **Next.js Team** - For the amazing framework

## 📞 Support

Having issues? Check out our troubleshooting guide:

1. **Database Connection Issues**
   - Verify MongoDB URI is correct
   - Check network connectivity
   - Ensure database permissions

2. **AI Service Issues**
   - Verify API keys are correct
   - Check service quotas
   - Review error logs in browser console

3. **Authentication Issues**
   - Check user registration/login flow
   - Clear browser storage if needed

---

**Built with ❤️ for GirlHacks 2025**

*May wisdom guide your path* 🏛️

---

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/athenas-journal)
[![Star on GitHub](https://img.shields.io/github/stars/yourusername/athenas-journal?style=social)](https://github.com/yourusername/athenas-journal)