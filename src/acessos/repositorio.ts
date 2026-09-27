/* repositorio.ts — porta de persistência dos acessos; D1 em produção, memória nos testes. */
import type { Acesso, FiltroAcessos, ResumoAcessos } from "./schema";

export interface NovoAcesso {
  nome: string;
  email: string;
  projeto: string;
  pagina: string | null;
  criadoEm: string;
}

export interface RepositorioAcessos {
  existeDesde(email: string, projeto: string, desde: string): Promise<boolean>;
  inserir(novo: NovoAcesso): Promise<number>;
  listar(filtro: FiltroAcessos): Promise<Acesso[]>;
  resumir(desdeDia: string): Promise<ResumoAcessos>;
  apagarPorEmail(email: string): Promise<number>;
  apagarAntesDe(data: string): Promise<number>;
}

/* Fim de repositorio.ts */
