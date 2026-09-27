/* cors.ts — lista de origens permitidas para as rotas de escrita (aceita curinga de porta: http://localhost:*). */

/* Transforma a variável ALLOWED_ORIGINS (separada por vírgula) em lista limpa. */
export function lerOrigens(valor: string | undefined): string[] {
  return (valor ?? "").split(",").map((o) => o.trim().replace(/\/$/, "")).filter(Boolean);
}

/* Diz se a origem do navegador está na lista; `*` no fim casa com qualquer porta. */
export function origemPermitida(origem: string | null | undefined, permitidas: string[]): boolean {
  if (!origem) return false;
  return permitidas.some((p) => (p.endsWith(":*") ? origem.startsWith(p.slice(0, -1)) && /^\d+$/.test(origem.slice(p.length - 1)) : origem === p));
}

/* Fim de cors.ts */
