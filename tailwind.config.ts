import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        line: {
          green: '#06C755',
          'green-dark': '#05A847',
        },
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
} satisfies Config
