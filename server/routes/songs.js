const express = require('express');
const router = express.Router();
const Song = require('../models/Song');

// Get all unplayed songs sorted by votes
router.get('/', async (req, res) => {
  try {
    const songs = await Song.find({ played: false }).sort({ votes: -1 });
    res.json(songs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new song
router.post('/', async (req, res) => {
  const { title, artist, suggestedBy } = req.body;
  
  try {
    // Check for duplicates
    const existingSong = await Song.findOne({ 
      title: new RegExp(`^${title}$`, 'i'), 
      artist: new RegExp(`^${artist}$`, 'i'),
      played: false
    });
    
    if (existingSong) {
      return res.status(400).json({ message: 'Song already in queue' });
    }
    
    const newSong = new Song({ title, artist, suggestedBy });
    await newSong.save();
    res.status(201).json(newSong);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Vote for song
// POST /api/songs/:id/vote
router.post('/:id/vote', async (req, res) => {
  try {
    const { userId } = req.body; // Client must send userId
    const song = await Song.findById(req.params.id);

    if (!song) return res.status(404).json({ message: 'Song not found' });

    // Check if user already voted 3 times
    const userVotes = song.voters.filter(v => v.userId === userId).length;
    if (userVotes >= 3) {
      return res.status(400).json({ 
        message: 'You can only vote 3 times for this song',
        remainingVotes: 0
      });
    }

    // Add vote
    song.voters.push({ userId });
    song.votes = song.voters.length;
    await song.save();

    res.json({
      votes: song.votes,
      remainingVotes: 3 - (userVotes + 1)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;