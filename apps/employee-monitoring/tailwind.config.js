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
    extend: {},
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
