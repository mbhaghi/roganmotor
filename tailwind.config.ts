import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Vazirmatn', 'Tahoma', 'system-ui', 'sans-serif'],
      },
      colors: {
        // هویت بصری: نفتی/طلایی — حس فنی و صنعتی، مناسب روانکار
        brand: {
          50: '#f2f7fb',
          100: '#e2edf6',
          200: '#c3daec',
          300: '#93bddc',
          400: '#5b98c6',
          500: '#367aad',
          600: '#266191',
          700: '#214e74',
          800: '#1f4261',
          900: '#0d2438',
          950: '#071826',
        },
        gold: {
          50: '#fdf9ed',
          100: '#f9f0d2',
          200: '#f2dea1',
          300: '#eac766',
          400: '#e3b03d',
          500: '#d99a24',
          600: '#c07a1c',
          700: '#a05b1a',
          800: '#83481c',
          900: '#6c3b1a',
        },
        ink: {
          DEFAULT: '#12212e',
          soft: '#4a5b6b',
          mute: '#7b8a99',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(13,36,56,.06), 0 8px 24px -12px rgba(13,36,56,.18)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
