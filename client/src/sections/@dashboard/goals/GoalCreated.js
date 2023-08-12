import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Typography, Container, Paper, Avatar, Stack, Divider, IconButton } from '@mui/material';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useUserContext } from '../../../UserContext';

export default function GoalDetails() {
  const { goalId } = useParams();
  const { user } = useUserContext();
  const [goal, setGoal] = useState({});
  const [creatorDetails, setCreatorDetails] = useState({});
  const [buddyDetails, setBuddyDetails] = useState({});

  const userId = user.id;
  const navigate = useNavigate();

  const fetchUserDetails = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/user-details/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching user details:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchGoalDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/get-goal-details/${goalId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch goal details');
        }
        const data = await response.json();
        setGoal(data.goal);

        // Fetch creator's and buddy's details
        const creatorData = await fetchUserDetails(data.goal.creator);
        const buddyData = await fetchUserDetails(data.goal.buddy);

        setCreatorDetails(creatorData);
        setBuddyDetails(buddyData);
      } catch (error) {
        console.error('Error fetching goal details:', error);
      }
    };

    fetchGoalDetails();
  }, [goalId]);

  console.log("Goal: ", goal.title);

  const handleEditButtonClick = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/get-goal-details/${goalId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch goal details');
      }
      const data = await response.json();
      
      // Fetch creator's and buddy's details
      const creatorData = await fetchUserDetails(data.goal.creator);
      const buddyData = await fetchUserDetails(data.goal.buddy);
      
      setGoal(data.goal); // Update goal state here
      
      setCreatorDetails(creatorData);
      setBuddyDetails(buddyData);
  
      // Now that data is fetched and state is set, navigate to EditGoal
      navigate(`/edit/${goalId}`, {
        state: {
          id: goalId,
          title: data.goal.title,
          description: data.goal.description,
          dueDate: data.goal.due_date,
          buddy: buddyData,
          thumbnail: data.goal.thumbnail,
          creator: creatorData,
          category: data.goal.category,
          isPenaltyEnabled: data.goal.penalty_enabled,
          dailyPenalty: data.goal.daily_penalty,
          penaltyFund: data.goal.penalty_fund,
        },
      });
    } catch (error) {
      console.error('Error fetching goal details:', error);
    }
  };

  return (
    <Container maxWidth="md">
     <Stack direction="column" sx={{ mb: 3 }}>
        <IconButton
          component={Link}
          to="/goals"
          sx={{ justifyContent: 'flex-start', my: 2 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ fontSize: '2.5rem' }}>
          Goal Details
        </Typography>
      </Stack>
      {goal ? (
        <Paper sx={{ p: 3, position: 'relative' }}>
        <IconButton
            onClick={handleEditButtonClick}
            sx={{ position: 'absolute', top: '1rem', right: '1rem' }}
          > 
            <EditCalendarIcon />
          </IconButton>

          
          
          <Typography variant="h4" sx={{ fontSize: '1.8rem', mb: 2 }}>
            {goal.title}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '1.2rem', lineHeight: 1.6 }}>
            {goal.description}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 2 }}>
            <Avatar src={goal.thumbnail} alt="Goal Thumbnail" />
            {creatorDetails && (
              <Typography variant="body2" sx={{ fontSize: '1.2rem' }}>
                {creatorDetails.firstName} {creatorDetails.lastName}
              </Typography>
            )}
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body2" sx={{ fontSize: '1rem' }}>
            <strong>Due Date:</strong> {new Date(goal.due_date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })} at {new Date(goal.due_date).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: 'numeric',
            })}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '1rem' }}>
            <strong>Category:</strong> {goal.category}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '1rem' }}>
            <strong>Buddy:</strong> {buddyDetails.firstName} {buddyDetails.lastName}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '1rem' }}>
            <strong>Penalty Enabled:</strong> {goal.penalty_enabled ? 'Yes' : 'No'}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '1rem' }}>
            <strong>Daily Penalty:</strong> {goal.daily_penalty}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '1rem' }}>
            <strong>Penalty Fund:</strong> {goal.penalty_fund}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '1rem' }}>
            <strong>Complete Status:</strong> {goal.isCompleted ? 'Complete' : 'Incomplete'}
          </Typography>
        </Paper>
      ) : (
        <Typography variant="body1">Loading...</Typography>
      )}
    </Container>
  );
}
