// RegisterDetails.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Stack, TextField, InputAdornment, IconButton, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';
// user context
import { useUserContext } from '../../../UserContext';
// ----------------------------------------------------------------------

export default function RegisterDetails( {email} ) {
  const { user, setUser } = useUserContext();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [emailFinal, setEmailFinal] = useState(email);
  const [showPassword, setShowPassword] = useState(false);
  const [showReenterPassword, setShowReenterPassword] = useState(true)

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Prepare the user data you want to send
      const userData = {
        first_name: firstName,
        last_name: lastName,
        email: emailFinal,
        password,
      };

      // Send a POST request to the backend
      const response = await fetch('http://localhost:5000/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      // Registration success
      const responseData = await response.json();

      
      console.log('Response Data:', responseData);

      console.log('Before setUser:', user);

      setUser((prevState) => ({
        ...prevState,
        firstName: responseData.first_name,
        lastName: responseData.last_name,
      }));

      console.log('After setUser:', user);

      navigate('/welcome', { replace : true });

  
      // You can handle success behavior here, like showing a success message or navigating to a different page.
    } catch (error) {
      // Handle registration error
      console.error('Error registering user:', error.message);
    }
  }



  return (
    <form onSubmit={handleSubmit}>
      <h1>Let's Go!</h1>
      <Stack spacing={3} sx={{ my: 3 }}>
      <TextField
          label="First name"
          placeholder="Jane"
          onChange={(event) => {setFirstName(event.target.value)}}
        />
        <TextField
          label="Last name"
          placeholder="Doe"
          onChange={(event) => {setLastName(event.target.value)}}
        />
        <TextField
          label="Email"
          defaultValue={email}
          onChange={(event) => {setEmailFinal(event.target.value)}}
        />
        <TextField
            name="Password"
            label="Password"  
            type={showPassword ? 'text' : 'password'}
            onChange={(event) => {setPassword(event.target.value)}}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        <TextField
            name="Re-enter password"
            label="Re-enter password"  
            type={showReenterPassword ? 'password' : 'text'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowReenterPassword(!showReenterPassword)} edge="end" />
                </InputAdornment>
              ),
            }}
          />
    </Stack>
      <LoadingButton fullWidth size="large" type="submit" variant="contained">
        Sign Up with Spark
      </LoadingButton>

    </form>
  );
}