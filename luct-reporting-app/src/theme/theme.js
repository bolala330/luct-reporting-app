import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const colors = {
  bg: '#0f0f0f',
  bgCard: '#1a1a1a',
  bgElevated: '#242424',
  fg: '#f5f0e8',
  fgMuted: '#8a8478',
  accent: '#d4a853',
  accentDim: 'rgba(212,168,83,0.15)',
  accentGlow: 'rgba(212,168,83,0.3)',
  success: '#4ade80',
  warning: '#fb923c',
  danger: '#f87171',
  border: '#2a2a2a',
  glass: 'rgba(26,26,26,0.85)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  heading: { fontFamily: 'PlayfairDisplay-Bold', fontSize: 28, fontWeight: '700' },
  subheading: { fontFamily: 'Poppins-SemiBold', fontSize: 18, fontWeight: '600' },
  body: { fontFamily: 'Poppins-Regular', fontSize: 14, fontWeight: '400' },
  caption: { fontFamily: 'Poppins-Regular', fontSize: 12, fontWeight: '400' },
  label: { fontFamily: 'Poppins-Medium', fontSize: 12, fontWeight: '500' },
};

export function ThemeProvider({ children }) {
  const [theme] = useState({ colors, spacing, typography });

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}