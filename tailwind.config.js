module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        oa_background : 'f2f0e8',
        oa_border: 'd5bdaf',
        oa_white: 'f8f8f7',
        // Agrega más colores personalizados si lo deseas
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
