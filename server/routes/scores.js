import express from 'express'
import { requireAuth } from '../middleware/auth.js'
import Score from '../models/Score.js'

const router = express.Router()

// get all scores for logged-in user
router.get('/', requireAuth, async (req, res) => {
  const scores = await Score.find({ userId: req.userId })
  const map = {}
  scores.forEach(s => {
    map[s.gameId] = { best: s.best, last: s.last, plays: s.plays, lastPlayed: s.lastPlayed }
  })
  res.json(map)
})

// upsert a single game score
router.post('/:gameId', requireAuth, async (req, res) => {
  const { gameId } = req.params
  const { score } = req.body
  if (typeof score !== 'number') return res.status(400).json({ error: 'score must be a number' })

  const existing = await Score.findOne({ userId: req.userId, gameId })
  const best = existing ? Math.max(existing.best, score) : score
  const plays = existing ? existing.plays + 1 : 1

  const updated = await Score.findOneAndUpdate(
    { userId: req.userId, gameId },
    { best, last: score, plays, lastPlayed: new Date() },
    { upsert: true, new: true }
  )
  res.json(updated)
})

// bulk sync — called once on login to merge localStorage scores into DB
router.post('/sync', requireAuth, async (req, res) => {
  const { scores } = req.body // { gameId: { best, last, plays, lastPlayed } }
  if (!scores || typeof scores !== 'object') return res.status(400).json({ error: 'Invalid payload' })

  const results = {}
  for (const gameId of Object.keys(scores)) {
    const incoming = scores[gameId]
    const existing = await Score.findOne({ userId: req.userId, gameId })
    const best = Math.max(existing?.best || 0, incoming.best || 0)
    const plays = (existing?.plays || 0) + (incoming.plays || 0)
    const updated = await Score.findOneAndUpdate(
      { userId: req.userId, gameId },
      { best, last: incoming.last || best, plays, lastPlayed: new Date() },
      { upsert: true, new: true }
    )
    results[gameId] = updated
  }
  res.json(results)
})

export default router