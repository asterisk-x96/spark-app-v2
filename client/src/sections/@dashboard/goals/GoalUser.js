import { useState, useEffect } from 'react';
import {
  Container,
  Stack,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { Autocomplete, LoadingButton } from '@mui/lab';

export default function GoalUser({ onShowGoalDetails }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [userError, setUserError] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const searchUsers = async (inputValue) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users?search=${inputValue}`);
      const data = await response.json();
      setLoading(false);
      setSearchResults(data);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching users:', error);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSelectUser = (event, newValue) => {
    setSelectedUser(newValue);
    handleCloseDialog();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!selectedUser) {
      setUserError('Please select a user');
    } else {
      onShowGoalDetails(selectedUser);
    }
  };

  useEffect(() => {
    if (selectedUser) {
      setSearchResults([selectedUser]);
    }
  }, [selectedUser]);

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
          <Button variant="outlined" onClick={handleOpenDialog}>
            Find friend
          </Button>
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>Find friend</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Choose a friend here.
              </DialogContentText>
              <Autocomplete
                options={searchResults}
                getOptionLabel={(user) => user.name}
                value={selectedUser}
                loading={loading}
                onInputChange={(event, newInputValue) => searchUsers(newInputValue)}
                onChange={handleSelectUser}
                renderInput={(params) => <TextField {...params} label="Search for a friend" />}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
            </DialogActions>
          </Dialog>
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