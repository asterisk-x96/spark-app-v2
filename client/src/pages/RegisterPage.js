import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Container, Typography, Divider, Stack, Button } from '@mui/material';
// hooks
import useResponsive from '../hooks/useResponsive';
// components
import Logo from '../components/logo';
import Iconify from '../components/iconify';
// sections
import { RegisterForm, RegisterDetails } from '../sections/auth/register';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
})); 

const StyledSection = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 480,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  boxShadow: theme.customShadows.card,
  backgroundColor: theme.palette.background.default,
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function RegisterPage() {
  const mdUp = useResponsive('up', 'md');


  const [showRegisterForm, setShowRegisterForm] = useState(true)
  const [showRegisterDetails, setShowRegisterDetails   ] = useState(false);
  const [email, setEmail] = useState('');

  const handleShowRegisterDetails = (email) => {
      setEmail(email);
      setShowRegisterForm(false);
      setShowRegisterDetails(true);
  }

  return (
    <>
      <Helmet>
        <title> Sign Up | Spark </title>
      </Helmet>

      <StyledRoot>
        <Logo
          sx={{
            position: 'fixed',
            top: { xs: 16, sm: 24, md: 40 },
            left: { xs: 16, sm: 24, md: 40 },
          }}
        />

        {mdUp && (
          <StyledSection>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              Welcome
            </Typography>
            <img src="/assets/illustrations/illustration_register.png" alt="login" />
          </StyledSection>
        )}

        <Container maxWidth="sm">
          <StyledContent>
            {showRegisterForm && <RegisterForm onShowRegisterDetails={handleShowRegisterDetails} />}
            {showRegisterDetails && <RegisterDetails email={email} />}
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}