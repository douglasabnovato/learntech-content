/* d1-sqlite.ts — D1 falso sobre o SQLite do Node (node:sqlite), com as migrações reais aplicadas.
 *
 * Serve para testar o SQL dos adaptadores D1 sem Workers. Cobre só o que os adaptadores usam:
 * prepare/bind/first/all/run e batch. Limites conhecidos em relação ao D1 de verdade:
 *   - meta traz apenas last_row_id e changes (o D1 traz também duration, rows_read etc.);
 *   - batch roda as instruções em sequência, sem a transação implícita do D1;
 *   - o SQLite do Node pode ser de versão diferente do usado pela Cloudflare.
 */
import fs from "node:fs";
import path from "node:path";
import { DatabaseSync, type SQLInputValue } from "node:sqlite";

const MIGRACOES = path.resolve(import.meta.dirname, "..", "..", "migrations");

/* Instrução preparada com a mesma forma (parcial) da D1PreparedStatement. */
class Instrucao {
  constructor(private readonly db: DatabaseSync, private readonly sql: string, private readonly valores: SQLInputValue[] = []) {}

  bind(...valores: unknown[]) {
    return new Instrucao(this.db, this.sql, valores.map((v) => (v === undefined ? null : v)) as SQLInputValue[]);
  }

  async first<T = Record<string, unknown>>(): Promise<T | null> {
    return (this.db.prepare(this.sql).get(...this.valores) as T | undefined) ?? null;
  }

  async all<T = Record<string, unknown>>() {
    return { results: this.db.prepare(this.sql).all(...this.valores) as T[], success: true, meta: {} };
  }

  async run() {
    const r = this.db.prepare(this.sql).run(...this.valores);
    return { results: [], success: true, meta: { last_row_id: Number(r.lastInsertRowid), changes: Number(r.changes) } };
  }

  /* Usado pelo batch: SELECT devolve linhas; o resto devolve meta. */
  async executar() {
    return /^\s*select/i.test(this.sql) ? this.all() : this.run();
  }
}

/* Cria um banco em memória com todas as migrações de migrations/ aplicadas em ordem. */
export function d1EmMemoria(): { d1: D1Database; sqlite: DatabaseSync } {
  const sqlite = new DatabaseSync(":memory:");
  for (const arq of fs.readdirSync(MIGRACOES).filter((a) => a.endsWith(".sql")).sort()) {
    sqlite.exec(fs.readFileSync(path.join(MIGRACOES, arq), "utf8"));
  }
  const d1 = {
    prepare: (sql: string) => new Instrucao(sqlite, sql),
    batch: async (instrucoes: Instrucao[]) => Promise.all(instrucoes.map((i) => i.executar())),
    exec: async (sql: string) => { sqlite.exec(sql); return { count: 0, duration: 0 }; },
  };
  return { d1: d1 as unknown as D1Database, sqlite };
}

/* Fim de d1-sqlite.ts */
