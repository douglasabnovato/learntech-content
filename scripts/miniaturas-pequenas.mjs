/* miniaturas-pequenas.mjs — gera media/tools/320/<nome>.webp (320 px de largura) a partir das miniaturas de 640 px
   e preenche thumbPequena nos itens do tools. O card do tools mostra a miniatura com até 260 px (tools#55).
   Uso: node scripts/miniaturas-pequenas.mjs */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ORIGEM = path.join(RAIZ, "media", "tools");
const DESTINO = path.join(ORIGEM, "320");
const LISTAS = ["ferramentas.json", "hospedagens.json"].map((f) => path.join(RAIZ, "content", "tools", f));

fs.mkdirSync(DESTINO, { recursive: true });
let total = 0;
for (const arquivo of LISTAS) {
  const itens = JSON.parse(fs.readFileSync(arquivo, "utf8"));
  for (const [i, item] of itens.entries()) {
    const m = /^\/media\/tools\/([\w-]+\.webp)$/.exec(item.thumb ?? "");
    if (!m) continue;
    const saida = path.join(DESTINO, m[1]);
    await sharp(path.join(ORIGEM, m[1])).resize({ width: 320, withoutEnlargement: true }).webp({ quality: 78 }).toFile(saida);
    /* thumbPequena logo depois de thumb, para o diff do JSON ficar numa linha por item. */
    const { thumbPequena: _antiga, ...resto } = item;
    itens[i] = Object.fromEntries(
      Object.entries(resto).flatMap(([k, v]) =>
        k === "thumb"
          ? [
              [k, v],
              ["thumbPequena", `/media/tools/320/${m[1]}`],
            ]
          : [[k, v]],
      ),
    );
    total += 1;
  }
  fs.writeFileSync(arquivo, JSON.stringify(itens, null, 2) + "\n");
}
console.log(`${total} miniaturas de 320 px em media/tools/320/`);

/* Fim de miniaturas-pequenas.mjs */
