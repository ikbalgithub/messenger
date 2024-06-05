const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ["./src/**/*.{html,ts}",],
  theme: {
    screens:{
      'xs':'320px',
      ...defaultTheme.screens
    }
  },
  plugins: [],
  corePlugins:{
    preflight:true
  }
}

