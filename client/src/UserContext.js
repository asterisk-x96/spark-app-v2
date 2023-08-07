import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export default function UserProvider({ children }) {
  // Load user data from localStorage if available, otherwise use default values
  const initialUserData = JSON.parse(localStorage.getItem('currentUser')) || {
    _id: '',
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    avatar: '',
    friends: [],
    fund: 0,
    // Include other fields from the userModel.js schema
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
