/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {

    extend: {
      colors:{
        'primaryDark':'#222831',
        'secondaryDark':'#31363F',
        'primaryColor':'#76ABAE',
        'secondaryBright':'#e4e4e4',
        'primaryBright':'#EEEEEE'
      },
      screens: {
        'xs': '530px',
      }
    },
  },
  plugins: [],
}

