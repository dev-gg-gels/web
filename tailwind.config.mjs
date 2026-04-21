/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        cream: '#F4EEE2',
        parchment: '#FAF6EC',
        ink: '#1F1E1A',
        muted: '#88826F',
        tee: '#C8B84A',
        front: '#5A7DA0',
        clutch: '#A07050',
        putt: '#6A8E6E',
      },
      fontFamily: {
        sans: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        display: ['Georgia', 'Cambria', 'serif'],
      },
    },
  },
  plugins: [],
};
