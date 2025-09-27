import { connectToDatabase } from './mongodb';
import { JournalEntry, User } from '@/types';
import { ObjectId } from 'mongodb';

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
      const { db } = await connectToDatabase();
      const collection = db.collection(this.COLLECTION_NAME);
      
      const now = new Date();
      const entryData = {
        userId: new ObjectId(userId),
        timestamp: now,
        journalText,
        azureAnalysis,
        athenaResponse,
        createdAt: now,
        updatedAt: now,
      };

      const result = await collection.insertOne(entryData);
      
      return {
        id: result.insertedId.toString(),
        userId,
        timestamp: now,
        journalText,
        azureAnalysis,
        athenaResponse,
        createdAt: now,
        updatedAt: now,
      };
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
      const { db } = await connectToDatabase();
      const collection = db.collection(this.COLLECTION_NAME);
      
      const query = { userId: new ObjectId(userId) };
      const options = {
        sort: { timestamp: -1 },
        limit: limitCount,
        skip: skip,
      };

      const cursor = collection.find(query, options);
      const entries = await cursor.toArray();

      return entries.map(doc => ({
        id: doc._id.toString(),
        userId: doc.userId.toString(),
        timestamp: doc.timestamp,
        journalText: doc.journalText,
        azureAnalysis: doc.azureAnalysis,
        athenaResponse: doc.athenaResponse,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      }));
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      throw new Error('Failed to fetch journal entries');
    }
  }

  // Get a specific journal entry
  static async getEntry(entryId: string, userId: string): Promise<JournalEntry | null> {
    try {
      const { db } = await connectToDatabase();
      const collection = db.collection(this.COLLECTION_NAME);
      
      const query = {
        _id: new ObjectId(entryId),
        userId: new ObjectId(userId)
      };

      const doc = await collection.findOne(query);
      
      if (!doc) {
        return null;
      }

      return {
        id: doc._id.toString(),
        userId: doc.userId.toString(),
        timestamp: doc.timestamp,
        journalText: doc.journalText,
        azureAnalysis: doc.azureAnalysis,
        athenaResponse: doc.athenaResponse,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      };
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
      const { db } = await connectToDatabase();
      const collection = db.collection(this.COLLECTION_NAME);
      
      const query = {
        _id: new ObjectId(entryId),
        userId: new ObjectId(userId)
      };

      const updateDoc = {
        $set: {
          ...updates,
          updatedAt: new Date(),
        }
      };

      const result = await collection.findOneAndUpdate(query, updateDoc, { returnDocument: 'after' });
      
      if (!result) {
        return null;
      }

      return {
        id: result._id.toString(),
        userId: result.userId.toString(),
        timestamp: result.timestamp,
        journalText: result.journalText,
        azureAnalysis: result.azureAnalysis,
        athenaResponse: result.athenaResponse,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      };
    } catch (error) {
      console.error('Error updating journal entry:', error);
      throw new Error('Failed to update journal entry');
    }
  }

  // Delete a journal entry
  static async deleteEntry(entryId: string, userId: string): Promise<boolean> {
    try {
      const { db } = await connectToDatabase();
      const collection = db.collection(this.COLLECTION_NAME);
      
      const query = {
        _id: new ObjectId(entryId),
        userId: new ObjectId(userId)
      };

      const result = await collection.deleteOne(query);
      return result.deletedCount > 0;
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
      const { db } = await connectToDatabase();
      const collection = db.collection(this.COLLECTION_NAME);
      
      const userData = {
        _id: new ObjectId(user.uid),
        email: user.email,
        displayName: user.displayName,
        createdAt: user.createdAt,
        notificationTime: user.notificationTime,
        updatedAt: new Date(),
      };

      await collection.replaceOne(
        { _id: new ObjectId(user.uid) },
        userData,
        { upsert: true }
      );
    } catch (error) {
      console.error('Error creating/updating user:', error);
      throw new Error('Failed to create/update user');
    }
  }

  // Get user by ID
  static async getUser(userId: string): Promise<User | null> {
    try {
      const { db } = await connectToDatabase();
      const collection = db.collection(this.COLLECTION_NAME);
      
      const query = { _id: new ObjectId(userId) };
      const doc = await collection.findOne(query);
      
      if (!doc) {
        return null;
      }

      return {
        uid: doc._id.toString(),
        email: doc.email,
        displayName: doc.displayName,
        createdAt: doc.createdAt,
        notificationTime: doc.notificationTime,
      };
    } catch (error) {
      console.error('Error fetching user:', error);
      throw new Error('Failed to fetch user');
    }
  }

  // Update user
  static async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    try {
      const { db } = await connectToDatabase();
      const collection = db.collection(this.COLLECTION_NAME);
      
      const query = { _id: new ObjectId(userId) };
      const updateDoc = {
        $set: {
          ...updates,
          updatedAt: new Date(),
        }
      };

      const result = await collection.findOneAndUpdate(query, updateDoc, { returnDocument: 'after' });
      
      if (!result) {
        return null;
      }

      return {
        uid: result._id.toString(),
        email: result.email,
        displayName: result.displayName,
        createdAt: result.createdAt,
        notificationTime: result.notificationTime,
      };
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update user');
    }
  }

  // Delete user
  static async deleteUser(userId: string): Promise<boolean> {
    try {
      const { db } = await connectToDatabase();
      const collection = db.collection(this.COLLECTION_NAME);
      
      const query = { _id: new ObjectId(userId) };
      const result = await collection.deleteOne(query);
      return result.deletedCount > 0;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Failed to delete user');
    }
  }
}

