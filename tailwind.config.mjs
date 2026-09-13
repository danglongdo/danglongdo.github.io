/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#F7F7F4',
          dark: '#101316',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#171C21',
        },
        ink: {
          DEFAULT: '#17191C',
          dark: '#F2F4F5',
        },
        muted: {
          DEFAULT: '#5C6570',
          dark: '#AAB3BC',
        },
        border: {
          DEFAULT: '#D9DDE1',
          dark: '#303840',
        },
        accent: {
          DEFAULT: '#2457D6',
          hover: '#1D44B8',
          dark: '#4E8CFF',
          'dark-hover': '#3876E8',
        },
        'accent-hover': '#1D44B8',
      },
      fontFamily: {
        sans: [
          'Geist Sans',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        mono: [
          'Geist Mono',
          'JetBrains Mono',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
      },
    },
  },
  plugins: [],
};
