// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['MaruBuri', 'sans-serif'],
        maruburi: ['MaruBuri', 'sans-serif'],
        'maruburi-light': ['MaruBuriLight', 'sans-serif'],
        'maruburi-extra-light': ['MaruBuriExtraLight', 'sans-serif'],
        'maruburi-semi-bold': ['MaruBuriSemiBold', 'sans-serif'],
        'maruburi-bold': ['MaruBuriBold', 'sans-serif'],
        newyork: ['NewYork', 'serif'],
      },
    },
  },
  plugins: [],
};
