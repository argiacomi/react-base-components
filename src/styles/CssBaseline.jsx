import { createGlobalStyle, ThemeProvider } from 'styled-components/macro';
import { useEffect, useState } from 'react';

const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

const themes = {
  light: {
    smoothing: 'auto'
  },
  dark: {
    smoothing: 'antialiased'
  }
};

const BaseStyles = createGlobalStyle`
  *, ::before, ::after {
    box-sizing: border-box;
  }

  html {
    line-height: 1.15;
    text-size-adjust: 100%;
  }

  body {
    margin: 0px;
    line-height: inherit;
    line-break: strict;
    -webkit-tap-highlight-color: transparent;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: ${({ theme }) => theme.smoothing};
  }

  main {
    display: block;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-size: inherit;
    font-weight: inherit;
  }

  blockquote,
  dl,
  dd,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  hr,
  figure,
  p,
  pre {
    margin: 0;
  }

  ol,
  ul,
  menu {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  hr {
    height: 0;
    overflow: visible;
    color: inherit;
  }

  a {
    background-color: transparent;
    color: inherit;
    text-decoration: inherit;
  }

  abbr:where([title]) {
    border-bottom: none;
    text-decoration: underline;
    text-decoration: underline dotted;
  }

  b,
  strong {
    font-weight: bolder;
  }

  code,
  kbd,
  samp {
    font-family: monospace, monospace;
    font-size: 1em;
  }

  code,
  kbd,
  samp,
  pre {
    font-family: theme(ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace);
    font-size: 1em;
  }

  small {
    font-size: 80%;
  }

  sub,
  sup {
    font-size: 75%;
    line-height: 0;
    position: relative;
    vertical-align: baseline;
  }

  sub {
    bottom: -0.25em;
  }

  sup {
    top: -0.5em;
  }

  table {
      /*---Normalize---*/
    text-indent: 0;
    border-color: inherit;
    border-collapse: collapse;
  }

  img,
  svg,
  video,
  canvas,
  audio,
  iframe,
  embed,
  object {
    border-style: none;
    display: block;
    vertical-align: middle;
  }

  img,
  video {
    max-width: 100%;
    height: auto;
  }

  button,
  input,
  optgroup,
  select,
  textarea {
    font-family: inherit;
    font-size: 100%;
    font-weight: inherit;
    line-height: inherit;
    margin: 0;
    padding: 0; /* 3 */
  }

  button,
  input {
  overflow: visible;
  }

  button,
  select {
  text-transform: none;
  }

  button,
  [type="button"],
  [type="reset"],
  [type="submit"] {
    -webkit-appearance: button;
    background-image: none;
  }

  :-moz-focusring {
    outline: auto;
  }

  :-moz-ui-invalid {
    box-shadow: none;
  }

  fieldset {
    margin: 0;
    padding: 0;
  }

  legend {
    padding: 0;
  }

  progress {
    vertical-align: baseline;
  }

  textarea {
    overflow: auto;
    resize: vertical;
  }

  [type="number"]::-webkit-inner-spin-button,
  [type="number"]::-webkit-outer-spin-button {
    height: auto;
  }

  [type="search"] {
    -webkit-appearance: textfield;
    outline-offset: -2px;
  }

  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  ::-webkit-file-upload-button {
    -webkit-appearance: button;
    font: inherit;
  }

  details {
    display: block;
  }

  summary {
    display: list-item;
  }

  template {
    display: none;
  }

  input::placeholder,
  textarea::placeholder {
    opacity: 1
    color: #9ca3af
  }

  :disabled {
    cursor: default;
  }

  [hidden] {
    display: none;
  }
`;

const CssBaseline = () => {
  const [theme, setTheme] = useState(darkModeQuery.matches ? 'dark' : 'light');

  useEffect(() => {
    darkModeQuery.addListener((event) => {
      setTheme(event.matches ? 'dark' : 'light');
    });
  });

  return (
    <ThemeProvider theme={themes[theme]}>
      <BaseStyles />
    </ThemeProvider>
  );
};

export default CssBaseline;
