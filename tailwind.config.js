/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0A0A0A',
        card: '#18181B',
        text: {
          primary: '#FFFFFF',
          secondary: '#9CA3AF',
        },
        purple: {
          main: '#7C3AED',
          hover: '#8B5CF6',
          active: '#6D28D9',
        },
        zinc: {
          800: '#27272A',
          900: '#18181B',
        },
        green: {
          main: '#10B981',
        },
        progress: {
          bg: '#27272A',
          fill: '#7C3AED',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

