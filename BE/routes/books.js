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

// Update a book
router.put('/:id', async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    await book.update({
      title: req.body.title,
      author: req.body.author,
      subjectId: req.body.SubjectId,
      isbn: req.body.isbn,
      publishedYear: req.body.publishedYear,
      quantity: req.body.quantity
    });

    const updatedBook = await Book.findByPk(req.params.id, {
      include: [Subject]
    });

    res.json(updatedBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;