# 🏛️ Athena's Journal - Complete Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
```bash
cp env.example .env.local
```

### 3. Configure MongoDB Database

1. **Go to MongoDB Atlas**: https://www.mongodb.com/atlas
2. **Create a free cluster** (or use local MongoDB)
3. **Get Connection String**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
4. **Add to `.env.local`**:
   - Replace `<username>`, `<password>`, and `<dbname>` in the connection string
   - Example: `mongodb+srv://user:pass@cluster.mongodb.net/athenas-journal`

### 4. Configure JWT Secret
1. **Generate a secure JWT secret**:
   ```bash
   openssl rand -base64 32
   ```
2. **Add to `.env.local`**:
   ```
   JWT_SECRET=your_generated_secret_here
   ```

### 5. Configure Azure AI (Optional for Demo)
1. **Go to Azure Portal**: https://portal.azure.com/
2. **Create Cognitive Services Resource**
3. **Get API Key and Endpoint**
4. **Add to `.env.local`**

### 6. Configure Gemini AI (Optional for Demo)
1. **Go to Google AI Studio**: https://makersuite.google.com/app/apikey
2. **Create API Key**
3. **Add to `.env.local`**

### 7. Run the Application
```bash
npm run dev
```

## 📱 Pages Available

- **Landing Page**: `/landing` - Beautiful marketing page
- **Main App**: `/` - Journaling interface with authentication
- **Authentication**: Modal-based sign-up/sign-in

## 🔧 Features Implemented

### ✅ Landing Page
- Hero section with compelling copy
- Features showcase
- How it works section
- Testimonials
- Call-to-action sections
- Mobile responsive design

### ✅ Authentication System
- MongoDB-based user authentication
- JWT token-based sessions
- Email/Password sign-up and sign-in
- Secure password hashing with bcrypt
- Protected user sessions
- User context management

### ✅ Main Application
- Beautiful Greek temple aesthetic
- Real-time journal entries
- Azure AI sentiment analysis
- Gemini AI oracle responses
- MongoDB storage with Mongoose ODM
- Mobile responsive design

### ✅ UI/UX Enhancements
- Smooth animations and transitions
- Floating background elements
- Enhanced typography with Cinzel font
- Color-coded sentiment analysis
- Loading states and feedback
- Professional navigation

## 🎨 Design System

### Colors
- **Marble Light**: #F8F8F8
- **Marble Dark**: #EAEAEA
- **Gold Main**: #D4AF37
- **Athena Blue**: #104975

### Typography
- **Headings**: Cinzel (Google Fonts)
- **Body**: Inter (Google Fonts)

### Components
- Temple containers with gold accents
- Gradient buttons with hover effects
- Animated background elements
- Responsive grid layouts

## 🔐 Security Features

- MongoDB with secure authentication
- JWT token-based sessions
- Password hashing with bcrypt
- Protected API routes
- User-specific data storage
- Environment variable protection
- Input validation and sanitization

## 📱 Mobile Optimization

- Responsive design for all screen sizes
- Touch-friendly interface
- Optimized typography scaling
- Mobile navigation menu
- Fast loading performance

## 🚀 Deployment Ready

The application is ready for deployment to:
- Vercel (recommended for Next.js)
- Netlify
- Firebase Hosting
- Any static hosting service

## 🎯 Demo Mode

If you don't have API keys, the app will work in demo mode with:
- MongoDB authentication (requires database setup)
- Sample journal entries
- Placeholder AI responses (if Azure/Gemini not configured)

## 📞 Support

For questions or issues:
1. Check the console for error messages
2. Verify environment variables are set correctly
3. Ensure MongoDB connection is working
4. Check network connectivity for API calls
5. Verify JWT secret is properly set

---

**Built with ❤️ for GirlHacks 2025**

*May wisdom guide your path* 🏛️
