'use client';

import { useState, useEffect } from 'react';
import { JournalEntry } from '@/types';
import { formatDate, formatRelativeTime, getSentimentEmoji, getSentimentColor } from '@/lib/utils';

interface JournalHistoryProps {
  userId: string;
}

export default function JournalHistory({ userId }: JournalHistoryProps) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  useEffect(() => {
    fetchEntries();
  }, [userId]);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/journal/entries?userId=${userId}&limit=50`);
      const data = await response.json();

      if (data.success) {
        setEntries(data.entries || []);
      } else {
        throw new Error(data.error || 'Failed to fetch entries');
      }
    } catch (error) {
      console.error('Error fetching entries:', error);
      setError('Failed to load journal entries. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getSentimentStats = () => {
    const stats = entries.reduce((acc, entry) => {
      acc[entry.azureAnalysis.sentiment] = (acc[entry.azureAnalysis.sentiment] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return stats;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-athena-gold mx-auto mb-4"></div>
          <p className="text-athena-blue">Loading your journal history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 text-lg mb-2">⚠️</div>
          <p className="text-red-800 mb-4">{error}</p>
          <button
            onClick={fetchEntries}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const stats = getSentimentStats();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-greek font-bold text-athena-blue mb-2">
          📚 Your Journal History
        </h2>
        <p className="text-gray-600">
          {entries.length} {entries.length === 1 ? 'entry' : 'entries'} in your journey
        </p>
      </div>

      {/* Stats Overview */}
      {entries.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-gray-200">
          <h3 className="text-lg font-semibold text-athena-blue mb-4">Your Reflection Journey</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl mb-2">😊</div>
              <div className="text-2xl font-bold text-green-600">{stats.positive || 0}</div>
              <div className="text-sm text-gray-600">Positive Entries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">😔</div>
              <div className="text-2xl font-bold text-red-600">{stats.negative || 0}</div>
              <div className="text-sm text-gray-600">Challenging Entries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">😐</div>
              <div className="text-2xl font-bold text-gray-600">{stats.neutral || 0}</div>
              <div className="text-sm text-gray-600">Neutral Entries</div>
            </div>
          </div>
        </div>
      )}

      {/* Entries List */}
      {entries.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No entries yet</h3>
          <p className="text-gray-500 mb-6">
            Start your journey of self-reflection by creating your first journal entry.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-athena-gold text-white px-6 py-3 rounded-lg font-medium hover:bg-yellow-600 transition-colors"
          >
            Start Writing
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => setSelectedEntry(entry)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getSentimentEmoji(entry.azureAnalysis.sentiment)}</span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`font-medium ${getSentimentColor(entry.azureAnalysis.sentiment)}`}>
                          {entry.azureAnalysis.sentiment.charAt(0).toUpperCase() + 
                           entry.azureAnalysis.sentiment.slice(1)}
                        </span>
                        <span className="text-sm text-gray-500">
                          ({Math.round(entry.azureAnalysis.confidenceScores[entry.azureAnalysis.sentiment] * 100)}%)
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatRelativeTime(entry.timestamp)}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    {formatDate(entry.timestamp)}
                  </div>
                </div>
                
                <div className="mb-3">
                  <p className="text-gray-800 line-clamp-2">
                    {entry.journalText}
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {entry.azureAnalysis.keyPhrases?.slice(0, 3).map((phrase, index) => (
                      <span
                        key={index}
                        className="bg-athena-cream text-athena-blue px-2 py-1 rounded-full text-xs"
                      >
                        {phrase}
                      </span>
                    ))}
                  </div>
                  <div className="text-sm text-athena-gold font-medium">
                    Read more →
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Entry Detail Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-athena-blue">Journal Entry</h3>
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-3xl">{getSentimentEmoji(selectedEntry.azureAnalysis.sentiment)}</span>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`font-medium text-lg ${getSentimentColor(selectedEntry.azureAnalysis.sentiment)}`}>
                        {selectedEntry.azureAnalysis.sentiment.charAt(0).toUpperCase() + 
                         selectedEntry.azureAnalysis.sentiment.slice(1)}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({Math.round(selectedEntry.azureAnalysis.confidenceScores[selectedEntry.azureAnalysis.sentiment] * 100)}% confidence)
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(selectedEntry.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-2">Your Entry</h4>
                <p className="text-gray-800 bg-gray-50 p-4 rounded-lg">
                  {selectedEntry.journalText}
                </p>
              </div>
              
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-2">Athena's Response</h4>
                <div className="bg-athena-cream p-4 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <span className="text-lg">🏛️</span>
                    <p className="text-gray-800">{selectedEntry.athenaResponse}</p>
                  </div>
                </div>
              </div>
              
              {selectedEntry.azureAnalysis.keyPhrases && selectedEntry.azureAnalysis.keyPhrases.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Key Topics</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedEntry.azureAnalysis.keyPhrases.map((phrase, index) => (
                      <span
                        key={index}
                        className="bg-athena-gold text-white px-3 py-1 rounded-full text-sm"
                      >
                        {phrase}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

