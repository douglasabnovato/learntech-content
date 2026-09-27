/* career-tools.ts — schemas das listas de links dos sites career e tools. */
import { z } from "zod";
import { textoObrigatorio, urlAbsoluta, urlOuMidia } from "./comum";

/* Miniatura: URL absoluta, mídia da API ou caminho ./assets/ do próprio site consumidor (resolvido por ele). */
export const thumbSchema = z.union([urlOuMidia, z.string().regex(/^\.\/assets\/[\w./-]+$/)]);

export const empresaSchema = z.object({
  title: textoObrigatorio,
  location: textoObrigatorio,
  thumb: thumbSchema,
  site_url: urlAbsoluta,
  category: textoObrigatorio,
});

export const vagaOuPerfilSchema = z.object({
  title: textoObrigatorio,
  duration: textoObrigatorio,
  thumb: thumbSchema,
  site_url: urlAbsoluta,
  category: textoObrigatorio,
});

export const destaquesSchema = z.object({
  vaga: textoObrigatorio,
  empresa: textoObrigatorio,
  perfil: textoObrigatorio,
});

export const ferramentaSchema = z.object({
  title: textoObrigatorio,
  description: textoObrigatorio,
  category: textoObrigatorio,
  pricing: textoObrigatorio,
  thumb: thumbSchema,
  site_url: urlAbsoluta,
  thumbFit: z.enum(["cover", "contain"]).optional(),
});

/* Fim de career-tools.ts */
