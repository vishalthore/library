import { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Button, 
  FormControl, InputLabel, Select, MenuItem 
} from '@mui/material';
import axios from 'axios';

function Books() {
  const [books, setBooks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');

  useEffect(() => {
    fetchBooks();
    fetchSubjects();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/books');
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/subjects');
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const handleSubjectChange = async (event) => {
    const subjectId = event.target.value;
    setSelectedSubject(subjectId);
    
    if (subjectId) {
      try {
        const response = await axios.get(`http://localhost:3000/api/books/subject/${subjectId}`);
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books by subject:', error);
      }
    } else {
      fetchBooks();
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/books/${id}`);
      fetchBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  return (
    <div>
      <FormControl style={{ marginBottom: '1rem', minWidth: 200 }}>
        <InputLabel>Filter by Subject</InputLabel>
        <Select
          value={selectedSubject}
          onChange={handleSubjectChange}
        >
          <MenuItem value="">All Subjects</MenuItem>
          {subjects.map((subject) => (
            <MenuItem key={subject.id} value={subject.id}>
              {subject.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>ISBN</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Published Year</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books.map((book) => (
              <TableRow key={book.id}>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.isbn}</TableCell>
                <TableCell>{book.subject?.name}</TableCell>
                <TableCell>{book.publishedYear}</TableCell>
                <TableCell>{book.quantity}</TableCell>
                <TableCell>
                  <Button 
                    variant="contained" 
                    color="error" 
                    onClick={() => handleDelete(book.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Books;