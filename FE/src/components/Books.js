import { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Button, 
  FormControl, InputLabel, Select, MenuItem,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Stack
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function Books() {
  const [books, setBooks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const location = useLocation();

  useEffect(() => {
    fetchSubjects();
    // Get subjectId from navigation state
    const subjectId = location.state?.subjectId || '';
    setSelectedSubject(subjectId);
    
    // Fetch books based on subjectId if present
    if (subjectId) {
      fetchBooksBySubject(subjectId);
    } else {
      fetchBooks();
    }
  }, [location.state]);

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

  const fetchBooksBySubject = async (subjectId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/books/subject/${subjectId}`);
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books by subject:', error);
    }
  };

  const handleSubjectChange = async (event) => {
    const subjectId = event.target.value;
    setSelectedSubject(subjectId);
    
    if (subjectId) {
      await fetchBooksBySubject(subjectId);
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

  const handleUpdate = (book) => {
    setSelectedBook(book);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBook(null);
  };

  const handleSaveUpdate = async () => {
    try {
      await axios.put(`http://localhost:3000/api/books/${selectedBook.id}`, selectedBook);
      handleCloseDialog();
      if (selectedSubject) {
        fetchBooksBySubject(selectedSubject);
      } else {
        fetchBooks();
      }
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedBook(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'publishedYear' ? Number(value) : value
    }));
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
                <TableCell>{book.Subject?.name}</TableCell>
                <TableCell>{book.publishedYear}</TableCell>
                <TableCell>{book.quantity}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      onClick={() => handleUpdate(book)}
                    >
                      Update
                    </Button>
                    {/* <Button 
                      variant="contained" 
                      color="error" 
                      onClick={() => handleDelete(book.id)}
                    >
                      Delete
                    </Button> */}
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Update Book</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 2, minWidth: 300 }}>
            <TextField
              label="Title"
              name="title"
              value={selectedBook?.title || ''}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Author"
              name="author"
              value={selectedBook?.author || ''}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="ISBN"
              name="isbn"
              value={selectedBook?.isbn || ''}
              onChange={handleInputChange}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Subject</InputLabel>
              <Select
                value={selectedBook?.Subject?.id || ''}
                name="SubjectId"
                onChange={handleInputChange}
                label="Subject"
              >
                {subjects.map((subject) => (
                  <MenuItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Published Year"
              name="publishedYear"
              type="number"
              value={selectedBook?.publishedYear || ''}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Quantity"
              name="quantity"
              type="number"
              value={selectedBook?.quantity || ''}
              onChange={handleInputChange}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveUpdate} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Books;