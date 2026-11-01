/* bootcamps.ts — schema dos eventos, espelho de BootcampEvent do frontend bootcamps. */
import { z } from "zod";
import { textoObrigatorio, urlOuMidia, urlAbsoluta, slug } from "./comum";
import { relacionadoSchema } from "./career-tools";

const midiaSchema = z.object({
  id: textoObrigatorio,
  url: urlOuMidia,
  type: z.enum(["image", "video"]),
  alt: z.string().optional(),
});

/* Atividade da programação de uma edição. */
const atividadeSchema = z.object({
  tipo: z.enum(["palestra", "painel", "workshop", "networking", "sorteio"]),
  titulo: textoObrigatorio,
  descricao: z.string().optional(),
});

/* Uma edição de evento recorrente. Só year, image, highlight e status são obrigatórios;
   os demais detalham eventos com várias edições no mesmo ano (ex.: comunidades locais). */
const edicaoSchema = z.object({
  numero: z.number().int().positive().optional(),
  year: z.string().regex(/^\d{4}$/),
  /* Data no formato AAAA-MM-DD; o build confere se bate com year. */
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  horario: z.string().optional(),
  local: z.object({ nome: textoObrigatorio, cidade: textoObrigatorio }).optional(),
  tema: z.string().optional(),
  /* Série ou formato da edição (ex.: "Pcamp Pocket"). Numeração é única dentro do formato. */
  formato: z.string().optional(),
  programacao: z.array(atividadeSchema).optional(),
  /* Presença do autor na edição. */
  participacao: z.enum(["presente", "inscrito", "nao-participou"]).optional(),
  link: urlAbsoluta.optional(),
  image: z.string(),
  highlight: textoObrigatorio,
  status: z.enum(["realizado", "anunciado"]),
});

/* Caminho servido pelo próprio site bootcamps (ex.: /eventos-vivos/...), resolvido por ele. */
const caminhoDoSite = z.string().regex(/^\/(?!media\/)[\w./-]+$/);

export const eventoSchema = z.object({
  id: textoObrigatorio,
  slug,
  title: textoObrigatorio,
  institution: textoObrigatorio,
  description: textoObrigatorio,
  coverImage: urlOuMidia,
  altText: textoObrigatorio,
  category: z.enum(["frontend", "backend", "fullstack", "mobile", "outros"]),
  status: z.enum(["concluido", "desejado"]),
  content: z.object({
    longDescription: textoObrigatorio,
    /* Texto completo da página (o longDescription fica como abertura). */
    paragraphs: z.array(textoObrigatorio).optional(),
    videoUrl: z.string().optional(),
    gallery: z.array(midiaSchema).optional(),
    curriculum: z.array(textoObrigatorio),
    officialLink: z.union([urlAbsoluta, z.literal(""), caminhoDoSite]),
    editions: z.array(edicaoSchema).optional(),
    links: z.array(z.object({ label: textoObrigatorio, url: urlAbsoluta })).optional(),
    certificate: urlOuMidia.optional(),
    /* Fontes consultadas para escrever a página. */
    sources: z.array(z.object({ label: textoObrigatorio, url: urlAbsoluta })).optional(),
    /* Ligações com conteúdo dos outros projetos ({ tipo, id }); o build confere e publica título e URL. */
    relacionados: z.array(relacionadoSchema).optional(),
  }),
});

export type Evento = z.infer<typeof eventoSchema>;

/* Fim de bootcamps.ts */
