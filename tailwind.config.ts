import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'bubble-pink': '#FFD6E0',
        'bubble-sky': '#D6ECFF',
        'bubble-yellow': '#FFF6BF',
        'bubble-purple': '#E5D6FF',
        'bubble-green': '#D6FFE0',
      },
      fontFamily: {
        pretendard: ['Pretendard Variable', 'Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
