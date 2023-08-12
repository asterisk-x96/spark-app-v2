import React, { useState, useEffect } from 'react';
import {
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

import useGetUserDetails from '../api/useGetCurrentUserDetails'; // Import the custom hook


const fundingOptions = ['Debit card', 'Credit card'];

export default function UserFundPage() {
  const userDetails = useGetUserDetails();
  const [isAmountDialogOpen, setIsAmountDialogOpen] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCardDetailsDialogOpen, setIsCardDetailsDialogOpen] = useState(false);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
  const [userFund, setUserFund] = useState(0);
  const [addedAmount, setAddedAmount] = useState('');
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [selectedFundingOption, setSelectedFundingOption] = useState(fundingOptions[0]);

  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvc, setCVC] = useState('');
  const [cardNumberError, setCardNumberError] = useState('');
  const [expiryMonthError, setExpiryMonthError] = useState('');
  const [expiryYearError, setExpiryYearError] = useState('');
  const [cvcError, setCVCError] = useState('');
  const [isAmountError, setIsAmountError] = useState(false);


  
  useEffect(() => {
    setUserFund(userDetails.fund || 0);
  }, [userDetails]);

  const handleOpenAmountDialog = () => {
    setIsAmountDialogOpen(true);
  };

  const handleCloseAmountDialog = () => {
    setIsAmountDialogOpen(false);
  };


  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleOpenCardDetailsDialog = () => {
    setIsCardDetailsDialogOpen(true);
    handleCloseDialog(); // Close the previous dialog
  };

  const handleCloseCardDetailsDialog = () => {
    setIsCardDetailsDialogOpen(false);
  };

  const handleFundingOptionChange = (event) => {
    setSelectedFundingOption(event.target.value);
  };

  const handleOpenConfirmationDialog = () => {
    setIsConfirmationDialogOpen(true);
  };

  const handleCloseConfirmationDialog = () => {
    setIsConfirmationDialogOpen(false);
  };

  const handleAddAmount = (amount) => {
    if (cardNumber === '') {
      setCardNumberError('Card number is required');
    } else {
      setCardNumberError('');
    }
    if (expiryMonth === '') {
      setExpiryMonthError('Expiry month is required');
    } else {
      setExpiryMonthError('');
    }
    if (expiryYear === '') {
      setExpiryYearError('Expiry year is required');
    } else {
      setExpiryYearError('');
    }
    if (cvc === '') {
      setCVCError('CVC is required');
    } else {
      setCVCError('');
    }
  
    // If all fields are filled, proceed to the confirmation dialog
    if (cardNumber !== '' && expiryMonth !== '' && expiryYear !== '' && cvc !== '') {
      setAddedAmount(amount);
      handleOpenConfirmationDialog();
    }
  };

  const handleConfirmAddAmount = async () => {
    // Update the user fund with the added amount
    const updatedUserFund = userFund + addedAmount;
    setUserFund(updatedUserFund);
  
    // Close the confirmation dialog
    handleCloseConfirmationDialog();
  
    try {
      const response = await fetch(`http://localhost:5000/api/update-fund/${userDetails.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' // Specify the content type as JSON
        },
        body: JSON.stringify({ userId: userDetails.id, addedAmount }) // Convert data to JSON format
      });
      const data = await response.json();
    } catch (error) {
      console.error('Error adding fund:', error);
    }
  
    handleCloseCardDetailsDialog();
  
    // Open the success dialog
    setIsSuccessDialogOpen(true);
  };

const handleCloseSuccessDialog = () => {
    setIsSuccessDialogOpen(false);
};


  return (
    <>


      <Container  sx={{ backgroundColor: 'white', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',padding: '50px', borderRadius: '20px'}}>
        <Stack direction="row" justifyContent="space-between" mb={2}>
          <Typography variant="h4" gutterBottom>
            Total Fund
          </Typography>

        </Stack>

        <Stack direction="column" alignItems="center" justifyContent="center">
          <Stack direction="row" alignItems="center" justifyContent="center" height="20vh">
            <Typography variant="h2" gutterBottom>
              <span role="img" aria-label="British Pound" style={{ fontSize: '4rem' }}>
                💷
              </span>
              <span style={{ fontSize: '4rem', marginLeft: '0.5rem' }}>{userFund}</span>
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center" justifyContent="center" mt={0}>
            <Button variant="contained" onClick={handleOpenAmountDialog}>
              Add fund
            </Button>
        </Stack>
        </Stack>
      </Container>

      <Dialog open={isAmountDialogOpen} onClose={handleCloseAmountDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Enter Amount</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Enter an amount"
            type="number"
            value={addedAmount}
            onChange={(e) => setAddedAmount(Number(e.target.value))}
          />
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            onClick={() => {
              if (addedAmount > 0) {
                handleOpenDialog();
                handleCloseAmountDialog();
              }
            }}
          >
            Next
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add Fund</DialogTitle>
        <DialogContent>
          <Typography sx={{ my : 2, color: 'rgba(0, 0, 0, 0.6)' }}> Select your funding source </Typography>
          <Select fullWidth value={selectedFundingOption} onChange={handleFundingOptionChange}>

            {fundingOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleOpenCardDetailsDialog}>
            Next
          </Button>
          <Button onClick={handleCloseDialog} color="error">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isCardDetailsDialogOpen} onClose={handleCloseCardDetailsDialog} maxWidth="sm" fullWidth>
      <DialogTitle>Set your funding</DialogTitle>
      <Typography sx={{ my: 0, mx: 3, color: 'rgba(0, 0, 0, 0.6)' }}> Input your card details </Typography>
      <DialogContent>
        <TextField
          fullWidth
          label="Card number"
          type="number"
          sx={{ my: 1 }}
          error={cardNumberError !== ''}
          helperText={cardNumberError}
          onChange={(e) => {
            setCardNumber(e.target.value);
            setCardNumberError('');
          }}
        />

        {/* Expiry Date */}
        <Stack direction="row" sx={{ my: 1 }}>
          <TextField
            width="10%"
            label="Expiry month"
            type="number"
            inputProps={{ maxLength: 2 }} 
            placeholder="mm"
            error={expiryMonthError !== ''}
            helperText={expiryMonthError}
            onChange={(e) => {
              setExpiryMonth(e.target.value);
              setExpiryMonthError('');
            }}
          />
          <Typography variant="h3" sx={{ mx: 3 }}>/</Typography>
          <TextField
            width="10px"
            type="number"
            placeholder="yy"
            sx={{ mx: 0 }}
            inputProps={{ maxLength: 2 }} 
            error={expiryYearError !== ''}
            helperText={expiryYearError}
            onChange={(e) => {
              setExpiryYear(e.target.value);
              setExpiryYearError('');
            }}
          />
        </Stack>

        {/* CVC */}
        <TextField
          width="10%"
          label="CVC"
          type="number"
          sx={{ my: 2 }}
          error={cvcError !== ''}
          helperText={cvcError}
          onChange={(e) => {
            setCVC(e.target.value);
            setCVCError('');
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={() => handleAddAmount(addedAmount)}>
          Next
        </Button>
        <Button onClick={handleCloseCardDetailsDialog} color="error">
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
