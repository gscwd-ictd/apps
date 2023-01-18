/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // purge pages from apps
    'apps/employee-monitoring/src/pages/**/*.{js,jsx,ts,tsx}',

    // purge components from apps
    'apps/employee-monitoring/src/components/**/*.{js,jsx,ts,tsx}',

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
      },
      animation: {
        wiggle: 'wiggle 0.3s ease-in-out infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
