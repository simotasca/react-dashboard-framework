import plugin from "tailwindcss/plugin";

export default plugin(({ addVariant }) => {
  addVariant("state-invalid", "&[data-invalid]:not([data-disabled])");
  addVariant("state-disabled", "&[data-disabled]");
});
