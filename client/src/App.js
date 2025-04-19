import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [songs, setSongs] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    suggestedBy: ''
  });

  useEffect(() => {
    fetchSongs();
    const interval = setInterval(fetchSongs, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchSongs = async () => {
    try {
      const res = await axios.get('/api/songs');
      setSongs(res.data);
    } catch (err) {
      console.error('Failed to fetch songs:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/songs', formData);
      setFormData({ title: '', artist: '', suggestedBy: '' });
    } catch (err) {
      alert('Failed to add song: ' + (err.response?.data?.message || err.message));
    }
  };
  
  // Add userId state (generate or get from localStorage)
const [userId] = useState(() => {
  const id = localStorage.getItem('userId') || Math.random().toString(36).substr(2, 9);
  localStorage.setItem('userId', id);
  return id;
});

  const handleVote = async (id) => {
    try {
      const response = await axios.post(`/api/songs/${id}/vote`, { userId });
      setSongs(songs.map(song => 
        song._id === id 
          ? { ...song, votes: response.data.votes } 
          : song
      ));
      
      alert(`Voted! Remaining votes: ${response.data.remainingVotes}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to vote');
    }
  };

  return (
    <div className="app">
      <h1>Party Playlist</h1>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Song title"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          required
        />
        <input
          type="text"
          placeholder="Artist"
          value={formData.artist}
          onChange={(e) => setFormData({...formData, artist: e.target.value})}
          required
        />
        <input
          type="text"
          placeholder="Your name"
          value={formData.suggestedBy}
          onChange={(e) => setFormData({...formData, suggestedBy: e.target.value})}
          required
        />
        <button type="submit">Suggest Song</button>
      </form>

      <div className="song-list">
        {songs.map(song => (
        <div key={song._id}>
          <h3>{song.title} - {song.artist}</h3>
              <p>Votes: {song.votes}</p>
              <button 
                onClick={() => handleVote(song._id)}
                disabled={
                 song.voters?.filter(v => v.userId === userId).length >= 3
               }
             >
                Vote ({3 - (song.voters?.filter(v => v.userId === userId).length || 0)} left)
              </button>
        </div>
      ))}
      </div>
    </div>
  );
}

export default App;