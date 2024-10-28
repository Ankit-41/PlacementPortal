const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const placementRoutes = require('./routes/placementRoutes');

// app.use('/api/placements', placementRoutes); // Ensure this line is included


mongoose.connect("mongodb+srv://andreas:LfHjGecccJXUoIoV@bettingcluster.py1gh.mongodb.net/yourdbname?retryWrites=true&w=majority" , {  })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(4443, () => console.log('Server running on port 3001'));
