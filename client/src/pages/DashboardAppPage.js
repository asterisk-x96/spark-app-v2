import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Grid, Container, Typography } from '@mui/material';
import { AppWidgetSummary } from '../sections/@dashboard/app';
import { useUserContext } from '../UserContext';
import useGetGoalsByUserId from '../api/useGetGoalsByUserId';
import useGetUserDetails from '../api/useGetCurrentUserDetails'; // Import the custom hook


export default function DashboardAppPage() {
  const userDetails = useGetUserDetails();
  const navigate = useNavigate();

  // Use the custom hook to fetch goals
  const goals = useGetGoalsByUserId().slice(0,3);

  console.log(goals);

  const colors = ['add', 'info', 'error', 'warning']; // Adjust the colors based on your needs
  const icons = {
    add: 'entypo:circle-with-plus',
    info: 'ant-design:apple-filled',
    error: 'ant-design:windows-filled',
    warning: 'ant-design:bug-filled',
  }; // Adjust the icons based on your needs

  const handleClick = () => {
    navigate('/create', { replace: true });
  };

  const handleClickGoal = (goal) => {
    navigate(`/goal/${goal._id}`);
  }

  return (
    <>
      <Helmet>
        <title> Dashboard | Spark </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Welcome back, {userDetails.firstName}!
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
              <AppWidgetSummary 
                title={'Add Goal'} 
                color={colors[0]} 
                icon={icons[colors[0]]}
                onClick={handleClick} />
          </Grid>

        {goals.map((goal, index) => (
        <Grid key={index} item xs={12} sm={6} md={3}>
          {/* Display goals */}
          <AppWidgetSummary
            title={goal.title}
            total={goal.daily_penalty}
            color={colors[index + 1]}
            icon={icons[colors[index + 1]]}
            onClick={() => handleClickGoal(goal)}
          />
        </Grid>
      ))}

        </Grid>
      </Container>
    </>
  );
}
