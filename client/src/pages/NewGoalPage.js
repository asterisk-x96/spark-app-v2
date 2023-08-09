import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Container} from '@mui/material';
// hooks
import useResponsive from '../hooks/useResponsive';

// sections
import { GoalTitle, GoalDetails, GoalCreated, GoalUser } from '../sections/@dashboard/goals';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    display: 'flex',
  },
}));

const StyledContent = styled('div')(() => ({
  maxWidth: 960,
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
}));

// ----------------------------------------------------------------------

export default function NewGoalPage() {

  const [showGoalTitle, setShowGoalTitle] = useState(true)
  const [showGoalUser, setShowGoalUser] = useState(false);
  const [showGoalDetails, setShowGoalDetails] = useState(false);
  const [goalTitle, setGoalTitle] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [friendDetails, setFriendDetails] = useState([]);

  const handleShowGoalUser = (title) => {
    setGoalTitle(title);
    setShowGoalTitle(false);
    setShowGoalUser(true);
  };

  const handleShowGoalDetails = (user, friendDetails) => {
    setSelectedUser(user);
    setFriendDetails(friendDetails);
    setShowGoalUser(false);
    setShowGoalDetails(true);
  }

  return (
    <>
      <Helmet>
        <title> Goals </title>
      </Helmet>
      <StyledRoot>
        <Container maxWidth="md">
          <StyledContent>
            {showGoalTitle && <GoalTitle onShowGoalUser={handleShowGoalUser} />}
            {showGoalUser && <GoalUser onShowGoalDetails={handleShowGoalDetails} />}
            {showGoalDetails 
              && <GoalDetails 
                title={goalTitle} 
                selectedUser={selectedUser}
                friendDetails={friendDetails}
                />}
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}