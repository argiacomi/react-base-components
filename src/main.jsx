import React from 'react';
import ReactDOM from 'react-dom/client';
import { StyleSheetManager } from 'styled-components/macro';
import { CssBaseline, GlobalStyles, GlobalTheme } from '@styles';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StyleSheetManager disableCSSOMInjection>
      <GlobalTheme>
        <GlobalStyles />
        <CssBaseline />
        <App />
      </GlobalTheme>
    </StyleSheetManager>
  </React.StrictMode>
);
