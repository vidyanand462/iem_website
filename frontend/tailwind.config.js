/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        iem: {
          blue: '#1F4E9C',
          'blue-dark': '#163b78',
          'blue-light': '#2c6ad4',
          navy: '#0B1F3F',
          'navy-dark': '#061327',
          'navy-light': '#14305c',
          sky: '#38BDF8',
          gold: '#F59E0B',
          surface: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(11, 31, 63, 0.06), 0 2px 6px -1px rgba(11, 31, 63, 0.04)',
        'card-hover': '0 12px 32px -4px rgba(31, 78, 156, 0.12), 0 4px 12px -2px rgba(11, 31, 63, 0.06)',
        'hero': '0 20px 40px -15px rgba(11, 31, 63, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'ken-burns': 'kenBurns 20s ease-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        kenBurns: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.08)' },
        },
      },
    },
  },
  plugins: [],
}
