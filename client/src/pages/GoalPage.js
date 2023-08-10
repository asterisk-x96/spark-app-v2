import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Grid, Button, Container, Stack, Typography } from '@mui/material';
import Iconify from '../components/iconify';
import GoalCard from '../sections/@dashboard/goals/GoalCard';
import useGetGoalsByUserId from '../api/useGetGoalsByUserId';

export default function GoalPage() {
  const goals = useGetGoalsByUserId(); // Use the custom hook directly

  return (
    <>
      <Helmet>
        <title> My Goals | Spark </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            My Goals
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            New Goal
          </Button>
        </Stack>

        <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
          <Grid container spacing={3}>
            {goals.map((goal, index) => (
              <GoalCard key={index} goal={goal} index={index} />
            ))}
          </Grid>
        </Stack>
      </Container>
    </>
  );
}
