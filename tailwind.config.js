const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ["./src/**/*.{html,ts}",],
  theme: {
    screens:{
      'xs':'475px',
      ...defaultTheme.screens
    }
  },
  plugins: [],
  corePlugins:{
    preflight:true
  }
}

