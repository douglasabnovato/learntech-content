/* eslint.config.js — lint da API (TypeScript nos Workers e scripts Node). Rode com: npm run lint */
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", ".wrangler", "node_modules", "public"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: { ecmaVersion: 2022, sourceType: "module", globals: { ...globals.node, ...globals.serviceworker } },
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      /* Variável com _ na frente, ou descartada ao separar o resto de um objeto, é intencional. */
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_", ignoreRestSiblings: true }],
    },
  },
);
