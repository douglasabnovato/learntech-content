/* acervo.ts — schema do registro permanente do hd (a pasta de material bruto do autor).
   O hd é esvaziado depois que cada leva vira conteúdo da API; este registro fica.
   Regra de privacidade: guarda só hash, tipo, tamanho e a decisão editorial — nunca o nome nem o conteúdo dos arquivos. */
import { z } from "zod";
import { textoObrigatorio } from "./comum";

export const DIREITOS = ["proprio", "terceiro-citavel", "sensivel-anonimizar", "descartar", "a-triar"] as const;
export const ESTADOS_ACERVO = ["novo", "planejado", "publicado", "publicado-em-parte", "referencia", "nao-publicavel"] as const;

const arquivoSchema = z.object({
  sha256: z.string().regex(/^[a-f0-9]{64}$/, "sha256 em hexadecimal minúsculo"),
  ext: z.string().regex(/^[a-z0-9]+$|^sem-extensao$/),
  bytes: z.number().int().nonnegative(),
});

export const itemAcervoSchema = z.object({
  id: z.string().regex(/^(DOC|EV)-\d{3}$|^HD-\d{4}$/, "id DOC-000, EV-000 ou HD-0000"),
  lote: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  origem: textoObrigatorio,
  descricao: textoObrigatorio,
  direitos: z.enum(DIREITOS),
  estado: z.enum(ESTADOS_ACERVO),
  destinos: z.array(textoObrigatorio),
  proximaAcao: z.string().optional(),
  /* Trabalho que ainda falta para o conteúdo do item estar completo na API (ex.: subir vídeos, transcrever áudio).
     Item com pendência conta como aberto em npm run leva:status, mesmo publicado. */
  pendencias: z.array(textoObrigatorio).optional(),
  arquivos: z.array(arquivoSchema),
  /* Itens catalogados antes do controle por hash: os arquivos já saíram do hd. */
  registradoSemHash: z.boolean().optional(),
}).refine((i) => i.registradoSemHash || i.arquivos.length > 0, "item precisa de arquivos com hash (ou registradoSemHash: true)")
  .refine((i) => !["publicado", "publicado-em-parte"].includes(i.estado) || i.destinos.length > 0, "item publicado precisa de destino");

export const acervoSchema = z.object({
  atualizadoEm: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  observacao: z.string().optional(),
  itens: z.array(itemAcervoSchema),
});

export type Acervo = z.infer<typeof acervoSchema>;

/* Fim de acervo.ts */
