'use client';

import { useState, useRef, useEffect } from 'react';
import { JournalEntry } from '@/types';
import { formatRelativeTime, getSentimentEmoji, getSentimentColor } from '@/lib/utils';
import AudioRecorder from './AudioRecorder';
import { Mic } from 'lucide-react';

interface JournalInterfaceProps {
  userId: string;
}

interface Message {
  id: string;
  type: 'user' | 'athena';
  content: string;
  timestamp: Date;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

export default function JournalInterface({ userId }: JournalInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<JournalEntry | null>(null);
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputText.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/journal/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          journalText: inputText.trim(),
          userId: userId,
        }),
      });

      const data = await response.json();

      if (data.success && data.entry) {
        setCurrentEntry(data.entry);
        
        const athenaMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'athena',
          content: data.entry.athenaResponse,
          timestamp: new Date(),
          sentiment: data.entry.azureAnalysis.sentiment,
        };

        setMessages(prev => [...prev, athenaMessage]);
      } else {
        throw new Error(data.error || 'Failed to create journal entry');
      }
    } catch (error) {
      console.error('Error creating journal entry:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'athena',
        content: "I apologize, but I'm having trouble processing your entry right now. Please try again in a moment.",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewEntry = () => {
    setMessages([]);
    setCurrentEntry(null);
    setShowAudioRecorder(false);
  };

  const handleTranscription = (text: string) => {
    setInputText(text);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Welcome Message */}
      {messages.length === 0 && (
        <div className="text-center mb-8">
          <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-athena-gold">
            <div className="text-6xl mb-4">🏛️</div>
            <h2 className="text-2xl font-greek font-bold text-athena-blue mb-4">
              Welcome to Athena's Journal
            </h2>
            <p className="text-gray-700 mb-6">
              I'm Athena, your wise companion for self-reflection. Share your thoughts, 
              feelings, or experiences with me, and I'll help you explore them more deeply.
            </p>
            <div className="bg-athena-cream rounded-lg p-4">
              <p className="text-sm text-athena-blue font-medium">
                💡 Try starting with: "Today I felt..." or "I'm grateful for..." or "I'm struggling with..."
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Chat Interface */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
        {/* Messages */}
        <div className="h-96 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-athena-gold text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {message.type === 'athena' && (
                  <div className="flex items-center mb-2">
                    <span className="text-lg mr-2">🏛️</span>
                    <span className="text-sm font-medium text-athena-blue">Athena</span>
                    {message.sentiment && (
                      <span className="ml-2 text-lg">
                        {getSentimentEmoji(message.sentiment)}
                      </span>
                    )}
                  </div>
                )}
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {formatRelativeTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 max-w-xs lg:max-w-md px-4 py-3 rounded-lg">
                <div className="flex items-center mb-2">
                  <span className="text-lg mr-2">🏛️</span>
                  <span className="text-sm font-medium text-athena-blue">Athena</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="animate-bounce w-2 h-2 bg-athena-gold rounded-full"></div>
                  <div className="animate-bounce w-2 h-2 bg-athena-gold rounded-full" style={{ animationDelay: '0.1s' }}></div>
                  <div className="animate-bounce w-2 h-2 bg-athena-gold rounded-full" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Audio Recorder Toggle */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowAudioRecorder(!showAudioRecorder)}
              className="flex items-center space-x-2 text-athena-blue hover:text-blue-700 transition-colors"
            >
              <Mic className="w-4 h-4" />
              <span className="text-sm font-medium">
                {showAudioRecorder ? 'Hide Speech-to-Text' : 'Add Speech-to-Text'}
              </span>
            </button>
          </div>

          {/* Audio Recorder */}
          {showAudioRecorder && (
            <div className="mb-4">
              <AudioRecorder
                onTranscription={handleTranscription}
                disabled={isLoading}
              />
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="flex space-x-4">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Share your thoughts with Athena..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-athena-gold focus:border-transparent"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="bg-athena-gold text-white px-6 py-2 rounded-lg font-medium hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
      </div>

      {/* Entry Summary */}
      {currentEntry && (
        <div className="mt-6 bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-athena-blue">Entry Summary</h3>
            <button
              onClick={startNewEntry}
              className="text-sm text-athena-gold hover:text-yellow-600 font-medium"
            >
              Start New Entry
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Sentiment Analysis</h4>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{getSentimentEmoji(currentEntry.azureAnalysis.sentiment)}</span>
                <span className={`font-medium ${getSentimentColor(currentEntry.azureAnalysis.sentiment)}`}>
                  {currentEntry.azureAnalysis.sentiment.charAt(0).toUpperCase() + 
                   currentEntry.azureAnalysis.sentiment.slice(1)}
                </span>
                <span className="text-sm text-gray-500">
                  ({Math.round(currentEntry.azureAnalysis.confidenceScores[currentEntry.azureAnalysis.sentiment] * 100)}% confidence)
                </span>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Key Topics</h4>
              <div className="flex flex-wrap gap-2">
                {currentEntry.azureAnalysis.keyPhrases?.slice(0, 3).map((phrase, index) => (
                  <span
                    key={index}
                    className="bg-athena-cream text-athena-blue px-2 py-1 rounded-full text-sm"
                  >
                    {phrase}
                  </span>
                )) || (
                  <span className="text-gray-500 text-sm">No key phrases detected</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
