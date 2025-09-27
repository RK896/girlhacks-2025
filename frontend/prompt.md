# Project: Athena's Journal

## 1. Project Overview

### Elevator Pitch
Athena's Journal is a conversational, AI-powered web application designed to transform self-reflection from a monologue into a supportive dialogue, helping users build a consistent and meaningful mental wellness habit.

### The Problem It Solves
- **Inconsistency:** It's difficult for users to maintain a daily journaling habit.
- **"Blank Page" Syndrome:** Users often don't know what to write or how to explore their thoughts deeply.
- **Passive Experience:** Traditional journaling is a solitary activity that lacks the guidance that can lead to insight.

### The Solution
We are building a web app that proactively engages users with email prompts. The core of the app is a conversational AI named "Athena" that asks insightful, open-ended questions in real-time based on the user's entries, creating a guided and supportive reflection experience.

## 2. Core Features (Hackathon MVP)

- **User Authentication:** Users can sign up and log in with an email and password.
- **Onboarding & Settings:** A simple onboarding flow where users can set their preferred time for a daily email reminder.
- **Email Notifications:** A backend service that sends a daily email prompt at the user's chosen time.
- **Conversational Journal UI:** A clean, chat-like interface for writing entries and receiving AI responses.
- **Hybrid AI Engine:** A sophisticated backend that uses both Azure AI and Gemini for analysis and response generation.
- **Calender feature:** There is a calender where the user can see when they made an entry and how many they made that they. This can also be used to track streaks, how many positoive/negative/nuetral entries there are, and more. 
- **Journal History:** A view where users can read their past conversational sessions.
- **Speech Recongition:** Instead of typing out their jounral entry, they could talk it out. Using an another model to analyze verbal cues in speech, as well azure for sentiment analysis from solely text, these two would provide Gemini a deep understanding so it can create a good response
## 3. User Flow

1.  **Sign Up:** A new user signs up on the website with their email and password.
2.  **Onboarding:** They are prompted to set a daily reflection time (e.g., 9 PM).
3.  **Notification:** At 9 PM, the user receives an email with a reflective prompt and a link to their journal.
4.  **Interaction:** The user clicks the link, logs in, and is taken to a new journal entry page. They write their thoughts.
5.  **AI Conversation:** After submitting their entry, "Athena" (powered by Gemini) replies with a gentle, insightful question. This back-and-forth conversation continues as long as the user wishes.
6.  **History:** The entire conversation is saved and can be reviewed later in their journal history.

## 4. Technical Architecture

### Tech Stack
- **Frontend:** React with a CSS framework Tailwind CSS.
- **Backend:** Node.js with Express.js.
- **Database:** MongoDB.
- **AI Services:**
    - **Analysis:** Azure AI Language Service
    - **Conversation:** Google's Gemini API
- **Email Service:** SendGrid (or Mailgun/Resend).
- **Deployment:** Vercel/Netlify for Frontend, Heroku/Render/Azure App Service for Backend.

### System Architecture & Data Flow

This project uses a hybrid AI model to leverage the strengths of two different platforms.

```mermaid
sequenceDiagram
    participant User as User (Browser)
    participant Frontend
    participant Backend as Backend Server
    participant Azure as Azure AI
    participant Gemini as Gemini AI
    participant DB as MongoDB

    User->>Frontend: Writes journal entry
    Frontend->>Backend: POST /api/journal/entry with text
    Backend->>Azure: 1. Analyze text (sentiment, key phrases)
    Azure-->>Backend: Return JSON analysis
    Backend->>Gemini: 2. Send enriched prompt (text + analysis)
    Gemini-->>Backend: Return conversational response
    Backend->>DB: 3. Save full interaction (entry, analysis, response)
    DB-->>Backend: Confirm save
    Backend-->>Frontend: Return Athena's response
    Frontend->>User: Display Athena's response