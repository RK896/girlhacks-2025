import mongoose from 'mongoose'

const journalEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  journalText: {
    type: String,
    required: [true, 'Journal text is required'],
    trim: true
  },
  azureAnalysis: {
    sentiment: {
      type: String,
      enum: ['positive', 'negative', 'neutral'],
      required: true
    },
    confidenceScores: {
      positive: {
        type: Number,
        required: true,
        min: 0,
        max: 1
      },
      neutral: {
        type: Number,
        required: true,
        min: 0,
        max: 1
      },
      negative: {
        type: Number,
        required: true,
        min: 0,
        max: 1
      }
    }
  },
  athenaResponse: {
    type: String,
    required: [true, 'Athena response is required'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// Index for efficient queries
journalEntrySchema.index({ userId: 1, createdAt: -1 })

export default mongoose.models.JournalEntry || mongoose.model('JournalEntry', journalEntrySchema)
