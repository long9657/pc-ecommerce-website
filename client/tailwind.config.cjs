/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  corePlugins: {
    container: false // Tắt container mặc định để dùng cái tự chế bên dưới
  },
  theme: {
    extend: {
      colors: {
        orange: '#ee4d2d'
      }
    }
  },
  plugins: [
    // Cách viết này an toàn hơn, không bị lỗi "not callable"
    ({ addComponents, theme }) => {
      addComponents({
        '.container': {
          maxWidth: theme('columns.7xl'), // Khoảng 1280px
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: theme('spacing.4'),
          paddingRight: theme('spacing.4')
        }
      })
    }
  ]
}
