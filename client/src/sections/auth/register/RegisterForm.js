import { useState } from 'react';
// @mui
import { Link, Stack, Button, TextField, Typography, Divider } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';
// ----------------------------------------------------------------------

export default function RegisterForm({ onShowRegisterDetails }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
      try {
        // Send a GET request to check if the email exists in the database
        const response = await fetch(`http://localhost:5000/api/user/check-email/${email}`);
        const data = await response.json();
  
        // If the email exists, show an error message
        if (data.exists) {
          setError('Email already exists. Please use a different email.');
        } else {
          // If the email does not exist, proceed to the next screen
          onShowRegisterDetails(email);
        }
      } catch (error) {
        console.error('Error checking email:', error);
        setError('An error occurred while checking email. Please try again later.');
      }
    };


  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h4" gutterBottom>
        Register to Spark
      </Typography>

      <Typography variant="body2" sx={{ mb: 5 }}>
        Already have an account? {''}
        <Link href="/login" variant="subtitle2">Log In</Link>
      </Typography>

      <Stack direction="row" spacing={2}>
        <Button
          fullWidth
          size="large"
          color="inherit"
          variant="outlined"
          startIcon={<Iconify icon="eva:google-fill" color="#DF3E30" width={22} height={22} spacing={2} />}
        >
          <Typography variant="body2" sx={{ color: '#000000', fontWeight: 'medium' }}>
            Sign Up with Google
          </Typography>
        </Button>
      </Stack>

      <Divider sx={{ my: 3 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          OR
        </Typography>
      </Divider>

      <Stack spacing={3} sx={{ my: 3 }}>
        <TextField
          name="email"
          label="Email address"
          onChange={(event) => {
            setEmail(event.target.value);
            setError(null); // Clear any previous error message when the user types a new email
          }}
          error={Boolean(error)}
          helperText={error}
        />
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained">
        Sign Up
      </LoadingButton>
    </form>
  );
}
