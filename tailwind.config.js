/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        cyber: ['Orbitron', 'sans-serif'],
      },
      colors: {
        dark: {
          50: '#C1C2C5',
          100: '#A6A7AB',
          200: '#909296',
          300: '#5C5F66',
          400: '#373A40',
          500: '#2C2E33',
          600: '#25262B',
          700: '#1A1B1E',
          800: '#141517',
          900: '#101113',
        },
        neon: {
          blue: '#00F0FF',
          purple: '#FF00F5',
          pink: '#FF008C',
          green: '#00FF94',
          yellow: '#FFE600',
        },
        brand: {
          50: '#E4F8FF',
          100: '#BDEFFF',
          200: '#8DE4FF',
          300: '#4CD4FF',
          400: '#00BFFF',
          500: '#00A3FF',
          600: '#0087FF',
          700: '#0066FF',
          800: '#0044FF',
          900: '#0022FF',
        },
      },
      animation: {
        'text-shimmer': 'text-shimmer 2.5s ease-out infinite alternate',
        'glow-pulse': 'glow-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'slide-down': 'slide-down 0.5s ease-out',
        'scale-up': 'scale-up 0.2s ease-out',
        'rotate-slow': 'rotate-slow 8s linear infinite',
        'background-shine': 'background-shine 2s linear infinite',
        'text-gradient': 'text-gradient 8s linear infinite',
      },
      keyframes: {
        'text-shimmer': {
          '0%': {
            'background-position': '0% 50%',
          },
          '100%': {
            'background-position': '100% 50%',
          },
        },
        'glow-pulse': {
          '0%, 100%': {
            'text-shadow': '0 0 20px rgba(0, 240, 255, 0.5)',
          },
          '50%': {
            'text-shadow': '0 0 40px rgba(0, 240, 255, 0.8), 0 0 80px rgba(0, 240, 255, 0.3)',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'scale-up': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'rotate-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'background-shine': {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        'text-gradient': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-shine': 'linear-gradient(110deg, transparent 25%, rgba(255, 255, 255, 0.1) 50%, transparent 75%)',
        'cyber-grid': 'linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(0deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        'neon-glow': 'linear-gradient(to right, rgba(0, 240, 255, 0.5), rgba(255, 0, 245, 0.5))',
      },
      boxShadow: {
        'neon-blue': '0 0 20px rgba(0, 240, 255, 0.5)',
        'neon-purple': '0 0 20px rgba(255, 0, 245, 0.5)',
        'neon-glow': '0 0 20px rgba(0, 240, 255, 0.5), 0 0 40px rgba(255, 0, 245, 0.3)',
        'inner-glow': 'inset 0 0 20px rgba(0, 240, 255, 0.3)',
      },
    },
  },
  plugins: [],
};
