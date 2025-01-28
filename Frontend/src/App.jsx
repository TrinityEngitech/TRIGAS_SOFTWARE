
import React, { useState, useEffect } from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";


// Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// Pages
import AdminPanel from "./component/AdminPanel";
import Login from "./Authentication/Login";

function App() {
  // State to track authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Regex to validate basic JWT structure (three parts separated by dots)
  const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;

  // Function to check if the token is valid
  const isTokenValid = () => {
    const token = localStorage.getItem("token");
    return token && jwtRegex.test(token);
  };

  // Check authentication status on initial load
  useEffect(() => {
    if (isTokenValid()) {
      setIsAuthenticated(true);
    } else {
      handleLogout();
    }
  }, []);

  // Watch for token changes in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      if (!isTokenValid()) {
        handleLogout();
      }
    };

    // Add event listener for storage changes
    window.addEventListener("storage", handleStorageChange);

    // Cleanup the event listener
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Function to handle login
  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
  };

  // Function to handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.clear(); // Clear all localStorage data
  };

  return (
    <div>
      {isAuthenticated ? (
        <AdminPanel onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
