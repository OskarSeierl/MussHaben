import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  // Global ignore patterns
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/lib/**",
      "**/generated/**",
    ],
  },

  // Recommended ESLint rules for JS
  js.configs.recommended,

  // Recommended ESLint rules for TS
  ...tseslint.configs.recommended,

  // Basic environment setup for all files
  {
    files: ["src/**/*.{js,ts}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        // Node.js globals
        __dirname: "readonly",
        __filename: "readonly",
        Buffer: "readonly",
        console: "readonly",
        global: "readonly",
        process: "readonly",
      },
    },
  },

  // Basic environment setup for test files
  {
    files: ["src/**/*.test.{js,ts}", "src/**/*.spec.{js,ts}"],
    languageOptions: {
      globals: {
        // Testing globals
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
      },
    },
  },
];