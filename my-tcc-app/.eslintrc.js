module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "prettier",
    "plugin:prettier/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
  plugins: ["@typescript-eslint", "react-hooks"],
  root: true,
  overrides: [
    {
      files: ["*.js", "*.jsx", "*.ts", "*.tsx"],
      extends: ["plugin:@typescript-eslint/disable-type-checked"],
    },
  ],
  rules: {
    "prettier/prettier": ["error", { endOfLine: "auto" }],
    // "linebreak-style": ["error", "unix"],
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "import/prefer-default-export": "off",
    "@typescript-eslint/no-var-requires": "off",
    "no-implicit-coercion": "off",
    "no-extra-boolean-cast": "off",
    // "sort-imports": ["error", { allowSeparatedGroups: true }],
  },
  env: {
    node: true,
  },
};
