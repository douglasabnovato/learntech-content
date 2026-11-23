/* disciplina.ts — schema do tipo "disciplina" (#47, decisão 120): o guia de cada disciplina dos cursos da 5-expertise,
   publicado no learn-tech. O padrão está em docs/processo/padrao-disciplina.md. */
import { z } from "zod";
import { textoObrigatorio, urlAbsoluta, slug } from "./comum";

/* O ano que não sai dos arquivos fica assim até o autor confirmar. Nunca se inventa o ano. */
export const ANO_A_CONFIRMAR = "a confirmar";

/* A referência no formato fixo do autor (22/11/2026), montada a partir dos campos da disciplina. */
export function montarReferencia(d: {
  nome: string;
  codigo?: string;
  curso: string;
  grau: string;
  instituicao: string;
  ano: string;
}): string {
  const disciplina = d.codigo ? `${d.nome} (${d.codigo})` : d.nome;
  return `Conteúdo criado a partir do trabalho da disciplina de ${disciplina} do curso de ${d.curso} do ${d.grau} da ${d.instituicao} em ${d.ano}.`;
}

const fonte = z.object({ label: textoObrigatorio, url: urlAbsoluta });

/* Exercício: o enunciado reescrito e a resolução demonstrada passo a passo (nunca só a resposta). */
const exercicioSchema = z.object({
  enunciado: textoObrigatorio,
  resolucao: z.array(textoObrigatorio).min(1),
  codigo: z.string().optional(),
  linguagem: z.string().optional(),
});

/* Capítulo: o título original, os subcapítulos na ordem, o resumo estratégico e os exercícios. */
const capituloSchema = z.object({
  titulo: textoObrigatorio,
  subcapitulos: z.array(textoObrigatorio),
  resumo: textoObrigatorio,
  exercicios: z.array(exercicioSchema),
});

export const disciplinaSchema = z
  .object({
    id: slug,
    codigo: z
      .string()
      .regex(/^[A-Z]{2,5}\d{2,4}$/, "código da disciplina em maiúsculas, como DCC013")
      .optional(),
    nome: textoObrigatorio,
    curso: textoObrigatorio,
    grau: textoObrigatorio,
    instituicao: textoObrigatorio,
    ano: z.union([z.string().regex(/^(19|20)\d{2}$/, 'ano com 4 dígitos ou "a confirmar"'), z.literal(ANO_A_CONFIRMAR)]),
    /* Obrigatória e no formato fixo: tem que ser igual à montada a partir dos campos acima. */
    referencia: textoObrigatorio,
    capitulos: z.array(capituloSchema).min(1),
    usosPraticos: z
      .array(z.object({ titulo: textoObrigatorio, texto: textoObrigatorio, fontes: z.array(fonte).min(1) }))
      .length(3, "a disciplina tem exatamente 3 usos práticos"),
    links: z.object({ repositorio: urlAbsoluta.optional(), visual: urlAbsoluta.optional() }),
    updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  })
  .refine((d) => d.referencia === montarReferencia(d), {
    path: ["referencia"],
    message: "referencia fora do formato fixo (veja montarReferencia em src/schemas/disciplina.ts)",
  });

export type Disciplina = z.infer<typeof disciplinaSchema>;

/* Fim de disciplina.ts */
