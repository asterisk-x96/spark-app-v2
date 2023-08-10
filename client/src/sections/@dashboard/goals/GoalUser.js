import { useState, useEffect } from 'react';
import {
  Container,
  Stack,
  Avatar,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Autocomplete, LoadingButton } from '@mui/lab';
import { useUserContext } from '../../../UserContext'; // Import the useUserContext hook

// --------------------------------------------------------------------------------

export default function GoalUser({ onShowGoalDetails }) {
  const [selectedUser, setSelectedUser] = useState('');
  const [userError, setUserError] = useState('');
  const { user } = useUserContext();
  const [userFriends, setUserFriends] = useState([]);
  const [friendDetails, setFriendDetails] = useState([]);


  useEffect(() => {
    const fetchFriendDetails = async (friendId) => {
      try {
        const response = await fetch(`http://localhost:5000/api/user-details/${friendId}`);
        const data = await response.json();
        return { [friendId]: data };
      } catch (error) {
        console.error('Error fetching friend details:', error);
        return null;
      }
    };
  
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/get-friends/${user.id}`);
        const data = await response.json();
        setUserFriends(data.friends);
  
        const friendDetailsPromises = data.friends.map((friend) => fetchFriendDetails(friend));
  
        const friendDetailsArray = await Promise.all(friendDetailsPromises);
  
        const updatedFriendDetails = friendDetailsArray.map((friendDetail, index) => {
          if (friendDetail) {
            const friendId = data.friends[index];
            return { id: friendId, ...friendDetail[friendId] }; // Flatten the structure
          }
          return null;
        }).filter(Boolean); // Filter out any null entries
    
        setFriendDetails(updatedFriendDetails);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);

  const handleSelectUser = (event) => {
    setSelectedUser(event.target.value);
    setUserError(''); // Clear any previous user error
  };

  console.log(selectedUser);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!selectedUser) {
      setUserError('Please select a user');
    } else {
      onShowGoalDetails(selectedUser, friendDetails);
    }
  };



  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h4" gutterBottom>
        Choose a friend
      </Typography>

      <Typography variant="body2">
        ... someone who will accompany you on your journey
      </Typography>

      <Stack spacing={3} sx={{ my: 0 }}>
        <Container maxWidth="md" sx={{ mt: 5 }}>
          <FormControl fullWidth>
            <InputLabel>Select a friend</InputLabel>
            <Select
              value={selectedUser}
              onChange={handleSelectUser}
              label="Select a friend"
            >
              {friendDetails.map((friend) => (
                <MenuItem key={friend.id} value={friend}>
                  <Stack direction="row" alignItems="center">
                    <Avatar src={friend.avatar} alt={`${friend.firstName} ${friend.lastName}`} />
                    <Typography variant="subtitle2" sx={{ marginLeft: 2 }}>{`${friend.firstName} ${friend.lastName || ''}`}</Typography>
                  </Stack>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Container>
        <span style={{ color: 'red' }}>{userError}</span>
        <br />
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained">
        Next
      </LoadingButton>
    </form>
  );
}
