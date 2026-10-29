/* repositorio.ts — porta de persistência das mensagens do "Fala aê"; D1 em produção, memória nos testes. */
import type { Mensagem, FiltroMensagens } from "./schema";

export type NovaMensagem = Omit<Mensagem, "id">;

export interface RepositorioMensagens {
  existeIgualDesde(email: string, mensagem: string, desde: string): Promise<boolean>;
  inserir(nova: NovaMensagem): Promise<number>;
  listar(filtro: FiltroMensagens): Promise<Mensagem[]>;
  apagarPorEmail(email: string): Promise<number>;
  apagarAntesDe(data: string): Promise<number>;
}

/* Fim de repositorio.ts */
