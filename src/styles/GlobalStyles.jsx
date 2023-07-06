import { createGlobalStyle, ThemeProvider } from 'styled-components/macro';
import { useEffect, useState } from 'react';

const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

const themes = {
  light: {
    background: '#ffffff',
    text: '#0f0f0f'
  },
  dark: {
    background: '#000000',
    text: '#ffffff'
  }
};

const BaseCustomStyles = createGlobalStyle`
  body {
    font-family: 'Source Sans Pro', 'Schibsted Grotesk', 'Lato', 'Montserrat', 'Poppins', sans-serif;
    color: ${({ theme }) => theme.text};
    background-color: ${({ theme }) => theme.background};
  }
`;

const GlobalStyles = () => {
  const [theme, setTheme] = useState(darkModeQuery.matches ? 'dark' : 'light');

  useEffect(() => {
    darkModeQuery.addListener((event) => {
      setTheme(event.matches ? 'dark' : 'light');
    });
  });

  return (
    <ThemeProvider theme={themes[theme]}>
      <BaseCustomStyles />
    </ThemeProvider>
  );
};

export default GlobalStyles;
