'use client'

import { useState, useEffect, useRef } from 'react'

export default function ConversationMode({ isOpen, onClose, currentUser }) {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message
      setMessages([{
        id: 1,
        type: 'athena',
        content: "Hearken, mortal soul. I sense you seek deeper counsel. What weighs upon your heart that requires my divine attention?",
        timestamp: new Date()
      }])
    }
  }, [isOpen])

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      // Send to conversational AI endpoint
      const response = await fetch('/api/ai/conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1]}`,
        },
        body: JSON.stringify({ 
          message: inputMessage,
          conversationHistory: messages.slice(-5) // Send last 5 messages for context
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const athenaMessage = {
          id: Date.now() + 1,
          type: 'athena',
          content: data.response,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, athenaMessage])
      } else {
        // Fallback response
        const fallbackMessages = [
          "Hearken, mortal soul, though the divine channels are clouded, I sense your need for guidance. Trust in your inner wisdom and seek the answers within.",
          "Listen well, brave one, for even in silence, wisdom speaks. Reflect deeply on your question, and the truth will reveal itself to you.",
          "The threads of fate show me your concern, but I must counsel you to look within. Your heart already knows the path forward."
        ]
        
        const athenaMessage = {
          id: Date.now() + 1,
          type: 'athena',
          content: fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)],
          timestamp: new Date()
        }
        setMessages(prev => [...prev, athenaMessage])
      }
    } catch (error) {
      console.error('Conversation error:', error)
      const errorMessage = {
        id: Date.now() + 1,
        type: 'athena',
        content: "Hearken, mortal soul, the divine channels are clouded today. Please try again, and I shall offer my counsel.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="temple-container max-w-2xl w-full h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gold-main/30">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">⚡</div>
            <div>
              <h3 className="text-lg font-cinzel font-bold text-athena-blue">
                Divine Counsel
              </h3>
              <p className="text-sm text-gray-600">Seek Athena's wisdom</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-athena-blue text-white'
                    : 'bg-gold-main/10 border border-gold-main/30'
                }`}
              >
                <div className="text-sm leading-relaxed">{message.content}</div>
                <div className={`text-xs mt-1 ${
                  message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gold-main/10 border border-gold-main/30 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-athena-blue border-t-transparent"></div>
                  <span className="text-sm text-gray-600">Athena is thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gold-main/30">
          <div className="flex space-x-3">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask Athena for guidance..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-athena-blue resize-none"
              rows={2}
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="altar-button disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
