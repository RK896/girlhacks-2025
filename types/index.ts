// User and Authentication Types
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  createdAt: Date;
  notificationTime?: string; // Time of day for notifications (e.g., "20:00")
}

// Journal Entry Types
export interface JournalEntry {
  id: string;
  userId: string;
  timestamp: Date;
  journalText: string;
  azureAnalysis: AzureAnalysis;
  athenaResponse: string;
  createdAt: Date;
  updatedAt: Date;
}

// Azure AI Analysis Types
export interface AzureAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidenceScores: {
    positive: number;
    negative: number;
    neutral: number;
  };
  keyPhrases?: string[];
  entities?: AzureEntity[];
}

export interface AzureEntity {
  text: string;
  category: string;
  confidence: number;
}

// API Request/Response Types
export interface CreateJournalEntryRequest {
  journalText: string;
  userId: string;
}

export interface CreateJournalEntryResponse {
  success: boolean;
  entry?: JournalEntry;
  error?: string;
}

export interface GetJournalEntriesRequest {
  userId: string;
  limit?: number;
  offset?: number;
}

export interface GetJournalEntriesResponse {
  success: boolean;
  entries?: JournalEntry[];
  error?: string;
}

// Athena AI Persona Configuration
export interface AthenaConfig {
  persona: string;
  systemPrompt: string;
  responseStyle: 'supportive' | 'challenging' | 'neutral';
  maxResponseLength: number;
}

// Notification Types
export interface NotificationSettings {
  userId: string;
  enabled: boolean;
  time: string; // HH:MM format
  timezone: string;
  lastSent?: Date;
}

// Error Types
export interface APIError {
  code: string;
  message: string;
  details?: any;
}

// Database Document Types (for MongoDB)
export interface JournalEntryDocument {
  _id: string;
  userId: string;
  timestamp: Date;
  journalText: string;
  azureAnalysis: AzureAnalysis;
  athenaResponse: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserDocument {
  _id: string;
  email: string;
  displayName?: string;
  createdAt: Date;
  notificationTime?: string;
  updatedAt?: Date;
}

