/** @type {import('tailwindcss').Config} */

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  corePlugins: { preflight: false },
  important: '#root',
  theme: {
    fontFamily: {
      sans: ['Lato', 'Montserrat', 'Poppins', 'Source Sans Pro']
    },
    screens: {
      sm: '480px',
      md: '768px',
      lg: '1024px',
      xl: '1440px',
      '2xl': '1920px',
      max: '2560px'
    },
    extend: {
      boxShadow: {
        paper1:
          '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
        paper2:
          '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)',
        paper3:
          '0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)',
        paper4:
          '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)'
      },
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        white: '#FFFFFF',
        black: '#000000',
        disabledLight: '#bdbdbd',
        disabledDark: '#9e9e9e',
        disabledText: '#616161',
        separatorLight: 'rgba(0, 0, 0, 0.2)',
        separatorDark: 'rgba(255, 255, 255, 0.12)',
        primary: {
          200: '#a5c8f2',
          300: '#77aceb',
          400: '#4a91e5',
          500: '#1d75de',
          600: '#175eb2'
        },
        secondary: {
          200: '#d5b9f1',
          300: '#c196eb',
          400: '#ac73e4',
          500: '#9750dd',
          600: '#7940b1'
        },
        success: {
          200: '#a5efbf',
          300: '#78e79f',
          400: '#4bdf7f',
          500: '#1ed75f',
          600: '#18ac4c'
        },
        warning: {
          200: '#fde49b',
          300: '#fdd769',
          400: '#fcc937',
          500: '#fbbc05',
          600: '#c99604'
        },
        danger: {
          200: '#f7b4ae',
          300: '#f28e86',
          400: '#ee695d',
          500: '#ea4335',
          600: '#bb362a'
        },
        gray: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#F2F2F2',
          300: '#eeeeee',
          400: '#e0e0e0',
          500: '#bdbdbd',
          600: '#9e9e9e',
          700: '#757575',
          800: '#616161',
          900: '#424242',
          1000: '#212121'
        }
      },
      keyframes: {
        enterKeyframe: {
          '0%': {
            transform: 'scale(0)',
            opacity: 0.1
          },
          '100%': {
            transform: 'scale(1)',
            opacity: 0.3
          }
        },
        exitKeyframe: {
          '0%': {
            opacity: 1
          },
          '100%': {
            opacity: 0
          }
        },
        pulsateKeyframe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.92)' }
        },
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 }
        }
      },
      animation: {
        'ripple-enter': 'enterKeyframe 550ms ease-in-out',
        'ripple-exit': 'exitKeyframe 550ms ease-in-out',
        pulsate: 'pulsateKeyframe 2500ms ease-in-out infinite 200ms',
        'accordion-down': 'accordion-down 0.3s ease-out',
        'accordion-up': 'accordion-up 0.3s ease-out'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
};
