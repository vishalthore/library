const express = require('express');
const router = express.Router();
const { Subject } = require('../models');

// Get all subjects
router.get('/', async (req, res) => {
  try {
    const subjects = await Subject.findAll();
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new subject
router.post('/', async (req, res) => {
  try {
    const newSubject = await Subject.create({
      name: req.body.name,
      description: req.body.description
    });
    res.status(201).json(newSubject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;