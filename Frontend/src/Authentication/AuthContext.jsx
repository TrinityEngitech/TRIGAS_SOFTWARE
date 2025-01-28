import React, { createContext, useContext, useState } from 'react';

// Create context
const AuthContext = createContext();

// Create a provider to wrap your app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // User state to manage logged-in user

  const login = (userData) => {
    setUser(userData); // Set user data after login
  };

  const logout = () => {
    setUser(null); // Clear user data on logout
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);
