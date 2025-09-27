'use client';

import { useState, useEffect } from 'react';
import JournalInterface from '@/components/JournalInterface';
import JournalHistory from '@/components/JournalHistory';
import UserAuth from '@/components/UserAuth';
import HealthStatus from '@/components/HealthStatus';

export default function Home() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'journal' | 'history'>('journal');

  // Auto-generate a test user for demo purposes
  useEffect(() => {
    const testUserId = 'demo-user-' + Math.random().toString(36).substr(2, 9);
    setCurrentUser(testUserId);
  }, []);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-athena-cream to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-athena-gold mx-auto mb-4"></div>
          <p className="text-athena-blue">Loading Athena's Journal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-athena-cream to-white">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-2 border-athena-gold">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🏛️</div>
              <div>
                <h1 className="text-2xl font-greek font-bold athena-text-gradient">
                  Athena's Journal
                </h1>
                <p className="text-sm text-gray-600">Wisdom begins in wonder</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <HealthStatus />
              <div className="text-sm text-gray-600">
                Welcome, {currentUser.slice(-6)}
              </div>
              <div className="text-xs text-athena-gold bg-athena-cream px-2 py-1 rounded">
                Azure: athena1.cognitiveservices.azure.com
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('journal')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'journal'
                  ? 'border-athena-gold text-athena-gold'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              📝 New Entry
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'history'
                  ? 'border-athena-gold text-athena-gold'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              📚 Journal History
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'journal' ? (
          <JournalInterface userId={currentUser} />
        ) : (
          <JournalHistory userId={currentUser} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-athena-blue text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm opacity-90">
            Built with ❤️ for GirlHacks 2025 • Powered by Azure AI & Gemini
          </p>
        </div>
      </footer>
    </div>
  );
}

