/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
      Orbitron: ['Orbitron', 'sans-serif'],
      Sirr:['Sriracha','sans-serif'] ,
      Lex:['Lexend','sans-serif'],
      Mont:['Montserrat','sans-serif'],
      OpenSans:['Open Sans','sans-serif'],
      Zen:['Zen Dots','sans-serif'],
      Cabin:['Cabin','sans-serif'],
      Cairo:['Cairo Play','sans-serif']
    },
    backgroundImage: {
      'exam-bg': "url('https://getwallpapers.com/wallpaper/full/a/9/1/1400199-geometric-wallpapers-3840x2160-pc.jpg')"
    },
  },
},
  plugins: [],
}