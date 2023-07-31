import { useState } from 'react';
// @mui
import { Stack, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// ----------------------------------------------------------------------

export default function GoalTitle( { onShowGoalUser } ) {

  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState('');


  const handleSubmit = (event) => {
    event.preventDefault();
    if (title === '') {
      setTitleError('Please enter the title');
    } else {
      onShowGoalUser(title);
    }
  }

  return (
    <form onSubmit={handleSubmit}>

      <Typography variant="h4" gutterBottom>
        Create New Goal
      </Typography>

      <Typography variant="body2" sx={{ mb: 5 }}>
        ... and design your latest inspiration
      </Typography>

      <Stack spacing={3} sx={{ my : 0 }}>
        <TextField name="GoalTitle" 
        value={title}
        onChange={(event) => {setTitle(event.target.value)}} 
        placeholder='What would you like to call your goal?' />
        <span style={{ color: 'red' }}>{titleError}</span><br />
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained">
        Next
      </LoadingButton>


    </form>
  );
}
