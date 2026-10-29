/* schema.ts — contrato da mensagem do "Fala aê": o que o site envia e o que fica gravado. */
import { z } from "zod";
import { projeto } from "../schemas/comum";
import { entradaAcessoSchema } from "../acessos/schema";

/* Motivos aceitos; precisam bater com a lista do formulário em learn-tech/src/pages/falaae/FalaAe.jsx. */
export const motivos = ["duvida-programa", "sugestao-conteudo", "problema-tecnico", "privacidade", "outro"] as const;
export const motivo = z.enum(motivos);

export const entradaMensagemSchema = z.object({
  nome: entradaAcessoSchema.shape.nome,
  email: entradaAcessoSchema.shape.email,
  motivo,
  mensagem: z.string().trim().min(1, "escreva a mensagem").max(4000, "a mensagem pode ter até 4000 caracteres"),
  projeto,
  pagina: z.string().trim().max(300).optional(),
  turnstileToken: z.string().max(4096).optional(),
});

export type EntradaMensagem = z.infer<typeof entradaMensagemSchema>;

export interface Mensagem {
  id: number;
  criadoEm: string;
  projeto: string;
  motivo: string;
  nome: string;
  email: string;
  mensagem: string;
  pagina: string | null;
}

export interface FiltroMensagens {
  projeto?: string;
  motivo?: string;
  email?: string;
  desde?: string;
  limite: number;
}

/* Fim de schema.ts */
