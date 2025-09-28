# 🚀 Athena's Journal - Vercel Deployment Guide

This guide will walk you through deploying your Athena's Journal project to Vercel, making it accessible to the world!

## 📋 Prerequisites

Before deploying, ensure you have:
- ✅ GitHub repository with your code
- ✅ MongoDB Atlas database set up
- ✅ Azure AI account (optional)
- ✅ Google AI Studio account (optional)
- ✅ Vercel account (free tier available)

## 🎯 Quick Deployment (5 minutes)

### Step 1: Push to GitHub
```bash
# If you haven't already, initialize git and push to GitHub
git init
git add .
git commit -m "Initial commit: Athena's Journal"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/athenas-journal.git
git push -u origin main
```

### Step 2: Deploy to Vercel

1. **Go to [Vercel.com](https://vercel.com)**
2. **Sign in with GitHub** (recommended)
3. **Click "New Project"**
4. **Import your repository** from GitHub
5. **Configure project settings:**
   - Framework Preset: `Next.js`
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

### Step 3: Add Environment Variables

In the Vercel dashboard, go to your project → Settings → Environment Variables:

```env
# Required
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/athenas-journal
JWT_SECRET=your_super_secret_jwt_key_here

# Optional (for full AI features)
NEXT_PUBLIC_AZURE_AI_ENDPOINT=https://your-resource.cognitiveservices.azure.com
NEXT_PUBLIC_AZURE_AI_KEY=your_azure_key
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

### Step 4: Deploy!
Click **"Deploy"** and wait for the magic to happen! ✨

## 🔧 Detailed Setup Instructions

### 1. GitHub Repository Setup

#### Option A: Create New Repository
```bash
# Create a new repository on GitHub first, then:
git init
git add .
git commit -m "Initial commit: Athena's Journal"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/athenas-journal.git
git push -u origin main
```

#### Option B: Use Existing Repository
```bash
# If you already have a repository:
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Vercel Account Setup

1. **Visit [vercel.com](https://vercel.com)**
2. **Sign up/Sign in** with GitHub (recommended)
3. **Verify your email** if required

### 3. Project Import

1. **Click "New Project"**
2. **Select "Import Git Repository"**
3. **Choose your repository** from the list
4. **Click "Import"**

### 4. Project Configuration

Vercel will auto-detect Next.js, but verify these settings:

| Setting | Value | Description |
|---------|-------|-------------|
| **Framework Preset** | `Next.js` | Auto-detected |
| **Root Directory** | `./` | Project root |
| **Build Command** | `npm run build` | Default Next.js build |
| **Output Directory** | `.next` | Next.js output |
| **Install Command** | `npm install` | Default package manager |

### 5. Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables:

#### Required Variables
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/athenas-journal?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
```

#### Optional AI Variables
```env
NEXT_PUBLIC_AZURE_AI_ENDPOINT=https://your-resource.cognitiveservices.azure.com
NEXT_PUBLIC_AZURE_AI_KEY=your_32_character_azure_key
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

**Important Notes:**
- ✅ Add variables for **Production**, **Preview**, and **Development** environments
- ✅ Use `NEXT_PUBLIC_` prefix for client-side variables
- ✅ Keep sensitive keys secure (don't commit to GitHub)

### 6. Deploy

1. **Click "Deploy"**
2. **Wait for build to complete** (usually 1-3 minutes)
3. **Get your live URL!** 🎉

## 🌐 Post-Deployment

### Your Live URLs
- **Production**: `https://your-project-name.vercel.app`
- **Preview**: `https://your-project-name-git-branch.vercel.app`
- **Custom Domain**: Add in Project Settings → Domains

### Test Your Deployment
1. **Visit your live URL**
2. **Test user registration**
3. **Create a journal entry**
4. **Verify AI features** (if configured)

## 🔧 Advanced Configuration

### Custom Domain (Optional)
1. **Go to Project Settings → Domains**
2. **Add your domain** (e.g., `athenasjournal.com`)
3. **Update DNS records** as instructed
4. **Enable SSL** (automatic with Vercel)

### Environment-Specific Variables
- **Production**: Live site variables
- **Preview**: Staging/testing variables  
- **Development**: Local development variables

### Build Optimization
```javascript
// next.config.js - Add if needed
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize for production
  swcMinify: true,
  compress: true,
  
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}

module.exports = nextConfig
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Build Failures
```bash
# Check build logs in Vercel dashboard
# Common fixes:
npm install  # Ensure all dependencies are installed
npm run build  # Test build locally first
```

#### 2. Environment Variables Not Working
- ✅ Check variable names match exactly
- ✅ Ensure `NEXT_PUBLIC_` prefix for client-side vars
- ✅ Redeploy after adding new variables

#### 3. Database Connection Issues
- ✅ Verify MongoDB URI is correct
- ✅ Check MongoDB Atlas IP whitelist (add `0.0.0.0/0` for Vercel)
- ✅ Ensure database user has proper permissions

#### 4. AI Services Not Working
- ✅ Verify API keys are correct
- ✅ Check service quotas and billing
- ✅ Test API endpoints individually

### Debug Commands
```bash
# Test build locally
npm run build
npm start

# Check environment variables
npm run dev
# Then visit: http://localhost:3000/api/debug-env
```

## 📊 Monitoring & Analytics

### Vercel Analytics
1. **Go to Project → Analytics**
2. **View performance metrics**
3. **Monitor user engagement**

### Error Tracking
1. **Check Function Logs** in Vercel dashboard
2. **Monitor API routes** for errors
3. **Set up alerts** for critical issues

## 🔄 Continuous Deployment

### Automatic Deployments
- ✅ **Push to main** → Deploys to production
- ✅ **Create pull request** → Deploys preview
- ✅ **Merge PR** → Deploys to production

### Manual Deployments
1. **Go to Deployments tab**
2. **Click "Redeploy"**
3. **Select specific commit** if needed

## 🎉 Success!

Your Athena's Journal is now live! Share your wisdom with the world:

**Live URL**: `https://your-project-name.vercel.app`

### Next Steps
- 🎨 Customize your domain
- 📊 Set up analytics
- 🔧 Monitor performance
- 🚀 Share with the world!

---

**Built with ❤️ for GirlHacks 2025**

*May your wisdom reach every corner of the digital realm* 🏛️

---

## 📞 Need Help?

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **MongoDB Atlas**: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
- **Project Issues**: Create an issue in your GitHub repository
