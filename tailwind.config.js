module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        oa_background : 'f1efe7',
        // Agrega más colores personalizados si lo deseas
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
