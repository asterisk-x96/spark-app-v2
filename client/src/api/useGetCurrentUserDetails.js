import { useEffect, useState } from 'react';
import { useUserContext } from '../UserContext';

export default function useGetCurrentUserDetails() {
  const { user } = useUserContext();
  const [userDetails, setUserDetails] = useState({});
  
  useEffect(() => {
    const fetchUserDetails = async (userId) => {
      try {
        const response = await fetch(`http://localhost:5000/api/user-details/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }
        const data = await response.json();
        setUserDetails(data);
      } catch (error) {
        console.error('Error fetching user details:', error);
        setUserDetails({});
      }
    };
    
    fetchUserDetails(user.id);

  }, [user.id]);

  return userDetails;
}