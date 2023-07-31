import { useState } from 'react';
// @mui
import { Stack, TextField, Typography, Button, Divider } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Logo from '../../../components/logo';
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

export default function GoalTitle( { title }, { onShowGoalCreated } ) {

  const [user, setUser] = useState('');
  const [userError, setUserError] = useState('');
  const [isEditing, setIsEditing] = useState('');
  const [isEdited, setIsEdited] = useState('');


  const handleSubmit = (event) => {
    event.preventDefault();
    if (user === '') {  
      setUserError('Please select an user');
    } else {
      onShowGoalCreated();
    }
  }

  const handleEdit = (event) => {
    setIsEditing(true);
  }

  return (
    <form onSubmit={handleSubmit}>

      <Stack direction="row" spacing={2} sx={{ my : 0 }} size="small">
        <Typography variant="h3" gutterBottom>
          {title}
        </Typography>
      </Stack>

      <Stack direction="column" spacing={2}>
        <Typography variant="h6" sx={{ px: 0, mt: 5 }}>
          Notes
        </Typography>
        <TextField name="GoalTitle" onChange={(event)  => {setUser(event.target.value)}} 
          placeholder='Add notes' inputProps={{style: {height: "80px",},}}/>
      </Stack>

      <Divider sx={{ my: 3 }} />

      <Stack direction="column" spacing={0} sx={{ mb: 5}} size="small">
        <Stack direction="row" spacing={3} sx={{ my : 5 }} size="small">
          <TextField name="DueDate" onChange={(event) => {setUser(event.target.value)}} 
            placeholder='' label="Due Date" size="small" /> 
          <TextField name="CheckInFrequency" onChange={(event) => {setUser(event.target.value)}} 
            placeholder='' label="Check-in Frequency" size="small" /> 
        </Stack>
        <TextField name="Category" onChange={(event) => {setUser(event.target.value)}} 
          placeholder='' label="Category" size="small" /> 
      </Stack>

      <Divider sx={{ my: 0 }} />


      <Stack direction="column" spacing={2} sx={{ my : 5 }} >
        <Typography variant="h6" sx={{ px: 0, mt: 5 }}>
          Buddy Up
        </Typography>
        <TextField name="GoalTitle" onChange={(event)  => {setUser(event.target.value)}} 
          placeholder='Add notes' inputProps={{style: {height: "80px",},}}/>
      </Stack>
      

      <LoadingButton fullWidth size="large" type="submit" variant="contained">
        Create Goal
      </LoadingButton>


    </form>
  );
}
