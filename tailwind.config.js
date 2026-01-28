/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#0CC0BC',
          secondary: '#076A70',
          light: '#E6FFFE',
          dark: '#054C52',
        },
        success: {
          DEFAULT: '#00B894',
          light: '#E3F9F4',
        },
        warning: {
          DEFAULT: '#FDCB6E',
          light: '#FEF7E6',
        },
        error: {
          DEFAULT: '#E74C3C',
          light: '#FBEAEA',
        },
        info: {
          DEFAULT: '#3498DB',
          light: '#EBF5FE',
        },
        bg: {
          primary: '#F8FAFC',
          secondary: '#FFFFFF',
          tertiary: '#F1F5F9',
        },
        text: {
          primary: '#2D3748',
          secondary: '#4A5568',
          muted: '#718096',
          inverse: '#FFFFFF',
        },
        border: '#E2E8F0',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(180deg)' },
        },
        successPulse: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        successPulse: 'successPulse 0.6s ease-out',
      },
    },
  },
  plugins: [],
}
