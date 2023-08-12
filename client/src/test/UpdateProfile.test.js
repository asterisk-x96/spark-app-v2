import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'
import UpdateProfile from '../sections/profile/UpdateProfile';
import useGetCurrentUserDetails from '../api/useGetCurrentUserDetails';

// ----------------------------------------------------------------

// Mocking the custom hook
jest.mock('../api/useGetCurrentUserDetails', () => jest.fn());

describe('UpdateProfile', () => {
  // Mock the fetch function
  global.fetch = jest.fn();

  it('renders the user details', async () => {
    const mockUserDetails = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      bio: 'Frontend Developer',
      email: 'john@example.com',
      avatar: 'profile.jpg',
    };

    // Mock the custom hook's return value
    useGetCurrentUserDetails.mockReturnValue(mockUserDetails);

    render(<UpdateProfile />);

    // Verify that user details are displayed
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByAltText('('Profile Picture')).toHaveAttribute('src', 'profile.jpg');
    expect(screen.getByLabelTextFirst Name')).toHaveValue('John');
    expect(screen.getByLabelText('Last Name')).toHaveValue('Doe');
    expect(screen.getByLabelText('Bio')).toHaveValue('Frontend Developer');
    expect(screen.getByLabelText('Email Address')).toHaveValue('john@example.com');
    expect(screen.getByLabelText('Profile Picture URL')).toHaveValue('profile.jpg');
  });

  it('updates user profile when clicking the "Update Profile" button', async () => {
    const mockUserDetails = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      bio: 'Frontend Developer',
      email: 'john@example.com',
      avatar: 'profile.jpg',
    };

    // Mock the custom hook's return value
    useGetCurrentUserDetails.mockReturnValue(mockUserDetails);

    render(<UpdateProfile />);

    // Mock a successful response from the fetch call
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => mockUserDetails,
    });

    // Fill in the input fields
    fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'Updated John' } });
    fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Updated Doe' } });
    fireEvent.change(screen.getByLabelText('Bio'), { target: { value: 'Updated Developer' } });

    // Click the "Update Profile" button
    fireEvent.click(screen.getByText('Update Profile'));

    // Wait for the update to complete
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        `http://localhost:5000/api/update-user/${mockUserDetails.id}`,
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({
            firstName: 'Updated John',
            lastName: 'Updated Doe',
            bio: 'Updated Developer',
            email: 'john@example.com',
            profilePicture: 'profile.jpg',
          }),
        })
      );
    });
  });
});
