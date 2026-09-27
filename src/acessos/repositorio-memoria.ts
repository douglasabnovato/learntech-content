/* repositorio-memoria.ts — repositório em memória com a mesma semântica do D1, usado nos testes e no desenvolvimento sem banco. */
import type { RepositorioAcessos, NovoAcesso } from "./repositorio";
import type { Acesso, ResumoAcessos } from "./schema";

/* Cria um repositório vazio (ou com linhas iniciais). */
export function repositorioMemoria(iniciais: Acesso[] = []): RepositorioAcessos & { linhas: Acesso[] } {
  const linhas: Acesso[] = [...iniciais];
  let proximo = linhas.reduce((m, l) => Math.max(m, l.id), 0) + 1;
  return {
    linhas,
    /* Há registro do mesmo e-mail no mesmo projeto a partir de `desde`? */
    async existeDesde(email, projeto, desde) {
      return linhas.some((l) => l.email === email && l.projeto === projeto && l.criadoEm >= desde);
    },
    /* Insere e devolve o id gerado. */
    async inserir(novo: NovoAcesso) {
      const id = proximo++;
      linhas.push({ id, ...novo });
      return id;
    },
    /* Lista do mais recente para o mais antigo, com filtros opcionais. */
    async listar(filtro) {
      return linhas
        .filter((l) => (!filtro.projeto || l.projeto === filtro.projeto) && (!filtro.desde || l.criadoEm >= filtro.desde))
        .sort((a, b) => (a.criadoEm === b.criadoEm ? b.id - a.id : a.criadoEm < b.criadoEm ? 1 : -1))
        .slice(0, filtro.limite);
    },
    /* Totais gerais, por projeto e por dia a partir de `desdeDia`. */
    async resumir(desdeDia): Promise<ResumoAcessos> {
      const porProjeto = new Map<string, { acessos: number; emails: Set<string> }>();
      const porDia = new Map<string, number>();
      for (const l of linhas) {
        const p = porProjeto.get(l.projeto) ?? { acessos: 0, emails: new Set<string>() };
        p.acessos++; p.emails.add(l.email); porProjeto.set(l.projeto, p);
        const dia = l.criadoEm.slice(0, 10);
        if (l.criadoEm >= desdeDia) porDia.set(dia, (porDia.get(dia) ?? 0) + 1);
      }
      return {
        total: linhas.length,
        pessoas: new Set(linhas.map((l) => l.email)).size,
        porProjeto: [...porProjeto].map(([projeto, v]) => ({ projeto, acessos: v.acessos, pessoas: v.emails.size })).sort((a, b) => b.acessos - a.acessos),
        porDia: [...porDia].map(([dia, acessos]) => ({ dia, acessos })).sort((a, b) => a.dia.localeCompare(b.dia)),
      };
    },
    /* Remove todos os registros de um e-mail e devolve quantos saíram. */
    async apagarPorEmail(email) {
      const antes = linhas.length;
      for (let i = linhas.length - 1; i >= 0; i--) if (linhas[i]!.email === email) linhas.splice(i, 1);
      return antes - linhas.length;
    },
    /* Remove registros anteriores à data (retenção). */
    async apagarAntesDe(data) {
      const antes = linhas.length;
      for (let i = linhas.length - 1; i >= 0; i--) if (linhas[i]!.criadoEm < data) linhas.splice(i, 1);
      return antes - linhas.length;
    },
  };
}

/* Fim de repositorio-memoria.ts */
