/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        myDarkTheme: {
          primary: '#5b21b6',
          secondary: '#fbbf24',
          accent: '#4ade80',
          neutral: '#3d4451',
          'base-100': '#1F1F1F',
          info: '#3ABFF8',
          success: '#36D399',
          warning: '#FBBD23',
          error: '#F87272',
        },
      },
      'dark',
      'cyberpunk',
      'light',
      'luxury',
      'synthwave',
    ],
  },
  plugins: [daisyui],
};
