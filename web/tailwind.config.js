module.exports = {
  purge: {
    enabled: process.env.NODE_ENV == 'production',
    content: [
      './pages/**/*.vue',
      './layouts/**/*.vue',
      './components/**/*.vue',
      './components/**/*.tsx',
      './content/**/*.md',
      'node_modules/vue-range-component/dist/vue-range-slider.css', // whitelist all
    ],
  },
  darkMode: false,
  theme: {
    extend: {
      textShadow: {
        'default': '-1px 0 #22292f, 0 1px #22292f, 1px 0 #22292f, 0 -1px #22292f',
      },
      spacing: {
        120: '30rem',
        160: '40rem',
        180: '50rem',
      },
    },
  },
  variants: {},
  plugins: [
    // for 'prose'
    require('@tailwindcss/typography'),
    // prettier checkboxes etc.
    // https://tailwindcss-forms.netlify.app/
    require('@tailwindcss/forms'),
    // for text shadows etc.
    require('tailwindcss-typography')({ }),
    // for 'elevation-n'
    require('tailwindcss-elevation')([], {
      color: '#1a202c', // gray-900 = surface color
    }),
  ],
}
