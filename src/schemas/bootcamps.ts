/* bootcamps.ts — schema dos eventos, espelho de BootcampEvent do frontend bootcamps. */
import { z } from "zod";
import { textoObrigatorio, urlOuMidia, urlAbsoluta, slug } from "./comum";

const midiaSchema = z.object({
  id: textoObrigatorio,
  url: urlOuMidia,
  type: z.enum(["image", "video"]),
  alt: z.string().optional(),
});

const edicaoSchema = z.object({
  year: z.string().regex(/^\d{4}$/),
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
    videoUrl: z.string().optional(),
    gallery: z.array(midiaSchema).optional(),
    curriculum: z.array(textoObrigatorio),
    officialLink: z.union([urlAbsoluta, z.literal(""), caminhoDoSite]),
    editions: z.array(edicaoSchema).optional(),
    links: z.array(z.object({ label: textoObrigatorio, url: urlAbsoluta })).optional(),
    certificate: urlOuMidia.optional(),
  }),
});

export type Evento = z.infer<typeof eventoSchema>;

/* Fim de bootcamps.ts */
