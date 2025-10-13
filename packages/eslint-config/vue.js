const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/*
 * This is a custom ESLint configuration for use with
 * Vue 3 + TypeScript packages.
 */

module.exports = {
  extends: [
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "plugin:vue/vue3-recommended",
    "prettier",
  ],
  parser: "vue-eslint-parser",
  parserOptions: {
    ecmaVersion: "latest",
    parser: "@typescript-eslint/parser",
    sourceType: "module",
    project,
  },
  plugins: ["@typescript-eslint"],
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  globals: {
    defineProps: "readonly",
    defineEmits: "readonly",
    defineExpose: "readonly",
    withDefaults: "readonly",
  },
  rules: {
    // TypeScript specific rules
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/strict-boolean-expressions": "error",

    // Vue specific rules
    "vue/multi-word-component-names": "off",
    "vue/require-default-prop": "error",
    "vue/require-prop-types": "error",
    "vue/prop-name-casing": ["error", "camelCase"],
    "vue/component-name-in-template-casing": ["error", "PascalCase"],

    // General rules
    "no-console": "warn",
    "no-debugger": "error",
  },
  ignorePatterns: ["node_modules/", "dist/", "*.d.ts"],
};