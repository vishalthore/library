const express = require('express');
const router = express.Router();
const { Book, Subject } = require('../models');

// Get all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.findAll({
      include: [Subject]
    });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get books by subject
router.get('/subject/:subjectId', async (req, res) => {
  try {
    const books = await Book.findAll({
      where: { subjectId: req.params.subjectId },
      include: [Subject]
    });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new book
router.post('/', async (req, res) => {
  try {
    const newBook = await Book.create({
      title: req.body.title,
      author: req.body.author,
      subjectId: req.body.subjectId,
      isbn: req.body.isbn,
      publishedYear: req.body.publishedYear,
      quantity: req.body.quantity
    });
    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Remove a book
router.delete('/:id', async (req, res) => {
  try {
    await Book.destroy({
      where: { id: req.params.id }
    });
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;