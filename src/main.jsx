import React from 'react';
import ReactDOM from 'react-dom/client';
import { shouldForwardProp } from '@styles';
import { StyleSheetManager } from 'styled-components/macro';
import { CssBaseline, GlobalStyles, GlobalTheme } from '@styles';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CssBaseline />
    <GlobalStyles />
    <StyleSheetManager
      disableCSSOMInjection
      enableVendorPrefixes
      shouldForwardProp={shouldForwardProp}
    >
      <GlobalTheme>
        <App />
      </GlobalTheme>
    </StyleSheetManager>
  </React.StrictMode>
);
