import { createGlobalStyle } from 'styled-components/macro';

const BaseCustomStyles = createGlobalStyle`
  :root {
    --color-mode: light;
    --color-active: rgba(0, 0, 0, 0.54);
    --color-hover: rgba(60, 64, 67, 0.08);
    --color-hoverOpacity: 0.12;
    --color-selected: rgba(0, 0, 0, 0.08);
    --color-selectedOpacity: 0.08;
    --color-disabledBackground: rgba(0, 0, 0, 0.12);
    --color-disabledOpacity: 0.38;
    --color-focus: rgba(0, 0, 0, 0.12);
    --color-focusOpacity: 0.12;
    --color-activatedOpacity: 0.12;
    --color-background: rgb(242, 242, 242);
    --color-disabled-body: rgb(205, 205, 205);
    --color-disabled-text: rgb(143, 143, 143);
    --color-divider: rgb(175, 175, 175);
    --color-text-primary: rgba(0, 0, 0, 0.89);
    --color-text-secondary: rgba(0, 0, 0, 0.6);
    --color-monochrome-body: rgb(0, 0, 0);
    --color-monochrome-text: rgb(255, 255, 255);
    --color-monochrome-200: rgb(117, 117, 117);
    --color-monochrome-300: rgb(97, 97, 97);
    --color-monochrome-400: rgb(66, 66, 66);
    --color-monochrome-500: rgb(33, 33, 33);
    --color-monochrome-600: rgb(0, 0, 0);
  }

  body {
    font-family: 'Source Sans Pro', 'Schibsted Grotesk', 'Lato', 'Montserrat', 'Poppins', sans-serif;
    background-color: rgb(252, 252, 252);
    color: rgb(15, 15, 15);
  }

  @media (prefers-color-scheme: dark) {
    --color-mode: dark;
    --color-active: rgb(255, 255, 255);
    --color-hover: rgba(255, 255, 255, 0.08);
    --color-hoverOpacity: 0.24;
    --color-selected: rgba(255, 255, 255, 0.16);
    --color-selectedOpacity: 0.16;
    --color-disabledOpacity: 0.38;
    --color-focus: rgba(255, 255, 255, 0.12);
    --color-focusOpacity: 0.12;
    --color-activatedOpacity: 0.24;
    --color-background: rgb(16, 16, 16);
    --color-disabled-body: rgba(255, 255, 255, 0.25);
    --color-disabled-text: rgb(97, 97, 97);
    --color-divider: rgb(97, 97, 97);
    --color-text-primary: rgb(255, 255, 255);
    --color-text-secondary: rgba(255, 255, 255, 0.7);
    --color-monochrome-body: rgb(255, 255, 255);
    --color-monochrome-text: rgb(0, 0, 0);
    --color-monochrome-200: rgb(189, 189, 189);
    --color-monochrome-300: rgb(224, 224, 224);
    --color-monochrome-400: rgb(238, 238, 238);
    --color-monochrome-500: rgb(242, 242, 242);
    --color-monochrome-600: rgb(252, 252, 252);

    body {
      background-color: rgb(0, 0, 0);
      color: rgb(252, 252, 252);
    }
  }
`;

export const GlobalStyles = () => {
  return <BaseCustomStyles />;
};
