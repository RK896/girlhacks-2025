'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const features = [
    {
      icon: '🧠',
      title: 'Azure AI Analysis',
      description: 'Advanced sentiment analysis powered by Microsoft Azure Cognitive Services'
    },
    {
      icon: '⚡',
      title: 'Athena\'s Oracle',
      description: 'Divine wisdom and counsel from Google\'s Gemini AI in Athena\'s voice'
    },
    {
      icon: '📜',
      title: 'Sacred Archives',
      description: 'Secure, real-time storage of your journal entries with Firebase'
    },
    {
      icon: '🏛️',
      title: 'Temple Aesthetics',
      description: 'Beautiful Greek temple-inspired design for a divine experience'
    }
  ]

  const testimonials = [
    {
      text: "Athena's Journal has transformed my daily reflection practice. The AI responses feel truly divine.",
      author: "Sarah M.",
      role: "Meditation Teacher"
    },
    {
      text: "The sentiment analysis helps me understand my emotions better. It's like having a wise counselor.",
      author: "Michael R.",
      role: "Life Coach"
    },
    {
      text: "The beautiful design makes journaling feel like a sacred ritual. I look forward to it every day.",
      author: "Elena K.",
      role: "Yoga Instructor"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-marble-light via-white to-marble-dark">
      {/* Navigation */}
      <nav className="relative z-50 bg-white/90 backdrop-blur-md border-b border-gold-main/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-cinzel font-bold text-athena-blue">🏛️ Athena's Journal</span>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#features" className="text-gray-700 hover:text-athena-blue transition-colors">Features</a>
                <a href="#testimonials" className="text-gray-700 hover:text-athena-blue transition-colors">Testimonials</a>
                <a href="#about" className="text-gray-700 hover:text-athena-blue transition-colors">About</a>
              </div>
            </div>

            <div className="hidden md:block">
              <Link href="/" className="altar-button text-sm">
                Enter the Temple
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-athena-blue"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gold-main/20">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#features" className="block px-3 py-2 text-gray-700 hover:text-athena-blue">Features</a>
              <a href="#testimonials" className="block px-3 py-2 text-gray-700 hover:text-athena-blue">Testimonials</a>
              <a href="#about" className="block px-3 py-2 text-gray-700 hover:text-athena-blue">About</a>
              <Link href="/" className="block px-3 py-2">
                <span className="altar-button text-sm w-full text-center">Enter the Temple</span>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-cinzel font-bold text-athena-blue mb-8 leading-tight">
            Where Ancient Wisdom
            <br />
            <span className="text-gold-main">Meets Modern AI</span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed">
            Experience divine journaling with Athena, the goddess of wisdom. 
            Share your thoughts and receive counsel powered by cutting-edge AI technology.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link href="/" className="altar-button text-lg px-12 py-4">
              🔮 Begin Your Journey
            </Link>
            <a href="#features" className="text-athena-blue hover:text-gold-main transition-colors font-semibold">
              Learn More ↓
            </a>
          </div>

          {/* Hero Image/Visual */}
          <div className="relative max-w-4xl mx-auto">
            <div className="temple-container p-12 text-center">
              <div className="text-8xl mb-6">🏛️</div>
              <h3 className="text-2xl font-cinzel text-athena-blue mb-4">The Sacred Temple Awaits</h3>
              <p className="text-gray-600 text-lg">
                Step into a world where technology serves ancient wisdom, 
                and every journal entry becomes a divine conversation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-cinzel font-bold text-athena-blue mb-6">
              Divine Features
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Experience the perfect blend of ancient wisdom and modern technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="temple-container p-8 text-center hover:scale-105 transition-transform duration-300">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-cinzel font-semibold text-athena-blue mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-cinzel font-bold text-athena-blue mb-6">
              The Sacred Ritual
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Three simple steps to divine wisdom
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gold-main rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                1
              </div>
              <h3 className="text-2xl font-cinzel font-semibold text-athena-blue mb-4">
                Share Your Thoughts
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Write your deepest thoughts, fears, hopes, and dreams in the sacred altar.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-athena-blue rounded-full flex items-center justify-center mx-auto mb-6 text-3xl text-white">
                2
              </div>
              <h3 className="text-2xl font-cinzel font-semibold text-athena-blue mb-4">
                AI Analysis
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Azure AI analyzes your emotions while Gemini crafts Athena's divine response.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl text-white">
                3
              </div>
              <h3 className="text-2xl font-cinzel font-semibold text-athena-blue mb-4">
                Receive Wisdom
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Get personalized counsel from Athena and store your journey in the sacred archives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-cinzel font-bold text-athena-blue mb-6">
              Voices of the Faithful
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Hear from those who have found wisdom through Athena's Journal
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="temple-container p-8">
                <p className="text-gray-700 italic mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div className="border-t border-gold-main/20 pt-4">
                  <p className="font-semibold text-athena-blue">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-cinzel font-bold text-athena-blue mb-6">
            Ready to Begin Your Divine Journey?
          </h2>
          <p className="text-xl text-gray-700 mb-12 leading-relaxed">
            Join thousands who have found wisdom, clarity, and peace through Athena's Journal.
          </p>
          <Link href="/" className="altar-button text-xl px-16 py-6">
            🏛️ Enter the Sacred Temple
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-athena-blue text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-3xl font-cinzel font-bold mb-4">🏛️ Athena's Journal</div>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Where ancient wisdom meets modern AI. Built with Next.js, Firebase, Azure AI, and Gemini.
          </p>
          <div className="border-t border-gold-main/30 pt-8">
            <p className="text-gray-400">
              © 2025 Athena's Journal. Built for GirlHacks 2025. May wisdom guide your path.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
