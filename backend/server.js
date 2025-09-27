import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// import fetch from "node-fetch";
import { body, validationResult } from 'express-validator';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

console.log("Loaded AZURE_REGION:", process.env.AZURE_REGION);
console.log("Loaded AZURE_SPEECH_KEY:", process.env.AZURE_SPEECH_KEY ? "✅ Present" : "❌ Missing");


// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer configuration for audio uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/audio';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'audio-' + uniqueSuffix + '.webm');
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept audio files
    if (file.mimetype.startsWith('audio/') || file.mimetype === 'video/webm') {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed'), false);
    }
  }
});

// MongoDB Connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    await mongoose.connect(mongoURI);
    console.log('🏛️ Connected to MongoDB - Athena\'s wisdom flows through the database');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// User Schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  journalEntries: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JournalEntry'
  }],
  preferences: {
    dailyReminderTime: {
      type: String,
      default: '21:00' // 9 PM default
    },
    timezone: {
      type: String,
      default: 'UTC'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Journal Entry Schema
const journalEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  journalText: {
    type: String,
    required: [true, 'Journal text is required'],
    maxlength: [5000, 'Journal entry cannot exceed 5000 characters']
  },
  azureAnalysis: {
    sentiment: {
      type: String,
      enum: ['positive', 'negative', 'neutral'],
      required: true
    },
    confidenceScores: {
      positive: { type: Number, min: 0, max: 1 },
      neutral: { type: Number, min: 0, max: 1 },
      negative: { type: Number, min: 0, max: 1 }
    }
  },
  athenaResponse: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true // YYYY-MM-DD format
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create models
const User = mongoose.model('User', userSchema);
const JournalEntry = mongoose.model('JournalEntry', journalEntrySchema);

// JWT Secret (in production, use a proper secret from environment)
const JWT_SECRET = process.env.JWT_SECRET || 'athena-wisdom-secret-key-2024';

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access denied. No token provided.' 
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token. User not found.' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ 
      success: false, 
      message: 'Invalid token.' 
    });
  }
};

// Validation middleware for signup
const validateSignup = [
  body('firstName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number')
];

// Validation middleware for login
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: '🏛️ Athena\'s Oracle is running - Wisdom flows through the server',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Signup route
app.post('/api/auth/signup', validateSignup, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { firstName, lastName, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'A seeker with this email already exists in Athena\'s temple'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password from response
    const userResponse = {
      id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      createdAt: newUser.createdAt
    };

    res.status(201).json({
      success: true,
      message: '🎉 Welcome to Athena\'s temple! Your journey of wisdom begins now.',
      data: {
        user: userResponse,
        token
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'The Oracle encountered an unexpected error. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Login route
app.post('/api/auth/login', validateLogin, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'No seeker found with this email in Athena\'s temple'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'The sacred password you entered does not match our records'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password from response
    const userResponse = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      lastLogin: user.lastLogin,
      preferences: user.preferences
    };

    res.json({
      success: true,
      message: '🏛️ Welcome back, wise seeker! Athena\'s wisdom awaits you.',
      data: {
        user: userResponse,
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'The Oracle encountered an unexpected error. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get user profile (protected route)
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user profile'
    });
  }
});

app.get("/api/token", async (req, res) => {
  try {
    const response = await fetch(
      `https://${process.env.AZURE_REGION}.api.cognitive.microsoft.com/sts/v1.0/issueToken`,
      {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": process.env.AZURE_SPEECH_KEY,
          "Content-Length": "0",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Azure token request failed: ${response.status} ${response.statusText}`);
    }

    const token = await response.text();
    console.log("✅ Azure token:", token);
    res.json({ token, region: process.env.AZURE_REGION });
  } catch (err) {
    console.error("❌ Azure token error:", err.message);
    res.status(500).json({ error: "Failed to fetch Azure token" });
  }
});

// Create journal entry (protected route)
app.post('/api/journal/entry', authenticateToken, async (req, res) => {
  try {
    const { journalText, azureAnalysis, athenaResponse } = req.body;

    if (!journalText || !azureAnalysis || !athenaResponse) {
      return res.status(400).json({
        success: false,
        message: 'Journal text, analysis, and Athena\'s response are required'
      });
    }

    // Create date string in YYYY-MM-DD format
    const date = new Date().toISOString().split('T')[0];

    const newEntry = new JournalEntry({
      userId: req.user._id,
      journalText,
      azureAnalysis,
      athenaResponse,
      date
    });

    await newEntry.save();

    // Add entry to user's journal entries array
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { journalEntries: newEntry._id } }
    );

    res.status(201).json({
      success: true,
      message: '📜 Your wisdom has been recorded in Athena\'s sacred archive',
      data: {
        entry: newEntry
      }
    });

  } catch (error) {
    console.error('Journal entry error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save your journal entry'
    });
  }
});

// Get user's journal entries (protected route)
app.get('/api/journal/entries', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, date } = req.query;
    
    let query = { userId: req.user._id };
    
    if (date) {
      query.date = date;
    }

    const entries = await JournalEntry.find(query)
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await JournalEntry.countDocuments(query);

    res.json({
      success: true,
      data: {
        entries,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get entries error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve journal entries'
    });
  }
});

// Audio transcription endpoint (protected route)
app.post('/api/journal/transcribe-audio', authenticateToken, upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No audio file provided'
      });
    }

    const audioFile = req.file;
    console.log('📢 Audio file received:', audioFile.filename);
    console.log('📢 File size:', audioFile.size, 'bytes');
    console.log('📢 MIME type:', audioFile.mimetype);

    // For now, we'll simulate transcription
    // In production, you would integrate with services like:
    // - Google Cloud Speech-to-Text
    // - Azure Speech Services
    // - AWS Transcribe
    // - OpenAI Whisper API

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock transcription result
    const mockTranscription = "This is a simulated transcription of your audio journal entry. In a real implementation, this would be the actual transcribed text from your audio recording.";

    // Clean up the uploaded file (optional - you might want to keep it for processing)
    // fs.unlinkSync(audioFile.path);

    res.json({
      success: true,
      message: '🎤 Audio successfully transcribed by Athena\'s divine ears',
      data: {
        transcription: mockTranscription,
        audioFile: {
          filename: audioFile.filename,
          size: audioFile.size,
          mimetype: audioFile.mimetype
        }
      }
    });

  } catch (error) {
    console.error('Audio transcription error:', error);
    
    // Clean up file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: 'Failed to transcribe audio. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    message: 'The Oracle has encountered an unexpected disturbance. Please try again later.'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: '🏛️ The path you seek does not exist in Athena\'s temple'
  });
});

// Start server
const startServer = async () => {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`🏛️ Athena's Oracle Server is running on port ${PORT}`);
    console.log(`📜 API Documentation: http://localhost:${PORT}/api/health`);
    console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:8080'}`);
  });
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('🏛️ Athena\'s Oracle is shutting down gracefully...');
  mongoose.connection.close();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🏛️ Athena\'s Oracle is shutting down gracefully...');
  mongoose.connection.close();
  process.exit(0);
});

startServer().catch(console.error);
