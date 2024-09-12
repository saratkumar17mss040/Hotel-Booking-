/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    container: {
      // this is responsive padding overriden css for container tailwind class
      padding: {
        DEFAULT: "3rem",
        md: "10rem",
      },
    },
  },
  plugins: [],
};
