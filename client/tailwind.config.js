/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#E30613',
          dark: '#08090B',
          ink: '#15171C',
          graphite: '#333741',
          soft: '#F5F6F8',
          line: '#E5E7EB',
        },
      },
      boxShadow: {
        premium: '0 24px 70px rgba(8, 9, 11, 0.12)',
        glow: '0 18px 45px rgba(227, 6, 19, 0.22)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-grid':
          'linear-gradient(rgba(227,6,19,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(227,6,19,.08) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
};

