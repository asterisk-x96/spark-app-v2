import React, { useState } from 'react';
import {
  Stack,
  TextField,
  Typography,
  Divider,
  Avatar,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Input,
  Container
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserContext } from '../../../UserContext';
import { categoryList } from '../../../data/goals';


export default function EditGoal() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUserContext();

  const [titleFinal, setTitleFinal] = useState(location.state.title);
  const [description, setDescription] = useState(location.state.description);
  const [dueDate, setDueDate] = useState(location.state.dueDate);
  const [dueTime, setDueTime] = useState(location.state.dueTime);
  const [buddy, setBuddy] = useState(location.state.buddy.id);
  const [isPenaltyEnabled, setIsPenaltyEnabled] = useState(location.state.isPenaltyEnabled);
  const [dailyPenalty, setDailyPenalty] = useState(location.state.dailyPenalty);
  const [selectedCategory, setSelectedCategory] = useState(location.state.category);
  const [uploadedImage, setUploadedImage] = useState(location.state.thumbnail);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const imageUrl = URL.createObjectURL(file);
    setUploadedImage(imageUrl);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/edit-goal/${location.state.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: titleFinal,
          description,
          dueDate,
          dueTime,
          selectedCategory,
          buddy,
          isPenaltyEnabled,
          dailyPenalty: parseInt(dailyPenalty, 10),
          uploadedImage,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update goal');
      }

      const data = await response.json();
      console.log('Goal updated:', data.goal);
      navigate(`/goal/${location.state.id}`);
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Container>
        <Typography variant="h4" sx={{ px: 0, mt: 0 }}>Edit Goal</Typography>
        
        <Divider sx={{ my: 3 }} />

        <Stack direction="column" spacing={2} sx={{ my: 0 }} size="small">
          <Typography variant="h5" sx={{ px: 0, mt: 0 }}>
            Title
          </Typography>
          <TextField
            value={titleFinal}
            onChange={(event) => {
              setTitleFinal(event.target.value);
            }}
            variant="outlined"
            placeholder="Input a title"
          />
        </Stack>

        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" sx={{ px: 0, mt: 0 }}>
          Description
        </Typography>
        <TextField
          name="Description"
          placeholder="Enter a description for this goal"
          size="large"
          sx={{ mt: 2 }}
          fullWidth
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
        <Divider sx={{ my: 3 }} />

        {/* Rest of the buddy selection section */}

        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" sx={{ px: 0, mt: 0 }}>
          Thumbnail
        </Typography>

        <Typography sx={{ px: 0, mt: 0 }}>
          Upload an image that represents your goal's spirit
        </Typography>

        <FormControl sx={{ mt: 2 }}>
          <Input
            type="file"
            inputProps={{
              accept: 'image/*',
              onChange: handleImageUpload,
            }}
          />
        </FormControl>

        {/* Display the uploaded image */}
        {uploadedImage && (
          <img
            src={uploadedImage}
            alt="Uploaded thumbnail"
            style={{ maxWidth: '100%', marginTop: '1rem' }}
          />
        )}

        <Divider sx={{ my: 3 }} />

        <Stack direction="column" spacing={0} sx={{ mb: 3 }} size="small">
          <Stack direction="row" spacing={3} sx={{ my: 1 }} size="small">
            

            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
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
          </Stack>

          <Stack direction="row" spacing={3} sx={{ my: 1 }} size="small">
            <FormControlLabel
              control={
                <Switch
                  checked={isPenaltyEnabled}
                  onChange={(event) => setIsPenaltyEnabled(event.target.checked)}
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
                value={dailyPenalty}
                onChange={(event) => setDailyPenalty(event.target.value)}
              />
            )}
          </Stack>
        </Stack>

        <LoadingButton fullWidth size="large" type="submit" variant="contained">
          Update Goal
        </LoadingButton>
      </Container>
    </form>
  );
}
