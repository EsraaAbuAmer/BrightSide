import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeContextType = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleDarkMode: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      const darkModeState = await AsyncStorage.getItem('isDarkMode');
      setIsDarkMode(darkModeState === 'true');
    };

    loadTheme();
  }, []);

  const toggleDarkMode = async () => {
    setIsDarkMode((prevState) => {
      const newState = !prevState;
      AsyncStorage.setItem('isDarkMode', newState.toString());
      return newState;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);