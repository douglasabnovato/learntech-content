/* acervo.ts — schema do registro permanente do hd (a pasta de material bruto do autor).
   O hd é esvaziado depois que cada leva vira conteúdo da API; este registro fica.
   Regra de privacidade: guarda só hash, tipo, tamanho e a decisão editorial — nunca o nome nem o conteúdo dos arquivos. */
import { z } from "zod";
import { textoObrigatorio } from "./comum";

export const DIREITOS = ["proprio", "terceiro-citavel", "sensivel-anonimizar", "descartar", "a-triar"] as const;

/* Estados na ordem do fluxo de agentes (docs/processo/agentes.md):
   novo → extraido → triado → planejado (aprovado no A1) → produzido → publicado → exibido.
   "publicado-em-parte", "referencia" e "nao-publicavel" são saídas laterais do fluxo. */
export const ESTADOS_ACERVO = [
  "novo", "extraido", "triado", "planejado", "produzido", "publicado", "publicado-em-parte", "exibido",
  "referencia", "nao-publicavel",
] as const;

/* Quem moveu o item de estado: o autor (aprovações A1, A2 e A3) ou um dos agentes. */
export const RESPONSAVEIS = [
  "autor", "triador", "produtor-learn-tech", "produtor-bootcamps", "produtor-career", "produtor-tools", "revisor", "verificador",
] as const;

const COM_DESTINO = ["produzido", "publicado", "publicado-em-parte", "exibido"];
const TRIADOS = ["triado", "planejado", "produzido", "publicado", "publicado-em-parte", "exibido"];
const data = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

/* Uso de cada arquivo (relatório de uso do hd, 06/11/2026). 100% usado = nenhum arquivo "pendente".
   Usado: exibido (aparece na tela), fonte (virou texto publicado), similar (quase igual a um exibido),
   referencia (base de conhecimento do texto, sem exibição: ex.: material do ex-empregador, regras editoriais seção 7).
   Resolvido sem uso, com justificativa: tecnico (sem conteúdo), descartado (sem valor).
   Arquivo sem o campo conta como pendente. Cópias idênticas no hd têm o mesmo hash: seguem o uso do original. */
export const USOS_ARQUIVO = ["exibido", "fonte", "similar", "referencia", "tecnico", "descartado", "pendente"] as const;
const sha = z.string().regex(/^[a-f0-9]{64}$/, "sha256 em hexadecimal minúsculo");

const arquivoSchema = z.object({
  sha256: sha,
  ext: z.string().regex(/^[a-z0-9]+$|^sem-extensao$/),
  bytes: z.number().int().nonnegative(),
  uso: z.enum(USOS_ARQUIVO).optional(),
  /* Para exibido e fonte: um dos destinos do item. */
  destino: z.string().optional(),
  /* Para similar: hash do arquivo exibido que o representa. */
  similarA: sha.optional(),
  /* Para descartado (obrigatório) e referencia (opcional): o motivo, sem nome de pessoa ou cliente. */
  motivo: z.string().optional(),
}).refine((f) => !["exibido", "fonte"].includes(f.uso ?? "") || !!f.destino, "arquivo exibido ou fonte precisa de destino")
  .refine((f) => f.uso !== "similar" || !!f.similarA, "arquivo similar precisa de similarA (hash do exibido)")
  .refine((f) => f.uso !== "descartado" || !!f.motivo?.trim(), "arquivo descartado precisa de motivo");

/* Ficha do triador: a confiança decide se o item vai direto para a tabela do A1 ou vira pergunta ao autor. */
const triagemSchema = z.object({
  confianca: z.number().min(0).max(1),
  justificativa: textoObrigatorio,
  /* Sinais de risco achados no material (ex.: "e-mail", "marca de cliente", "rosto"), sem copiar o dado. */
  sinais: z.array(textoObrigatorio).optional(),
  em: data,
});

const etapaSchema = z.object({ estado: z.enum(ESTADOS_ACERVO), em: data, por: z.enum(RESPONSAVEIS) });

export const itemAcervoSchema = z.object({
  id: z.string().regex(/^(DOC|EV)-\d{3}$|^HD-\d{4}$/, "id DOC-000, EV-000 ou HD-0000"),
  lote: data,
  origem: textoObrigatorio,
  descricao: textoObrigatorio,
  direitos: z.enum(DIREITOS),
  estado: z.enum(ESTADOS_ACERVO),
  destinos: z.array(textoObrigatorio),
  proximaAcao: z.string().optional(),
  /* Trabalho que ainda falta para o conteúdo do item estar completo na API (ex.: subir vídeos, transcrever áudio).
     Item com pendência conta como aberto em npm run leva:status, mesmo publicado. */
  pendencias: z.array(textoObrigatorio).optional(),
  triagem: triagemSchema.optional(),
  /* Histórico de mudanças de estado, para medir o tempo do hd até o ar. */
  etapas: z.array(etapaSchema).optional(),
  arquivos: z.array(arquivoSchema),
  /* Itens catalogados antes do controle por hash: os arquivos já saíram do hd. */
  registradoSemHash: z.boolean().optional(),
}).refine((i) => i.registradoSemHash || i.arquivos.length > 0, "item precisa de arquivos com hash (ou registradoSemHash: true)")
  .refine((i) => !COM_DESTINO.includes(i.estado) || i.destinos.length > 0, "item produzido, publicado ou exibido precisa de destino")
  .refine((i) => !TRIADOS.includes(i.estado) || i.direitos !== "a-triar", "item triado precisa de direitos definidos")
  .refine((i) => !i.etapas?.length || i.etapas[i.etapas.length - 1]?.estado === i.estado, "a última etapa precisa ser o estado atual")
  .refine((i) => i.arquivos.every((f) => !f.destino || i.destinos.includes(f.destino)), "o destino do arquivo precisa ser um dos destinos do item");

export const acervoSchema = z.object({
  atualizadoEm: data,
  observacao: z.string().optional(),
  itens: z.array(itemAcervoSchema),
});

export type Acervo = z.infer<typeof acervoSchema>;

/* Fim de acervo.ts */
