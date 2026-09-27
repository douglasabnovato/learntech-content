/* vitest.config.ts — testes rodam em Node, sem Workers: a lógica do Worker recebe o repositório por injeção. */
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    environment: "node",
  },
});
/* Fim de vitest.config.ts */
