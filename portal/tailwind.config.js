/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    'apps/portal/src/pages/**/*.{js,jsx,ts,tsx}',
    'apps/portal/src/components/**/*.{js,jsx,ts,tsx}',
    'libs/oneui/src/components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
};
