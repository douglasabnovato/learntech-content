/* documentacao.test.ts — a documentação não mente sobre o repositório (critério 12 do MVP, #28).
   Confere que todo link relativo dos arquivos .md aponta para um arquivo que existe e que todo
   `npm run <comando>` citado nos documentos de entrada existe no package.json. */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const RAIZ = path.resolve(import.meta.dirname, "..");
const IGNORAR = new Set(["node_modules", "dist", ".git", ".wrangler", "e2e/relatorios"]);

/* Lista os .md do repositório, fora das pastas geradas. */
function arquivosMd(dir = RAIZ): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((n) => {
    const p = path.join(dir, n.name);
    if (IGNORAR.has(path.relative(RAIZ, p).split(path.sep).join("/"))) return [];
    if (n.isDirectory()) return arquivosMd(p);
    return n.name.endsWith(".md") ? [p] : [];
  });
}

/* Tira blocos e trechos de código: caminho dentro de crase é exemplo, não link. */
const semCodigo = (texto: string) => texto.replace(/```[\s\S]*?```/g, "").replace(/`[^`\n]*`/g, "");

describe("documentação", () => {
  it("todo link relativo dos .md aponta para um arquivo existente", () => {
    const quebrados: string[] = [];
    for (const arquivo of arquivosMd()) {
      for (const m of semCodigo(fs.readFileSync(arquivo, "utf8")).matchAll(/\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
        const alvo = m[1]!;
        if (/^(https?:|mailto:|#)/.test(alvo)) continue;
        const caminho = decodeURI(alvo.split("#")[0]!);
        if (!caminho) continue;
        const absoluto = caminho.startsWith("/") ? path.join(RAIZ, caminho) : path.resolve(path.dirname(arquivo), caminho);
        if (!fs.existsSync(absoluto)) quebrados.push(`${path.relative(RAIZ, arquivo)} -> ${alvo}`);
      }
    }
    expect(quebrados).toEqual([]);
  });

  it("todo `npm run` citado no README, no COMO-EVOLUIR e no CLAUDE.md existe no package.json", () => {
    const scripts = Object.keys(JSON.parse(fs.readFileSync(path.join(RAIZ, "package.json"), "utf8")).scripts);
    const citados = new Set<string>();
    for (const doc of ["README.md", "CLAUDE.md", "docs/COMO-EVOLUIR.md"]) {
      const texto = fs.readFileSync(path.join(RAIZ, doc), "utf8");
      for (const m of texto.matchAll(/npm run ([a-z0-9:-]+)/gi)) citados.add(m[1]!);
      /* "`npm run copias` / `copias:conferir`": a forma curta na mesma célula também conta. */
      for (const m of texto.matchAll(/npm run [a-z0-9:-]+` \/ `([a-z0-9:-]+)`/gi)) citados.add(m[1]!);
    }
    expect(citados.size).toBeGreaterThan(10);
    expect([...citados].filter((c) => !scripts.includes(c))).toEqual([]);
  });
});

/* Fim de documentacao.test.ts */
