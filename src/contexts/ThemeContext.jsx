import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { lightTheme, darkTheme } from '../theme';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(lightTheme);

  useEffect(() => {
    // Check if user has previously set a theme preference
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      setDarkMode(savedTheme === 'true');
    }
  }, []);

  useEffect(() => {
    // Update theme when darkMode changes
    setCurrentTheme(darkMode ? darkTheme : lightTheme);
    // Save preference to localStorage
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <MuiThemeProvider theme={currentTheme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};