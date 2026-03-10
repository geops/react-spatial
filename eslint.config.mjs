import flat from "@geops/eslint-config-react/flat";

// tailwind@4 only supported in beta channel
// import tailwind from "eslint-plugin-tailwindcss";

export default [
  ...flat,
  // tailwind@4 only supported in beta channel
  // ...tailwind.configs["flat/recommended"],
  // {
  //   settings: {
  //     react: {
  //       version: "18.3.1",
  //     },
  //   },
  // },
  {
    rules: {
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/unbound-method": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "mocha/no-setup-in-describe": "off",
      "mocha/consistent-spacing-between-blocks": "off",
      "@typescript-eslint/no-redundant-type-constituents": "off",
      "mocha/no-pending-tests": "off",
      "@typescript-eslint/prefer-nullish-coalescing": "off",
      "react-compiler/react-compiler": "off",
      "@typescript-eslint/prefer-for-of": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/no-misused-promises": "warn",
      "@typescript-eslint/prefer-optional-chain": "warn",
    },
  },
];
