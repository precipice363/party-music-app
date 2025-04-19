require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
//require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

//Connect to MongoDB ***
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));


//Routes
app.get('/', (req, res) => res.send('API Running'));
app.use('/api/songs', require('./routes/songs'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
