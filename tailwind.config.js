import plugin from "tailwindcss/plugin";
import theme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: ["selector", '[data-dark="true"]'], // [/*"selector"*/, ],
  theme: {
    extend: {
      screens: {
        table: theme.screens.md
      },
      width: {
        "sidebar-closed": `calc(${theme.spacing[14]} + 1px)`,
        "sidebar-open": theme.spacing[72]
      }
    }
  },
  plugins: [
    require("./src/styles/plugins/base"),
    require("./src/styles/plugins/form"),
    plugin(({ addVariant, theme }) => {
      addVariant("table-sm", `@media not all and (min-width: ${theme("screens.table")})`);
      addVariant("table-lg", `@media (min-width: ${theme("screens.table")})`);
    }),
  ],
};
