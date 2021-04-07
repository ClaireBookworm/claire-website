const num = Array.from({length: 12}, (_, i) => i + 1)
const whitelist = []
num.map((n) => {
  whitelist.push('grid-cols-' + n)
})

module.exports = {
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    options: {
      whitelist,
    },
  },
  // darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        gilroy: 'Gilroy, sans-serif',
        inter: 'Inter, sans-serif',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
