import { useState } from 'react';
// @mui
import { Stack, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// ----------------------------------------------------------------------

export default function GoalTitle( {  onShowGoalDetails } ) {

  const [user, setUser] = useState('');
  const [userError, setUserError] = useState('');


  const handleSubmit = (event) => {
    event.preventDefault();
    if (user === '') {
      setUserError('Please select an user');
    } else {
      onShowGoalDetails(user);
    }
  }

  return (
    <form onSubmit={handleSubmit}>

      <Typography variant="h4" gutterBottom>
        Choose a friend
      </Typography>

      <Typography variant="body2" sx={{ mb: 5 }}>
        ... someone who will accompany you on your journey
      </Typography>

      <Stack spacing={3} sx={{ my : 0 }}>
        <TextField name="GoalUser" onChange={(event) => {setUser(event.target.value)}} 
          placeholder='Type the name of your accompaniant' />
        <span style={{ color: 'red' }}>{userError}</span><br />
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained">
        Next
      </LoadingButton>


    </form>
  );
}
