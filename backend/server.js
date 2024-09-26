const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const placementRoutes = require('./routes/placementRoutes');

app.use('/api/placements', placementRoutes); // Ensure this line is included


mongoose.connect(process.env.MONGODB_URI, {  })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(3001, () => console.log('Server running on port 3001'));
