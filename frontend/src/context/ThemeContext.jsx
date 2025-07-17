import React, { createContext, useContext, useState, useEffect } from 'react';
import { Sun, Sparkle, Lightning, Palette } from 'phosphor-react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'aiStudio');

  const themes = [
    { name: 'light', label: 'Light', description: 'Clean and bright', icon: Sun },
    { name: 'aiStudio', label: 'AI Studio', description: 'Modern dark theme', icon: Sparkle },
    { name: 'blackout', label: 'Blackout', description: 'Pure black theme', icon: Lightning },
  ];

  useEffect(() => {
    console.log('Theme changed to:', theme);
    localStorage.setItem('theme', theme);
    document.querySelector('html').setAttribute('data-theme', theme);

    // Add theme-specific body class
    document.body.className = `theme-${theme}`;
  }, [theme]);

  const changeTheme = (newTheme) => {
    console.log('Changing theme from', theme, 'to', newTheme);
    setTheme(newTheme);
  };

  const getCurrentTheme = () => {
    return themes.find(t => t.name === theme) || themes[1];
  };

  const value = {
    theme,
    themes,
    changeTheme,
    getCurrentTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 
