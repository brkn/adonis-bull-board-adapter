module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
  },
  plugins: ["@typescript-eslint"],
  extends: ["airbnb-base", "airbnb-typescript/base"],
  rules: {
    // "stylistic rules
    "import/prefer-default-export": "off",
    "@typescript-eslint/quotes": ["error", "double"],
    "@typescript-eslint/lines-between-class-members": "off"

    // "no-multiple-empty-lines": ["error", { max: 2 }],
    // "prefer-template": "error",
    // quotes: ["error", "always"],
    // "@typescript-eslint/semi": [2, "always"],
    // "space-before-function-paren": "off",
    // "@typescript-eslint/space-before-function-paren": ["error", "always"],
    // "no-irregular-whitespace": ["error"],
    // indent: "off",
    // "@typescript-eslint/indent": [
    //   "error",
    //   2,
    //   {
    //     SwitchCase: 1,
    //     flatTernaryExpressions: false,
    //     ignoredNodes: ["TSTypeParameterInstantiation"],
    //   },
    // ],
    // "no-multiple-empty-lines": ["error", { max: 1 }],

    // syntax rules
    // "@typescript-eslint/explicit-member-accessibility": [
    //   "error",
    //   { overrides: { constructors: "no-public" } },
    // ],
  },
  "ignorePatterns": ["src/FastifyAdapter.ts"],
};
