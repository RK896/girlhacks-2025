// Athena's Journal Constants

export const APP_CONFIG = {
  name: "Athena's Journal",
  description: "A conversational, AI-powered journaling app that transforms self-reflection into a supportive dialogue",
  version: "1.0.0",
  author: "GirlHacks 2025 Team",
} as const;

export const AI_CONFIG = {
  maxJournalLength: 5000,
  minJournalLength: 10,
  maxResponseLength: 1024,
  defaultResponseLength: 200,
  temperature: 0.7,
  topK: 40,
  topP: 0.95,
} as const;

export const DATABASE_CONFIG = {
  collections: {
    journalEntries: 'journal_entries',
    users: 'users',
    notifications: 'notifications',
  },
  maxEntriesPerPage: 100,
  defaultEntriesPerPage: 10,
} as const;

export const NOTIFICATION_CONFIG = {
  defaultTime: '20:00', // 8 PM
  timezone: 'America/New_York',
  maxPrompts: 10,
} as const;

export const SENTIMENT_CONFIG = {
  thresholds: {
    positive: 0.6,
    negative: 0.6,
    neutral: 0.4,
  },
  fallback: 'neutral' as const,
} as const;

export const ATHENA_PERSONA = {
  name: 'Athena',
  title: 'Goddess of Wisdom',
  traits: [
    'Wise and insightful',
    'Supportive but not coddling',
    'Thought-provoking',
    'Mythologically grounded',
    'Warm and encouraging',
  ],
  responseStyle: {
    length: '1-3 sentences',
    tone: 'conversational and personal',
    focus: 'one thoughtful follow-up question',
  },
} as const;

export const API_ENDPOINTS = {
  journal: {
    entries: '/api/journal/entries',
    entry: (id: string) => `/api/journal/entries/${id}`,
  },
  users: '/api/users',
  health: '/api/health',
} as const;

export const ERROR_MESSAGES = {
  validation: {
    emptyJournalText: 'Journal text cannot be empty',
    journalTextTooLong: 'Journal text is too long (max 5000 characters)',
    journalTextTooShort: 'Please write at least 10 characters',
    missingUserId: 'User ID is required',
    missingEntryId: 'Entry ID is required',
    invalidEmail: 'Please enter a valid email address',
  },
  api: {
    internalError: 'Internal server error',
    serviceUnavailable: 'Service temporarily unavailable',
    unauthorized: 'Unauthorized access',
    notFound: 'Resource not found',
  },
  ai: {
    azureNotConfigured: 'Azure AI service not configured',
    geminiNotConfigured: 'Gemini AI service not configured',
    analysisFailed: 'AI analysis failed',
    generationFailed: 'AI response generation failed',
  },
} as const;

export const SUCCESS_MESSAGES = {
  journal: {
    entryCreated: 'Journal entry created successfully',
    entryRetrieved: 'Journal entry retrieved successfully',
    entriesRetrieved: 'Journal entries retrieved successfully',
  },
  user: {
    created: 'User created successfully',
    updated: 'User updated successfully',
    retrieved: 'User retrieved successfully',
  },
} as const;


