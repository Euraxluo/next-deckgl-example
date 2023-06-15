/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1440px",
      },
    },
    extend: {

      minHeight: {
        "9/10": "90vh",
      },
      height: {
        "9/10": "90vh",
      },
      // 用于在map-container组件中控制宽度
      minWidth: {
        '0': '0',
        '3/4': '75%',
        '1/2': '50%',
        '1/3': '33%',
        '1/4': '25%',
        '1/5': '20%',
        '1/6': '17%',
        '2/7': '28%',
        '1/7': '14%',
        '1/8': '12%',
        '1/9': '11%',
        '1/10': '10%',
        'full': '100%',
      },
    },
  },
  plugins: [],
}
