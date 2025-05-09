import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './stories/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Semantic tokens
        surface: 'var(--color-surface)',
        text: 'var(--color-text)',
        primary: 'var(--color-primary)',
      },
    },
  },
  plugins: [],
};

export default config;
