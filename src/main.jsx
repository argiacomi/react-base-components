import { StyleSheetManager } from 'styled-components/macro';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline, GlobalStyles, GlobalTheme, shouldForwardProp } from '@styles';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CssBaseline />
    <GlobalStyles />
    <StyleSheetManager
      // disableCSSOMInjection
      // enableVendorPrefixes
      shouldForwardProp={shouldForwardProp}
    >
      <GlobalTheme>
        <App />
      </GlobalTheme>
    </StyleSheetManager>
  </React.StrictMode>
);
