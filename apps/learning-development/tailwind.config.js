const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    //'apps/learning-development/src/**/*.{js,jsx,ts,tsx}'
    join(__dirname, '/src/**/*.{tsx,jsx,js,ts}'),

    join(__dirname, '../../libs/oneui/src/**/*.{tsx,jsx,ts,js}'),
  ],
  theme: {
    extend: {
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-8deg)' },
          '50%': { transform: 'rotate(8deg)' },
        },
      },
      animation: {
        wiggle: 'wiggle 0.3s ease-in-out infinite',
      },
    },
    screens: {
      xs: '200px',

      sm: '640px',
      // => @media (min-width: 640px) { ... }

      md: '768px',
      // => @media (min-width: 768px) { ... }

      lg: '1024px',
      // => @media (min-width: 1024px) { ... }

      xl: '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@headlessui/tailwindcss')({ prefix: 'ui' }),
  ],
};
