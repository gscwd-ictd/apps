/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // purge pages from apps
    'apps/pds/src/pages/**/*.{js,jsx,ts,tsx}',

    // purge components from apps
    'apps/pds/src/components/**/*.{js,jsx,ts,tsx}',

    // purge classes from apps
    'apps/pds/src/classes/**/*.{js,ts,jsx,tsx}',

    // purge context from apps
    'apps/pds/src/context/**/*.{js,ts,jsx,tsx}',

    // purge shred-ui components from libs
    'libs/oneui/src/**/!(*.stories|*.spec).{ts,tsx,jsx,js,html}',
  ],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
  externals: {
    'react-hook-form': 'react-hook-form',
  },
};
