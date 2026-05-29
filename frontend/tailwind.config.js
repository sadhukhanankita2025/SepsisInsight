/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'soft-lavender': '#EAECFD',
        'light-lilac': '#DBD4F9',
        'mist-purple': '#E6DFFF',
        'soft-pink-tint': '#FFDDF3',
        'deep-charcoal': '#353435',
        'rich-black': '#080808',
        'dark-gray-text': '#5E5E5E',
        'neon-pink': '#FF8BCB',
        'electric-lavender': '#A38AB2',
        'soft-purple': '#C4B6CE',
        'cool-blue-glow': '#A7C7FF',
        'peach-glow': '#FFD2B0',
        'primary-heading': '#111111',
        'secondary-text': '#5E5E5E',
        'white-text': '#FFFFFF',
        
        // Backward compatibility mappings
        'dark-bg': '#EAECFD', 
        'navy-blue': '#A7C7FF', 
        'neon-blue': '#A38AB2', 
        'sec-text': '#5E5E5E',

        // Dark Mode Palette
        'dm-bg-primary': '#020817',
        'dm-bg-secondary': '#06122B',
        'dm-bg-navy': '#081530',
        'dm-bg-section': '#0B1736',
        'dm-card': '#0D1B3D',
        'dm-glass': 'rgba(14, 24, 52, 0.72)',
        'dm-nav': 'rgba(10, 18, 40, 0.82)',
        'dm-border': '#1B2D5A',
        'dm-glow-border': '#2D4D8F',
        'dm-electric-blue': '#3B82F6',
        'dm-neural-purple': '#8B5CF6',
        'dm-neon-pink': '#EC4899',
        'dm-cyan-glow': '#22D3EE',
        'dm-text-primary': '#FFFFFF',
        'dm-text-secondary': '#94A3B8',
        'dm-text-muted': '#64748B',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        satoshi: ['Satoshi', 'sans-serif'],
        sfpro: ['SF Pro Display', 'sans-serif'],
        jakarta: ['Plus Jakarta Sans', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
