import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Stack, CircularProgress, Typography, Avatar, Divider, Container, Button } from '@mui/material';
import Iconify from '../components/iconify';

import { useUserContext } from '../UserContext'; // Import the useUserContext hook

export default function UserProfile() {
  const { username } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [userFriends, setUserFriends] = useState([]);
  const { user } = useUserContext(); // Access user from the UserContext
  // State to store user's friends from the database

  useEffect(() => {
    // Fetch user profile data using 'username' from the API and set it to 'userProfile' state
    const cacheBuster = Math.random().toString(36).substring(7); // Generate a random string
    fetch(`http://localhost:5000/api/user-profile/${username}?cb=${cacheBuster}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('Response data:', data);
        setUserProfile(data);
      })
      .catch((error) => console.error('Error fetching user profile:', error));

    // Fetch user's friends from the database
    fetch(`http://localhost:5000/api/get-friends/${user.id}`)
      .then((response) => response.json())
      .then((data) => {
        setUserFriends(data.friends);
      })
      .catch((error) => console.error('Error fetching user friends:', error));
  }, [username, user.id]); // Make sure to include user._id as a dependency

  const handleAddFriend = async () => {
    // Check if the user id from userProfile is not already in the friends list of the logged-in user
    if (!userFriends.includes(userProfile._id)) {
      // Perform an API call to update the friends array in the database
      const updatedFriendsArray = [...userFriends, userProfile._id];
      await updateFriends(updatedFriendsArray);
    }
  };

  const updateFriends = async (updatedFriendsArray) => {
    try {
      const response = await fetch(`http://localhost:5000/api/update-friends/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ friends: updatedFriendsArray }),
      });

      if (response.ok) {
        console.log('Friends array updated in the database');
        setUserFriends(updatedFriendsArray); // Update the local state
      } else {
        console.error('Error updating friends array in the database');
      }
    } catch (error) {
      console.error('Error updating friends in the database:', error);
    }
  };


  if (!userProfile) {
    return (
      <Stack direction="column" alignItems="center" justifyContent="center" sx={{ height: '100vh' }}>
        <CircularProgress />
        <Typography variant="body1">Loading...</Typography>
      </Stack>
    );
  }

  return (
    <>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar src={userProfile.avatar} alt="Profile Avatar" sx={{ width: 70, height: 70 }} />
            <Stack>
              <Typography variant="h4" gutterBottom>
                {userProfile.first_name} {userProfile.last_name}
              </Typography>
              <Typography variant="subtitle1" gutterBottom sx={{ color: 'grey' }}>
                @{userProfile.username}
              </Typography>
            </Stack>
          </Stack>
          {!userProfile.isFriend && (
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              sx={{ marginLeft: 'auto' }}
              onClick={handleAddFriend} // Add onClick event to the "Add friend" button
            >
              Add friend
            </Button>
          )}
        </Stack>
        <Divider fullwidth="true" />
        <Stack direction="column" alignItems="center" spacing={2}>
          {/* Add other profile information here */}
        </Stack>
      </Container>
    </>
  );
}