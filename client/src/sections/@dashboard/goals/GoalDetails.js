import React, { useState } from 'react';
import {
  Stack,
  TextField,
  Typography,
  Button,
  Divider,
  Avatar,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LoadingButton } from '@mui/lab';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useUserContext } from '../../../UserContext';
import { categoryList } from '../../../data/goals';
// -------------------------------------------------------------------------
export default function GoalDetails({ title, selectedUser, friendDetails }) {
  const { user } = useUserContext();
  const [titleFinal, setTitleFinal] = useState(title);
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [buddy, setBuddy] = useState(selectedUser.id);
  const [isFriendEditing, setIsFriendEditing] = useState(false);
  const [isTitleEditing, setIsTitleEditing] = useState(false);
  const [isPenaltyEnabled, setIsPenaltyEnabled] = useState(false);
  const [dailyPenalty, setDailyPenalty] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleTitleEdit = (event) => {
    setIsTitleEditing(true);
  };

  const handleTitleBlur = (event) => {
    setIsTitleEditing(false);
  };

  const handleFriendEdit = (event) => {
    setIsFriendEditing(true);
  };

  const handleSelectBuddy = (event) => {
    setBuddy(event.target.value);
  };

  const handleSelectCategory = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleEnablePenalty = (event) => {
    setIsPenaltyEnabled(event.target.checked);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const response = await fetch('http://localhost:5000/api/create-goal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: titleFinal,
          description,
          dueDate,
          dueTime,
          selectedCategory,
          buddy: buddy.id,
          currentUser: user.id,
          isPenaltyEnabled,
          dailyPenalty: parseInt(dailyPenalty, 10),
          fund: 0,
          isCompleted: false,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to create goal');
      }
  
      const data = await response.json();
      // Handle success or further actions here
      console.log('Goal created:', data.goal);
    } catch (error) {
      // Handle error
      console.error('Error creating goal:', error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <Stack direction="row" spacing={2} sx={{ my: 0 }} size="small">
        {isTitleEditing ? (
          <TextField
            value={titleFinal}
            onChange={(event) => {
              setTitleFinal(event.target.value);
            }}
            variant="outlined"
            placeholder="Input a title"
          />
        ) : (
          <>
            <Typography variant="h3" gutterBottom>
              {title}
            </Typography>
            <IconButton onClick={handleTitleEdit} sx={{ marginLeft: 2 }}>
              <EditOutlinedIcon />
            </IconButton>
          </>
        )}
      </Stack>

      <Divider sx={{ my: 3 }} />
      <Typography 
        variant="h6" 
        sx={{ px: 0, mt: 0 }}>
        Description
      </Typography>
      <TextField
        name="Description"
        placeholder="Enter a description for this goal"
        size="large"
        sx={{ mt: 2 }}
        fullWidth
        onChange={(event) => setDescription(event.target.value)}
      />


      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" sx={{ px: 0, mt: 0, my: 1 }}>
          Category
      </Typography>

      <Typography variant="body2" sx={{ px: 0, mt: 0, my: 2, color: ', 0, 0, 0.6)' }}>
          Pick a category that best matches your goal
      </Typography>

      <FormControl fullWidth>
        <InputLabel>Category</InputLabel>
        <Select
          value={selectedCategory}
          onChange={handleSelectCategory}
          label="Category"
          sx={{ width: '40%' }}
        >
          {categoryList.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
    </FormControl>




      <Divider sx={{ my: 3 }} />

      <Stack direction="column" spacing={2} sx={{ my: 0 }}>
        <Typography variant="h6" sx={{ px: 0, mt: 0 }}>
          Buddy Up
        </Typography>

        <Typography variant="body2" sx={{ px: 0, mt: 0, color: 'rgba(0, 0, 0, 0.6)' }} >
          Select your journey companiant
        </Typography> 

        {isFriendEditing ? (
          <FormControl fullWidth>
            <InputLabel>Select a friend</InputLabel>
            <Select
              value={buddy}
              onChange={handleSelectBuddy}
              label="Select a friend"
              sx={{ width: '50%' }}
            >
              {friendDetails.map((friend) => (
                <MenuItem key={friend.id} value={friend}>
                  <Stack direction="row" alignItems="center">
                    <Avatar
                      src={friend.avatar}
                      alt={`${friend.firstName} ${friend.lastName}`}
                    />
                    <Typography
                      variant="subtitle2"
                      sx={{ marginLeft: 2 }}
                    >{`${friend.firstName} ${friend.lastName || ''}`}</Typography>
                  </Stack>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <Stack direction="row" alignItems="center">
            <Avatar
              src={selectedUser.avatar}
              alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
            />
            <Typography
              variant="subtitle2"
              sx={{ marginLeft: 2 }}
            >{`${selectedUser.firstName} ${selectedUser.lastName || ''}`}</Typography>
            <IconButton
              onClick={handleFriendEdit}
              sx={{ marginLeft: 2 }}
            >
              <EditOutlinedIcon />
            </IconButton>
          </Stack>
        )}
      </Stack>
      
      <Divider sx={{ my: 3 }} />
      
      <Typography variant="h6" sx={{ px: 0, mt: 0, my: 1 }}>
          Due Date
      </Typography>

      <Typography variant="body2" sx={{ px: 0, mt: 0, color: 'rgba(0, 0, 0, 0.6)'}}>
          Set a time to achieve your goal
      </Typography>
      <Stack direction="column" spacing={0} sx={{ mb: 3 }} size="small">
        <Stack direction="row" spacing={3} sx={{ my: 1 }} size="small">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={dueDate}
              onChange={(newValue) => setDueDate(newValue)}
              renderInput={(props) => <TextField {...props}
              sx={{ width: '100%' }} />}
            />
          </LocalizationProvider>

          {dueDate && (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                value={dueTime}
                onChange={(newValue) => setDueTime(newValue)}
                renderInput={(props) => <TextField {...props}
                sx={{ width: '60%' }} />}
              />
            </LocalizationProvider>
          )}
        </Stack>
        
        <Divider sx={{ my: 3 }} />
      
        <Typography variant="h6" sx={{ px: 0, mt: 0, my: 1 }}>
            Penalty
        </Typography>

        <Typography variant="body2" sx={{ px: 0, mt: 0, color: 'rgba(0, 0, 0, 0.6)' }} >
          Increase your chance of completing the goals by setting up a daily penalty for not checking in
        </Typography> 
          

        <Stack direction="row" spacing={3} sx={{ my: 1 }} size="small">
          <FormControlLabel
            control={
              <Switch
                checked={isPenaltyEnabled}
                onChange={handleEnablePenalty}
                name="isPenaltyEnabled"
                color="primary"
              />
            }
            label="Enable Penalty"
          />
          {isPenaltyEnabled && (
              <TextField
                name="Daily Penalty"
                label="Daily penalty amount"
                onChange={(event) => setDailyPenalty(event.target.value)}
              />
          )}

        </Stack>

        <Stack direction="row" spacing={3} sx={{ my: 1 }} size="small">
        {isPenaltyEnabled && (
          <Stack direction="column" spacing={1}>
            <Typography variant="body2" sx={{ px: 0, mt: 0, my: 1, color: 'rgba(0, 0, 0, 0.6)' }}>
              What would you like to do with your penalty fund?
            </Typography>
            <TextField
              name="Penalty fund purpose"
              label="Enter purpose..."
              onChange={(event) => setDailyPenalty(event.target.value)}
            />
          </Stack>
        )}
        </Stack>
      </Stack>  

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
      >
        Create Goal
      </LoadingButton>
    </form>
  );
}
