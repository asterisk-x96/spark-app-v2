import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Grid, Container, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Iconify from '../components/iconify';
import { AppWidgetSummary } from '../sections/@dashboard/app';
import { useUserContext } from '../UserContext';

// ---------------------------------------------------------------------------------------------------------------


export default function DashboardAppPage() {
  const { user } = useUserContext();
  const theme = useTheme();
  const navigate = useNavigate();
  const [latestGoals, setLatestGoals] = useState([]); 

  const handleClick = () => {
    navigate('/create', { replace: true });
  };

  useEffect(() => {
    // Fetch the latest goal data from the backend
    const fetchLatestGoals = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/latest-goals'); // Replace with your API endpoint
        const data = await response.json();
        setLatestGoals(data.goals); // Update the state with the latest goals
      } catch (error) {
        console.error('Error fetching latest goals:', error);
      }
    };

    fetchLatestGoals();
  }, []); // Empty dependency array means this effect runs once on component mount

  return (
    <>
      <Helmet>
        <title> Dashboard | Spark </title>
      </Helmet>

      <Container maxWidth="xl">

        <Typography variant="h4" sx={{ mb: 5 }}>
          Welcome back, {user.firstName}!
        </Typography>

        <Grid container spacing={3}>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Add Goal" onClick={handleClick} color="add" icon={'entypo:circle-with-plus'} />
          </Grid>


          <Grid item xs={12} sm={6} md={3}>
            {/* Display the FIRST latest goal */}
            <AppWidgetSummary
              title={latestGoals.length > 0 ? latestGoals[0].title : 'No Goals'}
              total={1352831}
              color="info"
              icon={'ant-design:apple-filled'}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            {/* Display the second latest goal */}
            <AppWidgetSummary
              title={latestGoals.length > 1 ? latestGoals[1].title : 'No Goals'}
              total={1352831}
              color="error"
              icon={'ant-design:apple-filled'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            {/* Display the second latest goal */}
            <AppWidgetSummary
              title={latestGoals.length > 1 ? latestGoals[1].title : 'No Goals'}
              total={1352831}
              color="warning"
              icon={'ant-design:apple-filled'}
            />
          </Grid>

      </Grid>

      </Container>
    </>
  );
}
