import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export default function UserProvider({ children }) {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    // You can include other user-related information here.
  });

  console.log('User data in context:', user);

  // Create a new function to handle updating the user context
  const updateUser = (userData) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...userData,
    }));
  };

  return (
    <UserContext.Provider value={{ user, setUser: updateUser }}>
      {children}
    </UserContext.Provider>
  );
}