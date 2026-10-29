/* repositorio-memoria.ts — repositório de mensagens em memória com a mesma semântica do D1, usado nos testes. */
import type { RepositorioMensagens, NovaMensagem } from "./repositorio";
import type { Mensagem } from "./schema";

/* Cria um repositório vazio (ou com linhas iniciais). */
export function repositorioMensagensMemoria(iniciais: Mensagem[] = []): RepositorioMensagens & { linhas: Mensagem[] } {
  const linhas: Mensagem[] = [...iniciais];
  let proximo = linhas.reduce((m, l) => Math.max(m, l.id), 0) + 1;
  return {
    linhas,
    /* Há mensagem com o mesmo texto do mesmo e-mail a partir de `desde`? */
    async existeIgualDesde(email, mensagem, desde) {
      return linhas.some((l) => l.email === email && l.mensagem === mensagem && l.criadoEm >= desde);
    },
    /* Insere e devolve o id gerado. */
    async inserir(nova: NovaMensagem) {
      const id = proximo++;
      linhas.push({ id, ...nova });
      return id;
    },
    /* Lista da mais recente para a mais antiga, com filtros opcionais. */
    async listar(filtro) {
      return linhas
        .filter((l) => (!filtro.projeto || l.projeto === filtro.projeto)
          && (!filtro.motivo || l.motivo === filtro.motivo)
          && (!filtro.email || l.email === filtro.email)
          && (!filtro.desde || l.criadoEm >= filtro.desde))
        .sort((a, b) => (a.criadoEm === b.criadoEm ? b.id - a.id : a.criadoEm < b.criadoEm ? 1 : -1))
        .slice(0, filtro.limite);
    },
    /* Remove todas as mensagens de um e-mail e devolve quantas saíram. */
    async apagarPorEmail(email) {
      const antes = linhas.length;
      for (let i = linhas.length - 1; i >= 0; i--) if (linhas[i]!.email === email) linhas.splice(i, 1);
      return antes - linhas.length;
    },
    /* Remove mensagens anteriores à data (retenção). */
    async apagarAntesDe(data) {
      const antes = linhas.length;
      for (let i = linhas.length - 1; i >= 0; i--) if (linhas[i]!.criadoEm < data) linhas.splice(i, 1);
      return antes - linhas.length;
    },
  };
}

/* Fim de repositorio-memoria.ts */
