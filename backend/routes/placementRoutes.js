const express = require('express');
const router = express.Router();
const PlacementData = require('../models/placement');

// GET a limited number of placements
router.get('/', async (req, res) => {
  try {
    console.log('Fetching data from database...');
    const limit = parseInt(req.query.limit) || 20; // Default to 100 if not provided
    const placements = await PlacementData.find().limit(limit); // Fetch limited number of documents
    console.log('Data retrieved:', placements);

    if (placements.length === 0) {
      console.log('No documents found');
    }

    res.json(placements);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ message: err.message });
  }
});

// Unified Search and Filter Route
router.get('/filter', async (req, res) => {
  const { discipline, degree, accepted, session, companyName,PPO, name, enrolmentNo, limit = 20, page = 1 } = req.query;

  const filters = {};

  if (discipline) {
    // Exact match using regex to ensure case-insensitivity
    filters.discipline = {
      $in: discipline.split(',').map(d => new RegExp(`\\(?${d.trim()}\\)?`, 'i'))
    };
  }

  if (degree) {
    filters.degree = {
      $in: degree.split(',').map(d => d.trim())
    };
  }

  if (accepted) {
    filters.accepted = {
      $in: accepted.split(',').map(a => a.trim())
    };
  }

  if (session) {
    filters.session = {
      $in: session.split(',').map(s => s.trim())
    };
  }

  if (companyName) {
    // Partial match for company names
    filters.companyName = {
      $in: companyName.split(',').map(c => new RegExp(c.trim(), 'i'))
    };
  }
  if (PPO) {
    filters.PPO = {
      $in: PPO.split(',').map(a => a.trim())
    };
  }

  if (name) {
    // Partial, case-insensitive match for names
    filters.name = new RegExp(name.trim(), 'i');
  }

  if (enrolmentNo) {
    // Partial match from the start for enrolment numbers
    filters.enrolmentNo = new RegExp(`^${enrolmentNo.trim()}`, 'i');
  }
  try {
    const total = await PlacementData.countDocuments(filters);
    const results = await PlacementData.find(filters)
      .limit(Number(limit))
      .skip(Number(limit) * (Number(page) - 1));
    res.json({ data: results, total, page, limit });
  } catch (error) {
    console.error('Error fetching filter results:', error);
    res.status(500).send('Server error');
  }
});


module.exports = router;
