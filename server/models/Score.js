import mongoose from 'mongoose'

const scoreSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  gameId: { type: String, required: true },
  best: { type: Number, default: 0 },
  last: { type: Number, default: 0 },
  plays: { type: Number, default: 0 },
  lastPlayed: { type: Date, default: Date.now }
}, { timestamps: true })

scoreSchema.index({ userId: 1, gameId: 1 }, { unique: true })

export default mongoose.model('Score', scoreSchema)