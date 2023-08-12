import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserFundPage from '../pages/UserFund'; // Update the import path accordingly
import useGetCurrentUserDetails from '../api/useGetCurrentUserDetails';

jest.mock('../api/useGetCurrentUserDetails', () => jest.fn());

describe('UserFundPage component', () => {
  global.fetch = jest.fn();

  it('renders without crashing', () => {
    render(<UserFundPage />);
  });

  it('displays the initial user fund amount', () => {
    const mockUserDetails = { fund: 100 };
    useGetCurrentUserDetails.mockReturnValue(mockUserDetails);

    render(<UserFundPage />);
    const fundAmount = screen.getByText('100');
    expect(fundAmount).toBeInTheDocument();
  });

  it('performs an example interaction', async () => {
    const mockUserDetails = { fund: 100 };
    useGetCurrentUserDetails.mockReturnValue(mockUserDetails);

    render(<UserFundPage />);

    const addFundButton = screen.getByText('Add fund');
    fireEvent.click(addFundButton);

    // Perform more interactions based on your component's behavior
    // For example, interacting with dialogs, inputs, and buttons

    // Here, you can assert the expected behavior or state changes
    // For instance, asserting that a dialog has opened or a value has changed
  });

  // Add more test cases for various interactions and states
});
