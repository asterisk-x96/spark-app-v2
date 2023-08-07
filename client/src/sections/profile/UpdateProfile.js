import React, { useState } from 'react';
import { Stack, TextField, Typography, Button, Divider, Avatar } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useUserContext } from '../../UserContext';

export default function UpdateProfile() {
  const { user, setUser } = useUserContext();
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [profilePicture, setProfilePicture] = useState(user.profilePicture);

  const handleSaveChanges = () => {
    // Update the user object with the new data
    setUser((prevUser) => ({
      ...prevUser,
      firstName,
      lastName,
      email,
      profilePicture,
    }));

    // You can also send the updated user data to the server here if needed.

    // Show a success message or redirect to another page after saving changes.
  };

  return (
    <Stack spacing={3} sx={{ p: 3 }}>
      <Typography variant="h3" sx={{ px: 0, mt: 5 }}>
        {firstName} {lastName}
      </Typography>
      <Avatar src={profilePicture} alt="Profile Picture" sx={{ width: 128, height: 128, my: 2 }} />
      <TextField
        label="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        fullWidth
        variant="outlined"
      />
      <TextField
        label="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        fullWidth
        variant="outlined"
      />
      <TextField
        label="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        variant="outlined"
      />
      <TextField
        label="Profile Picture URL"
        value={profilePicture}
        onChange={(e) => setProfilePicture(e.target.value)}
        fullWidth
        variant="outlined"
      />
      <LoadingButton onClick={handleSaveChanges} fullWidth variant="contained">
        Save Changes
      </LoadingButton>
    </Stack>
  );
}