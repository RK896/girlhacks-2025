/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017',
    MONGODB_DB: process.env.MONGODB_DB || 'athenas-journal',
    AZURE_AI_KEY: process.env.AZURE_AI_KEY || '',
    AZURE_AI_ENDPOINT: process.env.AZURE_AI_ENDPOINT || 'https://athena1.cognitiveservices.azure.com/',
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  },
}

module.exports = nextConfig

