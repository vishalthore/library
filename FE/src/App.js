import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from '@mui/material';
import Navbar from './components/Navbar';
import Books from './components/Books';
import Subjects from './components/Subjects';
import AddBook from './components/AddBook';
import AddSubject from './components/AddSubject';
import Login from './components/Login';

function App() {
  const isAuthenticated = () => !!localStorage.getItem('token');

  const PrivateRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Navbar />
      <Container style={{ marginTop: '2rem' }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <PrivateRoute>
              <Books />
            </PrivateRoute>
          } />
          <Route path="/subjects" element={
            <PrivateRoute>
              <Subjects />
            </PrivateRoute>
          } />
          <Route path="/add-book" element={
            <PrivateRoute>
              <AddBook />
            </PrivateRoute>
          } />
          <Route path="/add-subject" element={
            <PrivateRoute>
              <AddSubject />
            </PrivateRoute>
          } />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;