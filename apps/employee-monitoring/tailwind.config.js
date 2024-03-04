/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // purge pages from apps
    'apps/employee-monitoring/src/pages/**/*.{js,jsx,ts,tsx}',

    // purge components from apps
    'apps/employee-monitoring/src/components/**/*.{js,jsx,ts,tsx}',

    // purge utils from apps
    'apps/employee-monitoring/src/utils/**/*.{js,jsx,ts,tsx}',

    // purge shred-ui components from libs
    'libs/oneui/src/**/!(*.stories|*.spec).{ts,tsx,jsx,js,html}',
  ],
  theme: {
    extend: {
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-8deg)' },
          '50%': { transform: 'rotate(8deg)' },
        },
        slideUpAndFade: {
          from: { opacity: '0', transform: 'translateY(2px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideDownAndFade: {
          from: { opacity: '0', transform: 'translateY(-2px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        wiggle: 'wiggle 0.3s ease-in-out infinite',
        slideUpAndFade: 'slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideDownAndFade: 'slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
      colors: {
        'skote-blue': '#2a3042',
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
    require('tailwind-scrollbar')({ nocompatible: true }),
  ],
};
