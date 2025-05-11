import { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddSubject() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/subjects', formData);
      navigate('/subjects');
    } catch (error) {
      console.error('Error adding subject:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Add New Subject
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          multiline
          rows={4}
        />
        <Button 
          type="submit" 
          variant="contained" 
          color="primary"
          style={{ marginTop: '1rem' }}
        >
          Add Subject
        </Button>
      </form>
    </Box>
  );
}

export default AddSubject;