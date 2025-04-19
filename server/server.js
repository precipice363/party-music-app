require('dotenv').config({
  path: process.env.DOTENV_PATH || '.env'
});
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();
app.use(cors());
app.use(express.json());
app.get('/api/healthz', (req, res) => {
  res.status(200).send('OK');
});

//Connect to MongoDB ***
mongoose.connect(process.env.MONGODB_URI, {
  retryWrites: true,
  w: 'majority'
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));
//Routes
app.get('/', (req, res) => res.send('API Running'));
app.use('/api/songs', require('./routes/songs'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
