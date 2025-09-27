// Mock database service that works without MongoDB
import { JournalEntry, User } from '@/types';

// In-memory storage for demo purposes
let mockJournalEntries: JournalEntry[] = [];
let mockUsers: User[] = [];

// Journal Entry Operations
export class JournalService {
  private static readonly COLLECTION_NAME = 'journal_entries';

  // Create a new journal entry
  static async createEntry(
    userId: string,
    journalText: string,
    azureAnalysis: any,
    athenaResponse: string
  ): Promise<JournalEntry> {
    try {
      const now = new Date();
      const entry: JournalEntry = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        userId,
        timestamp: new Date(now),
        journalText,
        azureAnalysis,
        athenaResponse,
        createdAt: new Date(now),
        updatedAt: new Date(now),
      };

      mockJournalEntries.unshift(entry); // Add to beginning
      
      console.log('✅ Mock: Journal entry created successfully');
      return entry;
    } catch (error) {
      console.error('Error creating journal entry:', error);
      throw new Error('Failed to create journal entry');
    }
  }

  // Get journal entries for a user
  static async getEntries(
    userId: string,
    limitCount: number = 10,
    skip: number = 0
  ): Promise<JournalEntry[]> {
    try {
      const userEntries = mockJournalEntries
        .filter(entry => entry.userId === userId)
        .slice(skip, skip + limitCount);

      console.log(`✅ Mock: Retrieved ${userEntries.length} entries for user ${userId}`);
      return userEntries;
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      throw new Error('Failed to fetch journal entries');
    }
  }

  // Get a specific journal entry
  static async getEntry(entryId: string, userId: string): Promise<JournalEntry | null> {
    try {
      const entry = mockJournalEntries.find(
        e => e.id === entryId && e.userId === userId
      );
      
      console.log(`✅ Mock: Retrieved entry ${entryId} for user ${userId}`);
      return entry || null;
    } catch (error) {
      console.error('Error fetching journal entry:', error);
      throw new Error('Failed to fetch journal entry');
    }
  }

  // Update a journal entry
  static async updateEntry(
    entryId: string,
    userId: string,
    updates: Partial<Pick<JournalEntry, 'journalText' | 'azureAnalysis' | 'athenaResponse'>>
  ): Promise<JournalEntry | null> {
    try {
      const entryIndex = mockJournalEntries.findIndex(
        e => e.id === entryId && e.userId === userId
      );
      
      if (entryIndex === -1) {
        return null;
      }

      mockJournalEntries[entryIndex] = {
        ...mockJournalEntries[entryIndex],
        ...updates,
        updatedAt: new Date(),
      };

      console.log(`✅ Mock: Updated entry ${entryId}`);
      return mockJournalEntries[entryIndex];
    } catch (error) {
      console.error('Error updating journal entry:', error);
      throw new Error('Failed to update journal entry');
    }
  }

  // Delete a journal entry
  static async deleteEntry(entryId: string, userId: string): Promise<boolean> {
    try {
      const initialLength = mockJournalEntries.length;
      mockJournalEntries = mockJournalEntries.filter(
        e => !(e.id === entryId && e.userId === userId)
      );
      
      const deleted = mockJournalEntries.length < initialLength;
      console.log(`✅ Mock: Deleted entry ${entryId}: ${deleted}`);
      return deleted;
    } catch (error) {
      console.error('Error deleting journal entry:', error);
      throw new Error('Failed to delete journal entry');
    }
  }
}

// User Operations
export class UserService {
  private static readonly COLLECTION_NAME = 'users';

  // Create or update user
  static async createOrUpdateUser(user: User): Promise<void> {
    try {
      const existingIndex = mockUsers.findIndex(u => u.uid === user.uid);
      
      if (existingIndex >= 0) {
        mockUsers[existingIndex] = user;
      } else {
        mockUsers.push(user);
      }
      
      console.log(`✅ Mock: User ${user.uid} created/updated`);
    } catch (error) {
      console.error('Error creating/updating user:', error);
      throw new Error('Failed to create/update user');
    }
  }

  // Get user by ID
  static async getUser(userId: string): Promise<User | null> {
    try {
      const user = mockUsers.find(u => u.uid === userId);
      console.log(`✅ Mock: Retrieved user ${userId}: ${user ? 'found' : 'not found'}`);
      return user || null;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw new Error('Failed to fetch user');
    }
  }

  // Update user
  static async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    try {
      const userIndex = mockUsers.findIndex(u => u.uid === userId);
      
      if (userIndex === -1) {
        return null;
      }

      mockUsers[userIndex] = {
        ...mockUsers[userIndex],
        ...updates,
      };

      console.log(`✅ Mock: Updated user ${userId}`);
      return mockUsers[userIndex];
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update user');
    }
  }

  // Delete user
  static async deleteUser(userId: string): Promise<boolean> {
    try {
      const initialLength = mockUsers.length;
      mockUsers = mockUsers.filter(u => u.uid !== userId);
      
      const deleted = mockUsers.length < initialLength;
      console.log(`✅ Mock: Deleted user ${userId}: ${deleted}`);
      return deleted;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Failed to delete user');
    }
  }
}
