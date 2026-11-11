/* eslint.config.js — lint da API (TypeScript nos Workers e scripts Node). Rode com: npm run lint */
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  /* public/ fica fora, menos o SDK de identificação, que roda nos quatro sites (#6). */
  { ignores: ["dist", ".wrangler", "node_modules", "public/*", "!public/sdk/"] },
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
  /* SDK: script clássico do navegador (sem módulo), em ES5 para rodar em qualquer site. */
  {
    files: ["public/sdk/**/*.js"],
    languageOptions: { ecmaVersion: 5, sourceType: "script", globals: { ...globals.browser } },
    rules: {
      /* catch (e) sem usar o erro é o padrão de ES5, que não aceita catch sem parâmetro. */
      "@typescript-eslint/no-unused-vars": ["error", { caughtErrors: "none" }],
      "@typescript-eslint/no-unused-expressions": ["error", { allowTernary: true }],
    },
  },
);
