import Color from 'color';
import { keyframes, ThemeProvider } from 'styled-components/macro';
import {
  createBreakpoints,
  createTransitions,
  getOverlappingBreakpoints,
  traverseBreakpoints
} from '../components/lib/helpers';

export const baseTheme = {
  spacing: (...spaces) => spaces.map((space) => `${space * 0.5}rem`).join(' '),
  pxToRem: (...px) => {
    return px
      .map((value) => {
        let int;
        if (typeof value === 'string') int = px.match(/(\d+)px/);
        if (typeof value === 'string') {
          return `${int(int.group(1)) / 16}rem`;
        }
        return `${value / 16}rem`;
      })
      .join(' ');
  },
  alpha: {
    overlay: (elevation = 0) => {
      const alphaValue = 4.5 * Math.log(elevation + 1) + 2;
      return (alphaValue / 100).toFixed(2);
    },
    add: (color, alpha = 0.05) => {
      const colorObj = Color(color).alpha(alpha);
      return colorObj.string();
    },
    lighten: (color, coefficient = 0.15) => {
      const colorObj = Color(color).lighten(coefficient);
      return colorObj.string();
    },
    darken: (color, coefficient = 0.15) => {
      const colorObj = Color(color).darken(coefficient);
      return colorObj.string();
    },
    emphasize: (color, coefficient = 0.15) => {
      const colorObj = Color(color).isLight()
        ? Color(color).darken(coefficient)
        : Color(color).lighten(coefficient);
      return colorObj.string();
    },
    contrastText: (color) => {
      return Color(color).contrast(Color('rgba(0, 0, 0, 0.89)')) >= 3
        ? 'rgba(0, 0, 0, 0.89)'
        : 'rgba(252, 252, 252,)';
    },
    getColorFromPath: (obj, path) => {
      if (typeof path === 'string') {
        const parts = path.split('.');
        let currentPart = obj.color;

        for (const part of parts) {
          if (currentPart[part] !== undefined) {
            currentPart = currentPart[part];
          } else {
            return undefined;
          }
        }

        if (typeof currentPart === 'object') {
          return currentPart[500];
        }

        return currentPart;
      } else if (typeof path === 'function') {
        return path(obj);
      }
    }
  },
  breakpoints: {
    keys: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
    values: {
      xs: '0px',
      sm: '480px',
      md: '768px',
      lg: '1280px',
      xl: '1536px',
      '2xl': '1920px'
    },
    default: { xs: '0px' },
    step: 5,
    unit: 'px',
    create: (breakpoints = baseTheme.breakpoints) => createBreakpoints(breakpoints),
    traverse: (breakpointBase, layoutConfig, iterator) =>
      traverseBreakpoints(breakpointBase, layoutConfig, iterator),
    overlap: (props) => getOverlappingBreakpoints(props),
    up: (key) => {
      const value = baseTheme.breakpoints.values[key];
      return `@media (min-width:${value})`;
    },
    down: (key) => {
      const value = baseTheme.breakpoints.values[key];
      return `@media (max-width:${Number.parseInt(value) - baseTheme.breakpoints.step / 100}${
        baseTheme.breakpoints.unit
      })`;
    },
    between: (start, end) => {
      const breakpointKeys =
        typeof baseTheme.breakpoints.keys === 'function'
          ? baseTheme.breakpoints.keys()
          : baseTheme.breakpoints.keys;
      const endIndex = breakpointKeys.indexOf(end);
      return (
        baseTheme.breakpoints.up(start) +
        ' and ' +
        `${endIndex !== -1 && baseTheme.breakpoints.down(end)}`
      );
    },
    only: (key) => {
      const breakpointKeys =
        typeof baseTheme.breakpoints.keys === 'function'
          ? baseTheme.breakpoints.keys()
          : baseTheme.breakpoints.keys;
      if (breakpointKeys.indexOf(key) + 1 < breakpointKeys.length) {
        return baseTheme.breakpoints.between(key, breakpointKeys[breakpointKeys.indexOf(key) + 1]);
      }
      return baseTheme.breakpoints.up(key);
    },
    not: (key) => {
      const breakpointKeys =
        typeof baseTheme.breakpoints.keys === 'function'
          ? baseTheme.breakpoints.keys()
          : baseTheme.breakpoints.keys;
      const keyIndex = breakpointKeys.indexOf(key);
      if (keyIndex === 0) {
        return baseTheme.breakpoints.up(breakpointKeys[1]);
      }
      if (keyIndex === breakpointKeys.length - 1) {
        return baseTheme.breakpoints.down(breakpointKeys[keyIndex]);
      }

      return baseTheme.breakpoints
        .between(key, breakpointKeys[breakpointKeys.indexOf(key) + 1])
        .replace('@media', '@media not all and');
    }
  },
  color: {
    mode: 'var(--color-mode)',
    active: 'var(--color-active)',
    current: 'currentColor',
    background: 'var(--color-background)',
    disabledBackground: 'var(--color-disabledBackground)',
    disabled: {
      body: 'var(--color-disabled-body)',
      text: 'var(--color-disabled-text)'
    },
    divider: 'var(--color-divider)',
    focus: 'var(--color-focus)',
    hover: 'var(--color-hover)',
    selected: 'var(--color-selected)',
    transparent: 'transparent',
    activatedOpacity: 'var(--color-activatedOpacity)',
    disabledOpacity: 'var(--color-disabledOpacity)',
    focusOpacity: 'var(--color-focusOpacity)',
    hoverOpacity: 'var(--color-hoverOpacity)',
    selectedOpacity: 'var(--color-selectedOpacity)',
    text: {
      primary: 'var(--color-text-primary)',
      secondary: 'var(--color-text-secondary)'
    },
    white: 'rgb(255, 255, 255)',
    black: 'rgb(0, 0, 0)',
    primary: {
      body: 'rgb(29, 117, 222)',
      text: 'rgb(255, 255, 255)',
      200: 'rgb(165, 200, 242)',
      300: 'rgb(119, 172, 235)',
      400: 'rgb(74, 145, 229)',
      500: 'rgb(29, 117, 222)',
      600: 'rgb(23, 94, 178)'
    },
    secondary: {
      body: 'rgb(151, 80, 221)',
      text: 'rgb(255, 255, 255)',
      200: 'rgb(213, 185, 241)',
      300: 'rgb(193, 150, 235)',
      400: 'rgb(172, 115, 228)',
      500: 'rgb(151, 80, 221)',
      600: 'rgb(121, 64, 177)'
    },
    success: {
      body: 'rgb(30, 215, 95)',
      text: 'rgb(255, 255, 255)',
      200: 'rgb(165, 239, 191)',
      300: 'rgb(120, 231, 159)',
      400: 'rgb(75, 223, 127)',
      500: 'rgb(30, 215, 95)',
      600: 'rgb(24, 172, 76)'
    },
    warning: {
      body: 'rgb(251, 188, 5)',
      text: 'rgb(255, 255, 255)',
      200: 'rgb(253, 228, 155)',
      300: 'rgb(253, 215, 105)',
      400: 'rgb(252, 201, 55)',
      500: 'rgb(251, 188, 5)',
      600: 'rgb(201, 150, 4)'
    },
    danger: {
      body: 'rgb(234, 67, 53)',
      text: 'rgb(255, 255, 255)',
      200: 'rgb(247, 180, 174)',
      300: 'rgb(242, 142, 134)',
      400: 'rgb(238, 105, 93)',
      500: 'rgb(234, 67, 53)',
      600: 'rgb(187, 54, 42)'
    },
    default: {
      body: 'rgb(158, 158, 158)',
      text: 'rgb(255, 255, 255)',
      200: 'rgb(238, 238, 238)',
      300: 'rgb(224, 224, 224)',
      400: 'rgb(189, 189, 189)',
      500: 'rgb(158, 158, 158)',
      600: 'rgb(117, 117, 117)'
    },
    gray: {
      50: 'rgb(250, 250, 250)',
      100: 'rgb(245, 245, 245)',
      200: 'rgb(242, 242, 242)',
      300: 'rgb(238, 238, 238)',
      400: 'rgb(224, 224, 224)',
      500: 'rgb(189, 189, 189)',
      600: 'rgb(158, 158, 158)',
      700: 'rgb(117, 117, 117)',
      800: 'rgb(97, 97, 97)',
      900: 'rgb(66, 66, 66)',
      1000: 'rgb(33, 33, 33)'
    },
    monochrome: {
      body: 'var(--color-monochrome-body)',
      text: 'var(--color-monochrome-text)',
      200: 'var(--color-monochrome-200)',
      300: 'var(--color-monochrome-300)',
      400: 'var(--color-monochrome-400)',
      500: 'var(--color-monochrome-500)',
      600: 'var(--color-monochrome-600)'
    }
  },
  dropShadow: {
    0: 'drop-shadow(0 0px rgba(0 0 0 / 0))',
    1: 'drop-shadow(0 1px 2px rgb(0 0 0 / 0.1)) drop-shadow(0 1px 1px rgb(0 0 0 / 0.06))',
    2: 'drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06))',
    3: 'drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1))',
    4: 'drop-shadow(0 20px 13px rgb(0 0 0 / 0.03)) drop-shadow(0 8px 5px rgb(0 0 0 / 0.08))',
    5: 'drop-shadow(0 25px 25px rgb(0 0 0 / 0.15))'
  },
  boxShadow: {
    0: 'none',
    1: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    2: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    3: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    4: '0px 2px 4px -1px rgb(0 0 0 / 0.2), 0px 4px 5px 0px rgb(0 0 0 / 0.14), 0px 1px 10px 0px rgb(0 0 0 / 0.12)',
    5: '0px 3px 5px -1px rgb(0 0 0 / 0.2), 0px 5px 8px 0px rgb(0 0 0 / 0.14), 0px 1px 14px 0px rgb(0 0 0 / 0.12)',
    6: '0px 3px 5px -1px rgb(0 0 0 / 0.2), 0px 6px 10px 0px rgb(0 0 0 / 0.14), 0px 1px 18px 0px rgb(0 0 0 / 0.12)',
    7: '0px 4px 5px -2px rgb(0 0 0 / 0.2), 0px 7px 10px 1px rgb(0 0 0 / 0.14), 0px 2px 16px 1px rgb(0 0 0 / 0.12)',
    8: '0px 5px 5px -3px rgb(0 0 0 / 0.2), 0px 8px 10px 1px rgb(0 0 0 / 0.14), 0px 3px 14px 2px rgb(0 0 0 / 0.12)',
    9: '0px 5px 6px -3px rgb(0 0 0 / 0.2), 0px 9px 12px 1px rgb(0 0 0 / 0.14), 0px 3px 16px 2px rgb(0 0 0 / 0.12)',
    10: '0px 6px 6px -3px rgb(0 0 0 / 0.2), 0px 10px 14px 1px rgb(0 0 0 / 0.14), 0px 4px 18px 3px rgb(0 0 0 / 0.12)',
    11: '0px 6px 7px -4px rgb(0 0 0 / 0.2), 0px 11px 15px 1px rgb(0 0 0 / 0.14), 0px 4px 20px 3px rgb(0 0 0 / 0.12)',
    12: '0px 7px 8px -4px rgb(0 0 0 / 0.2), 0px 12px 17px 2px rgb(0 0 0 / 0.14), 0px 5px 22px 4px rgb(0 0 0 / 0.12)',
    13: '0px 7px 8px -4px rgb(0 0 0 / 0.2), 0px 13px 19px 2px rgb(0 0 0 / 0.14), 0px 5px 24px 4px rgb(0 0 0 / 0.12)',
    14: '0px 7px 9px -4px rgb(0 0 0 / 0.2), 0px 14px 21px 2px rgb(0 0 0 / 0.14), 0px 5px 26px 4px rgb(0 0 0 / 0.12)',
    15: '0px 8px 9px -5px rgb(0 0 0 / 0.2), 0px 15px 22px 2px rgb(0 0 0 / 0.14), 0px 6px 28px 5px rgb(0 0 0 / 0.12)',
    16: '0px 8px 10px -5px rgb(0 0 0 / 0.2), 0px 16px 24px 2px rgb(0 0 0 / 0.14), 0px 6px 30px 5px rgb(0 0 0 / 0.12)',
    17: '0px 8px 11px -5px rgb(0 0 0 / 0.2), 0px 17px 26px 2px rgb(0 0 0 / 0.14), 0px 6px 32px 5px rgb(0 0 0 / 0.12)',
    18: '0px 9px 11px -5px rgb(0 0 0 / 0.2), 0px 18px 28px 2px rgb(0 0 0 / 0.14), 0px 7px 34px 6px rgb(0 0 0 / 0.12)',
    19: '0px 9px 12px -6px rgb(0 0 0 / 0.2), 0px 19px 29px 2px rgb(0 0 0 / 0.14), 0px 7px 36px 6px rgb(0 0 0 / 0.12)',
    20: '0px 10px 13px -6px rgb(0 0 0 / 0.2), 0px 20px 31px 3px rgb(0 0 0 / 0.14), 0px 8px 38px 7px rgb(0 0 0 / 0.12)',
    21: '0px 10px 13px -6px rgb(0 0 0 / 0.2), 0px 21px 33px 3px rgb(0 0 0 / 0.14), 0px 8px 40px 7px rgb(0 0 0 / 0.12)',
    22: '0px 10px 14px -6px rgb(0 0 0 / 0.2), 0px 22px 35px 3px rgb(0 0 0 / 0.14), 0px 8px 42px 7px rgb(0 0 0 / 0.12)',
    23: '0px 11px 14px -7px rgb(0 0 0 / 0.2), 0px 23px 36px 3px rgb(0 0 0 / 0.14), 0px 9px 44px 8px rgb(0 0 0 / 0.12)',
    24: '0px 11px 15px -7px rgb(0 0 0 / 0.2), 0px 24px 38px 3px rgb(0 0 0 / 0.14), 0px 9px 46px 8px rgb(0 0 0 / 0.12)',
    fab: '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)',
    fabActive:
      '0px 7px 8px -4px rgba(0,0,0,0.2),0px 12px 17px 2px rgba(0,0,0,0.14),0px 5px 22px 4px rgba(0,0,0,0.12)',
    popper:
      '0 6px 16px 0 rgba(0 0 0 / 0.08), 0 3px 6px -4px rgba(0 0 0 / 0.12), 0 9px 28px 8px rgba(0 0 0 / 0.05)',
    popperArrow: '2px 2px 5px rgba(0 0 0 / 0.05)'
  },
  keyframe: {
    enterKeyframe: keyframes`
      0% {
        transform: scale(0);
        opacity: 0.1;
      }
      100% {
        transform: scale(1);
        opacity: 0.3;
      }
    `,
    exitKeyframe: keyframes`
      0% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    `,
    pulsateKeyframe: keyframes`
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(0.92);
      }
      100% {
        transform: scale(1);
      }
    `,
    pulseKeyframe: keyframes`
      0%, 100% {
        opacity: 1
      }
      50% {
        opacity: .5
      }
    `,
    waveKeyframe: keyframes`
      0% {
        transform: translateX(-100%);x
      }
      50%, 100% {
        transform: translateX(100%);
      }
    `
  },
  rounded: {
    none: '0px',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px'
  },
  text: {
    size: {
      xs: { fontSize: '0.75rem', lineHeight: '1rem' },
      sm: { fontSize: '0.875rem', lineHeight: '1.25rem' },
      base: { fontSize: '1rem', lineHeight: '1.5rem' },
      lg: { fontSize: '1.125rem', lineHeight: '1.75rem' },
      xl: { fontSize: '1.25rem', lineHeight: '1.75rem' },
      '2xl': { fontSize: '1.5rem', lineHeight: '2rem' },
      '3xl': { fontSize: '1.875rem', lineHeight: '2.25rem' },
      '4xl': { fontSize: '2.25rem', lineHeight: '2.5rem' },
      '5xl': { fontSize: '3rem', lineHeight: '1' },
      '6xl': { fontSize: '3.75rem', lineHeight: '1' },
      '7xl': { fontSize: '4.5rem', lineHeight: '1' },
      '8xl': { fontSize: '6rem', lineHeight: '1' },
      '9xl': { fontSize: '8rem', lineHeight: '1' }
    },
    weight: {
      thin: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900'
    },
    typography: {
      htmlFontSize: 16,
      fontFamily:
        "'Source Sans Pro', 'Schibsted Grotesk', 'Lato', 'Montserrat', 'Poppins', sans-serif",
      fontSize: 14,
      body1: { fontWeight: 400, fontSize: '1rem', lineHeight: 1.5, letterSpacing: '0.00938em' },
      body2: {
        fontWeight: 400,
        fontSize: '0.875rem',
        lineHeight: 1.43,
        letterSpacing: '0.01071em'
      },
      button: {
        fontWeight: 700,
        fontSize: '0.875rem',
        lineHeight: 1.75,
        letterSpacing: '0.02857em',
        textTransform: 'uppercase'
      },
      caption: {
        fontWeight: 400,
        fontSize: '0.75rem',
        lineHeight: 1.66,
        letterSpacing: '0.03333em'
      },
      h1: { fontWeight: 300, fontSize: '6rem', lineHeight: 1.167, letterSpacing: '-0.01562em' },
      h2: { fontWeight: 300, fontSize: '3.75rem', lineHeight: 1.2, letterSpacing: '-0.00833em' },
      h3: { fontWeight: 400, fontSize: '3rem', lineHeight: 1.167, letterSpacing: '0em' },
      h4: { fontWeight: 400, fontSize: '2.125rem', lineHeight: 1.235, letterSpacing: '0.00735em' },
      h5: { fontWeight: 400, fontSize: '1.5rem', lineHeight: 1.334, letterSpacing: '0em' },
      h6: { fontWeight: 500, fontSize: '1.25rem', lineHeight: 1.6, letterSpacing: '0.0075em' },
      inherit: {
        fontFamily: 'inherit',
        fontWeight: 'inherit',
        fontSize: 'inherit',
        lineHeight: 'inherit',
        letterSpacing: 'inherit'
      },
      overline: {
        fontWeight: 400,
        fontSize: '0.75rem',
        lineHeight: 2.66,
        letterSpacing: '0.08333em',
        textTransform: 'uppercase'
      },
      subtitle1: {
        fontWeight: 400,
        fontSize: '1rem',
        lineHeight: 1.75,
        letterSpacing: '0.00938em'
      },
      subtitle2: {
        fontWeight: 500,
        fontSize: '0.875rem',
        lineHeight: 1.57,
        letterSpacing: '0.00714em'
      }
    }
  },
  transition: {
    create: (props, options) => createTransitions(props, options),
    duration: {
      duration0: 0,
      duration25: 25,
      duration50: 50,
      duration75: 75,
      duration100: 100,
      duration350: 350,
      duration400: 400,
      duration450: 450,
      duration500: 500,
      duration550: 550,
      duration600: 600,
      duration650: 650,
      duration700: 700,
      duration750: 750,
      duration800: 800,
      duration850: 850,
      duration900: 900,
      duration950: 950,
      duration1000: 1000,
      shortest: 150,
      shorter: 200,
      short: 250,
      leavingScreen: 195,
      enteringScreen: 225,
      standard: 300,
      complex: 375,
      ripple: 550
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      linear: 'linear',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)'
    }
  },
  zIndex: {
    mobileStepper: 1000,
    fab: 1050,
    speedDial: 1050,
    appBar: 1100,
    drawer: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500
  }
};

export const GlobalTheme = ({ children }) => {
  return <ThemeProvider theme={baseTheme}>{children}</ThemeProvider>;
};
