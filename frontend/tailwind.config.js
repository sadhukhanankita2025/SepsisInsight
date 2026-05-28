/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'navy-blue': '#071426',
        'dark-bg': '#0B1020',
        'neon-blue': '#4DA6FF',
        'soft-purple': '#8A7CFF',
        'neon-pink': '#FF4D9D',
        'white-text': '#F8FAFF',
        'sec-text': '#AAB4D4',
        'navy-bg': '#071426', // override with new Deep Navy Blue
        'soft-lavender': '#8A7CFF', // override with new Soft Purple
        'calm-blue': '#4DA6FF', // override with new Neon Blue
        'mint-green': '#34D399',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        manrope: ['Manrope', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
