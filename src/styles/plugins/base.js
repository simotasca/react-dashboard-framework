import plugin from "tailwindcss/plugin";

export default plugin(
  ({ addComponents }) => {
    addComponents({
      ".stack": {
        display: "grid",
        gridTemplateAreas: "stack",
        placeItems: "center",
        "& > *": {
          gridArea: "stack",
        },
      },
    });
  },
  {
    theme: {
      extend: {
        screens: { xs: "480px" },
        colors: { 
          zinc: { 
            850: "#1d1d20",
            910: "#161618",
            920: "#131316",
            930: "#101013",
            950: "#0d0d0f",
          }
        }
      },
    },
  }
);
