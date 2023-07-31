  import { useState } from 'react';
  import { useNavigate } from 'react-router-dom';
  // @mui
  import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox, Typography } from '@mui/material';
  import { LoadingButton } from '@mui/lab';
  // components
  import Iconify from '../../../components/iconify';
  


  // ----------------------------------------------------------------------

  export default function LoginForm() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
    //  navigate('/dashboard', { replace: true });
      event.preventDefault();
      
      try {

        const userData = {
          email,
          password,
        };
        
        const response = await fetch('http://localhost:5000/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData), // Verify the userData object contains email and password.
        });

        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage);
        }

        const loginData = await response.json();
        const authToken = loginData.token;

        localStorage.setItem('authToken', authToken);

        // Redirect user to the dashboard
        navigate('/dashboard', { replace: true });
    
      } catch (error) {
      // Handle login error
      console.error('Error logging in user:', error.message);
    }
  };

    return (
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField 
            name="email" 
            label="Email address" 
            onChange={(event) => setEmail(event.target.value)} />

          <TextField
            name="password"
            label="Password"  
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            onChange={(event) => setPassword(event.target.value)}
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="flex-start" sx={{ my: 2 }}>
            <Checkbox name="remember" label="Remember me" />
            <Typography variant="body2" sx={{ color: '#000000', fontWeight: 'normal' }}>
                Remember Me
            </Typography>
          </Stack>
          <Link variant="subtitle2" underline="hover">
            Forgot password?
          </Link>
    
        </Stack>

        <LoadingButton fullWidth size="large" type="submit" variant="contained">
          Login
        </LoadingButton>
      </form>
    );
  }
 