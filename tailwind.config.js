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
					'0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)'
			},
			colors: {
				transparent: 'transparent',
				current: 'currentColor',
				white: '#FFFFFF',
				black: '#000000',
				text: '#B4B4B4',
				darkText: '#636363',
				primary: '#1d75de',
				secondary: '#9750DD',
				success: '#1ed75f',
				warning: '#fbbc05',
				danger: '#ea4335',
				gray: {
					50: '#F2F2F2',
					100: '#D3D3D3',
					200: '#B4B4B4',
					300: '#959595',
					400: '#767676',
					500: '#636363',
					600: '#555555',
					700: '#484848',
					800: '#3C3C3C',
					900: '#282828',
					1000: '#212121'
				},
				yellow: {
					50: '#fef4d7',
					100: '#fef2cd',
					200: '#fde49b',
					300: '#fdd769',
					400: '#fcc937',
					500: '#fbbc05',
					600: '#c99604',
					700: '#977103',
					800: '#644b02',
					900: '#322601',
					1000: '#281e01'
				},
				green: {
					50: '#dbf9e5',
					100: '#d2f7df',
					200: '#a5efbf',
					300: '#78e79f',
					400: '#4bdf7f',
					500: '#1ed75f',
					600: '#18ac4c',
					700: '#128139',
					800: '#0c5626',
					900: '#062b13',
					1000: '#05220f'
				},
				blue: {
					50: '#dbe9fa',
					100: '#d2e3f8',
					200: '#a5c8f2',
					300: '#77aceb',
					400: '#4a91e5',
					500: '#1d75de',
					600: '#175eb2',
					700: '#114685',
					800: '#0c2f59',
					900: '#06172c',
					1000: '#051324'
				},
				purple: {
					50: '#eee3fa',
					100: '#eadcf8',
					200: '#d5b9f1',
					300: '#c196eb',
					400: '#ac73e4',
					500: '#9750dd',
					600: '#7940b1',
					700: '#5b3085',
					800: '#3c2058',
					900: '#1e102c',
					1000: '#180d23'
				},
				red: {
					50: '#fce1df',
					100: '#fbd9d7',
					200: '#f7b4ae',
					300: '#f28e86',
					400: '#ee695d',
					500: '#ea4335',
					600: '#bb362a',
					700: '#8c2820',
					800: '#5e1b15',
					900: '#2f0d0b',
					1000: '#250b08'
				}
			},
			keyframes: {
				ripple: {
					'0%': {
						transform: 'scale(0)'
					},
					'100%': {
						transform: 'scale(4)',
						opacity: 0
					}
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
				ripple: 'ripple 650ms linear',
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require('tailwindcss-animate')]
};
