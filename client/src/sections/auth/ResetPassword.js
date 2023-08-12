import React, { useState } from 'react';
import bcrypt from 'bcryptjs'; // Import bcryptjs library

import { TextField, Button, Container, Typography, Box, Stack } from '@mui/material';
import useGetCurrentUserDetails from '../../api/useGetCurrentUserDetails';

export default function ResetPasswordPage() {
  const currentUser = useGetCurrentUserDetails();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const userId = currentUser.id;

  const handleResetPassword = async () => {
    try {
      const hashedCurrentPassword = await bcrypt.hash(currentPassword, 10); // Hash the entered current password
        
      const resetPasswordData = {
        userId,
        hashedCurrentPassword,
        newPassword,
      };
    
      console.log(hashedCurrentPassword);
  
      const response = await fetch(`http://localhost:5000/update-password/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resetPasswordData),
      });
  
      if (response.ok) {
        console.log('Password reset successful');
      } else {
        const errorData = await response.json();
        console.error('Password reset failed:', errorData);
      }
    } catch (error) {
      console.error('Password reset failed:', error);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Stack direction="column" sx={{ my: 2 }} width="100%">
          <Typography variant="h4">Reset Password</Typography>
          <TextField
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            margin="normal"
            required
            fullWidth
          />
          <TextField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            margin="normal"
            required
            fullWidth
          />
          <TextField
            label="Confirm New Password"
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            margin="normal"
            required
            fullWidth
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleResetPassword}
            fullWidth
            sx={{ my: 2 }}
          >
            Reset Password
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}
