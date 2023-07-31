import { Helmet } from 'react-helmet-async';
import { Button, Container } from '@mui/material';
import Iconify from '../components/iconify';

export default function TestData() {
  const handleNewPostClick = () => {
    const titleContent = {
      title: 'Sample Title',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    };

    fetch('http://localhost:5000/api/sample-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(titleContent),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // Optional: Handle the response data
      })
      .catch((error) => {
        console.error('Error saving sample data:', error);
      });
  };

  return (
    <>
      <Helmet>
        <title>Test</title>
      </Helmet>
      <Container>
        <Button
          onClick={handleNewPostClick}
          sx={{
            position: 'fixed',
            top: { xs: 16, sm: 24, md: 40 },
            left: { xs: 16, sm: 24, md: 40 }, 
          }}
          variant="contained"
          startIcon={<Iconify icon="eva:plus-fill" />}
        >
          New Post
        </Button>
      </Container>
    </>
  );
}