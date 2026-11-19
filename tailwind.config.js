/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: "#003057", 800: "#00264a", 900: "#001a33", 700: "#0a3d6b" },
        spectrum: "#0099D8",
        wa: { green: "#075E54", teal: "#128C7E", light: "#25D366", bubble: "#DCF8C6", bg: "#ECE5DD" },
      },
      fontFamily: { sans: ["Inter", "Segoe UI", "system-ui", "sans-serif"], mono: ["JetBrains Mono", "Consolas", "monospace"] },
    },
  },
  plugins: [],
};
