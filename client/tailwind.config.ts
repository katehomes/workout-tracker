import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}', // this must reflect where your components live
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
