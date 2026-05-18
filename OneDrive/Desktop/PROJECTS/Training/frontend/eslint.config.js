import js from "@eslint/js";

import globals from "globals";

import reactHooks from "eslint-plugin-react-hooks";

import reactRefresh from "eslint-plugin-react-refresh";

import {
  defineConfig,
  globalIgnores,
} from "eslint/config";

export default defineConfig([

  globalIgnores([
    "dist",
  ]),

  {
    files: ["**/*.{js,jsx}"],

    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],

    languageOptions: {

      globals: globals.browser,

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    rules: {

      // ✅ KEEP IMPORTANT RULES
      "react-hooks/exhaustive-deps": "warn",

      // ✅ DISABLE OVERLY AGGRESSIVE RULES
      "react-hooks/set-state-in-effect": "off",

      "react-hooks/immutability": "off",

      // ✅ ALLOW CONTEXT EXPORTS
      "react-refresh/only-export-components": "off",

      // ✅ CLEANER PRODUCTION CODE
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
        },
      ],

      "no-console": [
        "warn",
        {
          allow: [
            "warn",
            "error",
          ],
        },
      ],
    },
  },
]);