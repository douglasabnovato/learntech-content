/* cobertura.ts — schema da matriz que liga cada pasta do acervo a-arquivos-e-livros ao projeto que a apresenta. */
import { z } from "zod";
import { textoObrigatorio, projeto } from "./comum";

export const STATUS_COBERTURA = ["publicado", "planejado", "referencia", "fora-do-escopo"] as const;

export const itemCoberturaSchema = z.object({
  pasta: textoObrigatorio,
  descricao: textoObrigatorio,
  status: z.enum(STATUS_COBERTURA),
  destinos: z.array(z.object({
    projeto,
    recurso: textoObrigatorio,
    ids: z.array(z.string()).optional(),
  })),
  observacao: z.string().optional(),
}).refine((i) => i.status === "fora-do-escopo" || i.destinos.length > 0, "item dentro do escopo precisa de ao menos um destino");

export const coberturaSchema = z.object({
  atualizadoEm: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  referencias: z.array(z.object({ nome: textoObrigatorio, url: z.url() })),
  itens: z.array(itemCoberturaSchema).min(1),
});

export type Cobertura = z.infer<typeof coberturaSchema>;

/* Fim de cobertura.ts */
