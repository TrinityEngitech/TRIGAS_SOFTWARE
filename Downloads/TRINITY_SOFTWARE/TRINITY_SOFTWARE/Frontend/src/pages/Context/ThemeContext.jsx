import React, { createContext, useState, useContext } from "react";

// Create Theme Context
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState("light"); // Default theme

    // Toggle theme between light and dark
    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Custom hook for consuming ThemeContext
export const useTheme = () => useContext(ThemeContext);
