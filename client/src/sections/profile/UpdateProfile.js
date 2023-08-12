import React, { useState, useEffect } from 'react';
import { Stack, TextField, Typography, Button, Divider, Avatar } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useUserContext } from '../../UserContext';
import useGetUserDetails from '../../api/useGetCurrentUserDetails'; // Import the custom hook


export default function UpdateProfile() {

  const userDetails = useGetUserDetails();

  console.log(userDetails);
  console.log(userDetails.firstName);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState('');

  useEffect(() => {
    // Initialize the state values with fetched user details
    setFirstName(userDetails.firstName || '');
    setLastName(userDetails.lastName || '');
    setBio(userDetails.bio || '');
    setEmail(userDetails.email || '');
    setProfilePicture(userDetails.avatar || '');
  }, [userDetails]);

  console.log('User details: ', userDetails);


  const handleUpdateProfile = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/update-user/${userDetails.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          bio,
          email,
          profilePicture,
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        console.log('Profile updated:', updatedUser);
      } else {
        console.error('Error updating profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
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
        label="Bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        fullWidth
        variant="outlined"
        size='medium'
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
        disabled
        helperText="Email address cannot be changed as it's associated with login."
      />
      <TextField
        label="Profile Picture URL"
        value={profilePicture}
        onChange={(e) => setProfilePicture(e.target.value)}
        fullWidth
        variant="outlined"
      />
      <LoadingButton onClick={handleUpdateProfile} fullWidth variant="contained">
        Update Profile
      </LoadingButton>
    </Stack>
  );
}