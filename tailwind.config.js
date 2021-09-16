module.exports = {
  mode: 'jit',
  purge: [
    'js/**/*.js',
    'css/**/*.css',
    'public/**/*.html'
  ],
  darkMode: false,
  theme: {
    extend: {}
  },
  variants: {
    extend: {}
  },
  plugins: [
    require('@tailwindcss/typography')
  ]
}
