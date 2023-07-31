import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Link, Stack, Button, TextField, Typography, Divider } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';
// ----------------------------------------------------------------------

export default function RegisterForm( {onShowRegisterDetails} ) {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');


  const handleSubmit = (event) => {
    event.preventDefault();
    onShowRegisterDetails(email);
  }

  return (
    <form onSubmit={handleSubmit}>
        <Typography variant="h4" gutterBottom>
          Register to Spark
        </Typography>

        <Typography variant="body2" sx={{ mb: 5 }}>
          Already have an account? {''}
          <Link variant="subtitle2">Log In</Link>
        </Typography>

        <Stack direction="row" spacing={2}>
          <Button fullWidth size="large" color="inherit" variant="outlined" startIcon={<Iconify icon="eva:google-fill" color="#DF3E30" width={22} height={22} spacing={2} />} >
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
          onChange={(event) => {setEmail(event.target.value)}} />
        </Stack>

        <LoadingButton fullWidth size="large" type="submit" variant="contained">
          Sign Up
        </LoadingButton>
    </form>
  );
}
