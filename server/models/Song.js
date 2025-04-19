const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const SongSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  votes: { type: Number, default: 0 },
  voters: [voteSchema], // Track who voted
  suggestedBy: { type: String, required: true },
  played: { type: Boolean, default: false }
});

module.exports = mongoose.model('Song', SongSchema);