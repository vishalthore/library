import { useState, useEffect } from 'react';
import { 
  TextField, Button, FormControl, 
  InputLabel, Select, MenuItem, 
  Box, Typography, Alert, 
  FormHelperText
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddBook() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    publishedYear: '',
    quantity: 1,
    subjectId: ''
  });

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/subjects');
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      setSubmitError('Failed to fetch subjects. Please try again.');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Title validation
    if (formData.title.trim().length < 2) {
      newErrors.title = 'Title must be at least 2 characters long';
    }
    
    // Author validation
    if (formData.author.trim().length < 2) {
      newErrors.author = 'Author name must be at least 2 characters long';
    }
    
    // ISBN validation (basic format: 13 digits)
    const isbnRegex = /^(?:\d{13}|\d{10})$/;
    if (!isbnRegex.test(formData.isbn.replace(/-/g, ''))) {
      newErrors.isbn = 'ISBN must be 10 or 13 digits';
    }
    
    // Published Year validation
    const currentYear = new Date().getFullYear();
    if (formData.publishedYear) {
      const year = parseInt(formData.publishedYear);
      if (year < 1800 || year > currentYear) {
        newErrors.publishedYear = `Year must be between 1800 and ${currentYear}`;
      }
    }
    
    // Quantity validation
    if (formData.quantity < 1) {
      newErrors.quantity = 'Quantity must be at least 1';
    }
    
    // Subject validation
    if (!formData.subjectId) { 
      newErrors.subjectId = 'Please select a subject';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      [name]: value
    };
    setFormData(newFormData);

    // Validate the specific field that changed
    const newErrors = {};
    switch (name) {
      case 'title':
        if (value.trim().length < 2) {
          newErrors[name] = 'Title must be at least 2 characters long';
        }
        break;
      case 'author':
        if (value.trim().length < 2) {
          newErrors[name] = 'Author name must be at least 2 characters long';
        }
        break;
      case 'isbn':
        const isbnRegex = /^(?:\d{13}|\d{10})$/;
        if (!isbnRegex.test(value.replace(/-/g, ''))) {
          newErrors[name] = 'ISBN must be 10 or 13 digits';
        }
        break;
      case 'publishedYear':
        const currentYear = new Date().getFullYear();
        if (value) {
          const year = parseInt(value);
          if (year < 1800 || year > currentYear) {
            newErrors[name] = `Year must be between 1800 and ${currentYear}`;
          }
        }
        break;
      case 'quantity':
        if (parseInt(value) < 1) {
          newErrors[name] = 'Quantity must be at least 1';
        }
        break;
      case 'subjectId':
        if (!value) {
          newErrors[name] = 'Please select a subject';
        }
        break;
      default:
        break;
    }

    setErrors(prev => ({
      ...prev,
      [name]: newErrors[name] || ''
    }));
  };

  const handleSubmit = async (e) => {
    // e.preventDefault();
    // setSubmitError('');

    if (!validateForm()) {
      return;
    }

    try {
      await axios.post('http://localhost:3000/api/books', formData);
      navigate('/');
    } catch (error) {
      console.error('Error adding book:', error);
      setSubmitError(error.response?.data?.message || 'Failed to add book. Please try again.');
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Add New Book
      </Typography>
      {submitError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {submitError}
        </Alert>
      )}
      {/* <form onSubmit={handleSubmit}> */}
        <TextField
          fullWidth
          margin="normal"
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          error={!!errors.title}
          helperText={errors.title}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Author"
          name="author"
          value={formData.author}
          onChange={handleChange}
          required
          error={!!errors.author}
          helperText={errors.author}
        />
        <TextField
          fullWidth
          margin="normal"
          label="ISBN"
          name="isbn"
          value={formData.isbn}
          onChange={handleChange}
          required
          error={!!errors.isbn}
          helperText={errors.isbn || 'Enter 10 or 13 digit ISBN number'}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Published Year"
          name="publishedYear"
          type="number"
          value={formData.publishedYear}
          onChange={handleChange}
          error={!!errors.publishedYear}
          helperText={errors.publishedYear}
          inputProps={{
            min: 1800,
            max: new Date().getFullYear()
          }}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Quantity"
          name="quantity"
          type="number"
          value={formData.quantity}
          onChange={handleChange}
          error={!!errors.quantity}
          helperText={errors.quantity}
          inputProps={{
            min: 1
          }}
        />
        <FormControl fullWidth margin="normal" error={!!errors.subjectId}>
          <InputLabel>Subject</InputLabel>
          <Select
            name="subjectId"
            value={formData.subjectId}
            onChange={handleChange}
            required
          >
            {subjects.map((subject) => (
              <MenuItem key={subject.id} value={subject.id}>
                {subject.name}
              </MenuItem>
            ))}
          </Select>
          {errors.subjectId && (
            <FormHelperText error>{errors.subjectId}</FormHelperText>
          )}
        </FormControl>
        <Button 
          type="submit" 
          variant="contained" 
          color="primary"
          onClick={handleSubmit}
          style={{ marginTop: '1rem' }}
        >
          Add Book
        </Button>
      {/* </form> */}
    </Box>
  );
}

export default AddBook;