  import React, { useEffect, useState } from 'react';
  import { useParams } from 'react-router-dom';
  import { Stack, CircularProgress, Typography, Avatar, Divider, Container, Button } from '@mui/material';
  import Iconify from '../components/iconify';

  import { useUserContext } from '../UserContext';

  export default function UserProfile() {
    const { username } = useParams();
    const [userProfile, setUserProfile] = useState(null);
    const [userFriends, setUserFriends] = useState([]);
    const { user } = useUserContext(); // Access user from the UserContext

    useEffect(() => {
      // Fetch user profile data using 'username' from the API and set it to 'userProfile' state
      fetch(`http://localhost:5000/api/user-profile/${username}`)
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
    }, [username, user.id]); 

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
                onClick={handleAddFriend}
              >
                Add friend
              </Button>
            )}
          </Stack>
          <Divider fullwidth="true" />
        </Container>
      </>
    );
  }