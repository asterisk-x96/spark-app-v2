import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export default function UserProvider({ children }) {
  // Load user data from localStorage if available, otherwise use default values
  const initialUserData = JSON.parse(localStorage.getItem('currentUser')) || {
    firstName: '',
    lastName: '',
    // You can include other user-related information here.
  };

  const [user, setUser] = useState(initialUserData);

  useEffect(() => {
    // Save user data to localStorage whenever it changes
    localStorage.setItem('currentUser', JSON.stringify(user));
  }, [user]);

  console.log('User data in UserContext.js:', user);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}