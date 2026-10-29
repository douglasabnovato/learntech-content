/* repositorio-d1.ts — implementação do repositório de mensagens sobre Cloudflare D1 (SQLite). */
import type { RepositorioMensagens, NovaMensagem } from "./repositorio";
import type { Mensagem, FiltroMensagens } from "./schema";

interface LinhaMensagem {
  id: number;
  criado_em: string;
  projeto: string;
  motivo: string;
  nome: string;
  email: string;
  mensagem: string;
  pagina: string | null;
}

/* Cria o repositório ligado ao binding DB do Worker. */
export function repositorioMensagensD1(db: D1Database): RepositorioMensagens {
  return {
    /* Há mensagem com o mesmo texto do mesmo e-mail a partir de `desde`? */
    async existeIgualDesde(email, mensagem, desde) {
      const r = await db.prepare("SELECT 1 FROM mensagens WHERE email = ? AND criado_em >= ? AND mensagem = ? LIMIT 1")
        .bind(email, desde, mensagem).first();
      return r !== null;
    },

    /* Insere e devolve o id gerado. */
    async inserir(nova: NovaMensagem) {
      const r = await db.prepare("INSERT INTO mensagens (criado_em, projeto, motivo, nome, email, mensagem, pagina) VALUES (?, ?, ?, ?, ?, ?, ?)")
        .bind(nova.criadoEm, nova.projeto, nova.motivo, nova.nome, nova.email, nova.mensagem, nova.pagina).run();
      return Number(r.meta.last_row_id);
    },

    /* Lista da mais recente para a mais antiga, com filtros opcionais. */
    async listar(filtro: FiltroMensagens) {
      const condicoes: string[] = [];
      const valores: unknown[] = [];
      if (filtro.projeto) { condicoes.push("projeto = ?"); valores.push(filtro.projeto); }
      if (filtro.motivo) { condicoes.push("motivo = ?"); valores.push(filtro.motivo); }
      if (filtro.email) { condicoes.push("email = ?"); valores.push(filtro.email); }
      if (filtro.desde) { condicoes.push("criado_em >= ?"); valores.push(filtro.desde); }
      const where = condicoes.length ? `WHERE ${condicoes.join(" AND ")}` : "";
      const { results } = await db.prepare(`SELECT id, criado_em, projeto, motivo, nome, email, mensagem, pagina FROM mensagens ${where} ORDER BY criado_em DESC, id DESC LIMIT ?`)
        .bind(...valores, filtro.limite).all<LinhaMensagem>();
      return results.map((l): Mensagem => ({ id: l.id, criadoEm: l.criado_em, projeto: l.projeto, motivo: l.motivo, nome: l.nome, email: l.email, mensagem: l.mensagem, pagina: l.pagina }));
    },

    /* Remove todas as mensagens de um e-mail e devolve quantas saíram. */
    async apagarPorEmail(email) {
      const r = await db.prepare("DELETE FROM mensagens WHERE email = ?").bind(email).run();
      return r.meta.changes ?? 0;
    },

    /* Remove mensagens anteriores à data (retenção). */
    async apagarAntesDe(data) {
      const r = await db.prepare("DELETE FROM mensagens WHERE criado_em < ?").bind(data).run();
      return r.meta.changes ?? 0;
    },
  };
}

/* Fim de repositorio-d1.ts */
