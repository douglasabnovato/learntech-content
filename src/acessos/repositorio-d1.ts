/* repositorio-d1.ts — implementação do repositório de acessos sobre Cloudflare D1 (SQLite). */
import type { RepositorioAcessos, NovoAcesso } from "./repositorio";
import type { Acesso, FiltroAcessos, ResumoAcessos } from "./schema";

interface LinhaAcesso {
  id: number;
  nome: string;
  email: string;
  projeto: string;
  pagina: string | null;
  criado_em: string;
}

/* Cria o repositório ligado ao binding DB do Worker. */
export function repositorioD1(db: D1Database): RepositorioAcessos {
  return {
    /* Há registro do mesmo e-mail no mesmo projeto a partir de `desde`? */
    async existeDesde(email, projeto, desde) {
      const r = await db.prepare("SELECT 1 FROM acessos WHERE email = ? AND projeto = ? AND criado_em >= ? LIMIT 1")
        .bind(email, projeto, desde).first();
      return r !== null;
    },

    /* Insere e devolve o id gerado. */
    async inserir(novo: NovoAcesso) {
      const r = await db.prepare("INSERT INTO acessos (nome, email, projeto, pagina, criado_em) VALUES (?, ?, ?, ?, ?)")
        .bind(novo.nome, novo.email, novo.projeto, novo.pagina, novo.criadoEm).run();
      return Number(r.meta.last_row_id);
    },

    /* Lista do mais recente para o mais antigo, com filtros opcionais. */
    async listar(filtro: FiltroAcessos) {
      const condicoes: string[] = [];
      const valores: unknown[] = [];
      if (filtro.projeto) { condicoes.push("projeto = ?"); valores.push(filtro.projeto); }
      if (filtro.desde) { condicoes.push("criado_em >= ?"); valores.push(filtro.desde); }
      const where = condicoes.length ? `WHERE ${condicoes.join(" AND ")}` : "";
      const { results } = await db.prepare(`SELECT id, nome, email, projeto, pagina, criado_em FROM acessos ${where} ORDER BY criado_em DESC, id DESC LIMIT ?`)
        .bind(...valores, filtro.limite).all<LinhaAcesso>();
      return results.map((l): Acesso => ({ id: l.id, nome: l.nome, email: l.email, projeto: l.projeto, pagina: l.pagina, criadoEm: l.criado_em }));
    },

    /* Totais gerais, por projeto e por dia a partir de `desdeDia`. */
    async resumir(desdeDia: string): Promise<ResumoAcessos> {
      const [geral, projetos, dias] = await db.batch([
        db.prepare("SELECT COUNT(*) AS total, COUNT(DISTINCT email) AS pessoas FROM acessos"),
        db.prepare("SELECT projeto, COUNT(*) AS acessos, COUNT(DISTINCT email) AS pessoas FROM acessos GROUP BY projeto ORDER BY acessos DESC"),
        db.prepare("SELECT substr(criado_em, 1, 10) AS dia, COUNT(*) AS acessos FROM acessos WHERE criado_em >= ? GROUP BY dia ORDER BY dia").bind(desdeDia),
      ]);
      const g = (geral?.results[0] ?? { total: 0, pessoas: 0 }) as { total: number; pessoas: number };
      return {
        total: g.total,
        pessoas: g.pessoas,
        porProjeto: (projetos?.results ?? []) as ResumoAcessos["porProjeto"],
        porDia: (dias?.results ?? []) as ResumoAcessos["porDia"],
      };
    },

    /* Remove todos os registros de um e-mail e devolve quantos saíram. */
    async apagarPorEmail(email) {
      const r = await db.prepare("DELETE FROM acessos WHERE email = ?").bind(email).run();
      return r.meta.changes ?? 0;
    },

    /* Remove registros anteriores à data (retenção). */
    async apagarAntesDe(data) {
      const r = await db.prepare("DELETE FROM acessos WHERE criado_em < ?").bind(data).run();
      return r.meta.changes ?? 0;
    },
  };
}

/* Fim de repositorio-d1.ts */
