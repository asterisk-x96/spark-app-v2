import { useState } from 'react';
// @mui
import { Stack, TextField, Typography, Button, Divider } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Logo from '../components/logo';
import Iconify from '../components/iconify';

import { useUserContext } from '../UserContext';


// ----------------------------------------------------------------------

export default function ProfilePage() {


  const { user } = useUserContext();

  return (
    <form>
      <Typography variant="h3" sx={{ px: 0, mt: 5 }}>
        {user.firstName} {user.lastName}
      </Typography>
    


    </form>
  );
}
