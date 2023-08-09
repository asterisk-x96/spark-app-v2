import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Grid,
  Button,
  Container,
  Stack,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';

import { useUserContext } from '../UserContext'; // Import the useUserContext hook


import Iconify from '../components/iconify';

const fundingOption = ['Barclays', 'Revolut'];

export default function UserFundPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isNextDialogOpen, setIsNextDialogOpen] = useState(false);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
  const { user } = useUserContext();
  const [userFund, setUserFund] = useState(null);
  const [addedAmount, setAddedAmount] = useState(0);
  const currentUserId = user.id;
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false); // New state for success dialog


  useEffect(() => {
    // Fetch user's fund from the backend
    const fetchUserFund = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/user-fund/${currentUserId}`);
        const data = await response.json();
        setUserFund(data.fund);
      } catch (error) {
        console.error('Error fetching user fund:', error);
      }
    };
    fetchUserFund();
  }, [currentUserId]); // Fetch whenever the currentUserId changes

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleOpenNextDialog = () => {
    setIsNextDialogOpen(true);
    handleCloseDialog(); // Close the previous dialog
  };

  const handleCloseNextDialog = () => {
    setIsNextDialogOpen(false);
  };

  const handleOpenConfirmationDialog = () => {
    setIsConfirmationDialogOpen(true);
  };

  const handleCloseConfirmationDialog = () => {
    setIsConfirmationDialogOpen(false);
  };

  const handleAddAmount = (amount) => {
    setAddedAmount(amount);
    handleOpenConfirmationDialog();
  };

  const handleConfirmAddAmount = async () => {
    // Update the user fund with the added amount
    const updatedUserFund = userFund + addedAmount;
    setUserFund(updatedUserFund);
  
    // Close the confirmation dialog
    handleCloseConfirmationDialog();
  
    try {
      const response = await fetch(`http://localhost:5000/api/update-fund/${currentUserId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' // Specify the content type as JSON
        },
        body: JSON.stringify({ userId: currentUserId, addedAmount }) // Convert data to JSON format
      });
      const data = await response.json();
      // You might want to handle the response from the back-end here
    } catch (error) {
      console.error('Error adding fund:', error);
    }
  
    handleCloseNextDialog();
  
    // Open the success dialog
    setIsSuccessDialogOpen(true);
  };

const handleCloseSuccessDialog = () => {
    setIsSuccessDialogOpen(false);
};


  return (
    <>
      <Helmet>
        <title> My Goals | Spark </title>
      </Helmet>

      <Container>
        <Stack direction="row" justifyContent="space-between" mb={2}>
          <Typography variant="h4" gutterBottom>
            My Fund
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenDialog}>
            Add fund
          </Button>
        </Stack>

        <Stack direction="column" alignItems="center" justifyContent="center">
          <Stack direction="row" alignItems="center" justifyContent="center" height="20vh">
            <Typography variant="h2" gutterBottom>
              <span role="img" aria-label="British Pound" style={{ fontSize: '3rem' }}>
                💷
              </span>
              <span style={{ fontSize: '3rem', marginLeft: '0.5rem' }}>{userFund}</span>
            </Typography>
          </Stack>

          <Typography variant="h3" gutterBottom>
            Total fund
          </Typography>
        </Stack>
      </Container>

      <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add Fund</DialogTitle>
        <DialogContent>
          <Select fullWidth>
            {fundingOption.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleOpenNextDialog}>
            Next
          </Button>
          <Button onClick={handleCloseDialog} color="error">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isNextDialogOpen} onClose={handleCloseNextDialog} maxWidth="sm" fullWidth>
      <DialogTitle>Set your funding</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Amount"
          type="number"
          onChange={(e) => setAddedAmount(Number(e.target.value))}
        />
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={() => handleAddAmount(addedAmount)}>
          Next
        </Button>
        <Button onClick={handleCloseNextDialog} color="error">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>

    <Dialog open={isConfirmationDialogOpen} onClose={handleCloseConfirmationDialog} maxWidth="sm" fullWidth>
      <DialogTitle>Confirmation</DialogTitle>
      <DialogContent>
        Are you sure you want to add {addedAmount} to your fund?
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleConfirmAddAmount}>
          Yes
        </Button>
        <Button onClick={handleCloseConfirmationDialog} color="error">
          No
        </Button>
      </DialogActions>
    </Dialog>
    
    <Dialog open={isSuccessDialogOpen} onClose={handleCloseSuccessDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Success</DialogTitle>
        <DialogContent>
          Successfully added {addedAmount} to your fund.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSuccessDialog} color="primary">
            Close
          </Button>
        </DialogActions>
    </Dialog>

    </>
  );
}
