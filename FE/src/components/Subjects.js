import { useState, useEffect } from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box,
  CardActionArea
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/subjects');
      // Get book counts for each subject
      const subjectsWithCounts = await Promise.all(
        response.data.map(async (subject) => {
          const booksResponse = await axios.get(`http://localhost:3000/api/books/subject/${subject.id}`);
          return {
            ...subject,
            bookCount: booksResponse.data.length
          };
        })
      );
      setSubjects(subjectsWithCounts);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const handleCardClick = (subjectId) => {
    navigate('/Books', { state: { subjectId } });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Subjects
      </Typography>
      <Grid 
        container 
        spacing={3}
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)'
          },
          gap: 3,
          alignItems: 'stretch'
        }}
      >
        {subjects.map((subject) => (
          <Card 
            key={subject.id}
            sx={{ 
              height: '100%',
              minHeight: 200,
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: 3
              }
            }}
          >
            <CardActionArea 
              onClick={() => handleCardClick(subject.id)}
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                justifyContent: 'flex-start'
              }}
            >
              <CardContent sx={{ 
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <Box>
                  <Typography variant="h5" component="div" gutterBottom>
                    {subject.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {subject.description}
                  </Typography>
                </Box>
                <Typography variant="subtitle1" color="primary">
                  {subject.bookCount} {subject.bookCount === 1 ? 'Book' : 'Books'}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Grid>
    </Box>
  );
}

export default Subjects;