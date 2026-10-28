/* career-tools.ts — schemas das listas de links dos sites career e tools. */
import { z } from "zod";
import { textoObrigatorio, urlAbsoluta, urlOuMidia, slug } from "./comum";

/* Miniatura: URL absoluta, mídia da API ou caminho ./assets/ do próprio site consumidor (resolvido por ele). */
export const thumbSchema = z.union([urlOuMidia, z.string().regex(/^\.\/assets\/[\w./-]+$/)]);

/* Vídeo incorporável do YouTube (formato /embed/ID ou youtube-nocookie). */
export const videoYoutube = z.string().regex(/^https:\/\/www\.youtube(-nocookie)?\.com\/embed\/[\w-]{11}$/, "vídeo deve ser https://www.youtube.com/embed/<id>");

/* Página de detalhe opcional de um item das listas: texto, imagens, vídeo e links oficiais.
   Item com detalhe precisa de slug (conferido no build); item sem detalhe continua abrindo o site oficial. */
export const detalheSchema = z.object({
  resumo: textoObrigatorio,
  paragrafos: z.array(textoObrigatorio).min(1),
  imagens: z.array(z.object({ url: urlOuMidia, alt: textoObrigatorio, legenda: z.string().optional() })).optional(),
  video: videoYoutube.optional(),
  links: z.array(z.object({ label: textoObrigatorio, url: urlAbsoluta })).optional(),
  fontes: z.array(z.object({ label: textoObrigatorio, url: urlAbsoluta })).optional(),
  atualizadoEm: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

/* Campos comuns opcionais: identificador estável na URL e conteúdo da página de detalhe. */
const comDetalhe = { slug: slug.optional(), detalhe: detalheSchema.optional() };

export const empresaSchema = z.object({
  title: textoObrigatorio,
  location: textoObrigatorio,
  thumb: thumbSchema,
  site_url: urlAbsoluta,
  category: textoObrigatorio,
  ...comDetalhe,
});

export const vagaOuPerfilSchema = z.object({
  title: textoObrigatorio,
  duration: textoObrigatorio,
  thumb: thumbSchema,
  site_url: urlAbsoluta,
  category: textoObrigatorio,
  ...comDetalhe,
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
  ...comDetalhe,
});

/* Fim de career-tools.ts */
