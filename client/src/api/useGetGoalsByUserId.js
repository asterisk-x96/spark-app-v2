import { useEffect, useState } from 'react';
import { useUserContext } from '../UserContext';

export default function useGetGoalsByUserId() {
  const { user } = useUserContext();
  const [goals, setGoals] = useState([]);

  const userId = user.id;

  const fetchGoals = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/get-goals/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch goals');
      }
      const data = await response.json();

      // Sort goals array by created_date in descending order
      const sortedGoals = data.goals.sort((a, b) => {
        const dateA = new Date(a.created_date);
        const dateB = new Date(b.created_date);
        return dateB - dateA;
      });

      setGoals(sortedGoals); // Update the goals state with sorted goals
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  useEffect(() => {
    fetchGoals(userId); // Fetch goals when the component mounts
  }, [userId]);

  return goals;
}
