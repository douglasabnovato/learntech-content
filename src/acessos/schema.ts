/* schema.ts — contrato do registro de acesso: o que o site envia e o que fica gravado. */
import { z } from "zod";
import { projeto } from "../schemas/comum";

export const entradaAcessoSchema = z.object({
  nome: z.string().trim().min(3, "informe o nome completo").max(120)
    .refine((n) => n.split(/\s+/).filter(Boolean).length >= 2, "informe nome e sobrenome"),
  email: z.string().trim().toLowerCase().max(254).pipe(z.email("e-mail inválido")),
  projeto,
  pagina: z.string().trim().max(300).optional(),
  turnstileToken: z.string().max(4096).optional(),
});

export type EntradaAcesso = z.infer<typeof entradaAcessoSchema>;

export interface Acesso {
  id: number;
  nome: string;
  email: string;
  projeto: string;
  pagina: string | null;
  criadoEm: string;
}

export interface FiltroAcessos {
  projeto?: string;
  desde?: string;
  limite: number;
}

export interface ResumoAcessos {
  total: number;
  pessoas: number;
  porProjeto: { projeto: string; acessos: number; pessoas: number }[];
  porDia: { dia: string; acessos: number }[];
}

/* Fim de schema.ts */
