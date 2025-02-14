/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: [
    'bg-red-500',
    'bg-green-500',
    'border-red-700',
    'border-green-700',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(31 41 55)',
        secondary: '#FFFFFF',
        highlight: 'rgb(59 130 246)',
        barcolor: '#202A44',
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        pulseBubble: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
      animation: {
        twinkle: 'twinkle 2s infinite',
        fadeInUp: 'fadeInUp 1.5s ease-out',
        scale: 'pulseBubble 5s infinite ease-in-out',
        slideInRight: 'slideInRight 1s ease-out',
        fadeIn: "fadeIn 2s ease-in-out",
      },
    },
  },
  plugins: [],
};
