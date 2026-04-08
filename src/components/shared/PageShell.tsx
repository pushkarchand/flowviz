import React from 'react';
import { Outlet } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from '@styles/GlobalStyles';
import { NavBar } from './NavBar';
import { useThemeContext } from '@contexts/ThemeContext';

export const PageShell: React.FC = () => {
  const { currentTheme } = useThemeContext();

  return (
    <ThemeProvider theme={currentTheme}>
      <GlobalStyles />
      <NavBar />
      <Outlet />
    </ThemeProvider>
  );
};
