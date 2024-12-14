/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.{html,js}"],
  theme: {
    extend: {
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      },
      backdropBlur: {
        'lg': '16px',
      }
    },
  },
  plugins: [],
  safelist: [
    'bg-white/10',
    'backdrop-blur-lg',
    'mix-blend-multiply',
    'filter',
    'blur-xl',
    'from-indigo-900',
    'via-purple-800',
    'to-pink-800',
    'from-blue-400',
    'to-blue-600',
    'from-purple-400',
    'to-purple-600'
  ]
}


