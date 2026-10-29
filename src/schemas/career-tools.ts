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

/* Modelo de currículo FICTÍCIO e didático. O schema obriga contatos falsos para que nenhum dado real entre por engano. */
const linkExemplo = z.string().regex(/^https:\/\/www\.example\.com\//, "link de modelo deve apontar para https://www.example.com/");
export const modeloCurriculoSchema = z.object({
  slug,
  nivel: z.enum(["estagio", "junior", "pleno", "senior", "transicao"]),
  paraQuem: textoObrigatorio,
  ficticio: z.literal(true),
  nome: textoObrigatorio,
  titulo: textoObrigatorio,
  localizacao: textoObrigatorio,
  objetivo: textoObrigatorio,
  resumo: textoObrigatorio,
  contato: z.object({
    telefone: z.literal("(00) 00000-0000"),
    email: z.string().regex(/^[a-z0-9._-]+@example\.com$/, "e-mail de modelo deve terminar em @example.com"),
    linkedin: linkExemplo,
    github: linkExemplo,
    portfolio: linkExemplo,
  }),
  competencias: z.array(z.object({ categoria: textoObrigatorio, itens: z.array(textoObrigatorio) })),
  experiencias: z.array(z.object({
    cargo: textoObrigatorio,
    empresa: textoObrigatorio,
    descricaoEmpresa: z.string().optional(),
    periodo: textoObrigatorio,
    local: textoObrigatorio,
    modelo: textoObrigatorio,
    atividades: z.array(textoObrigatorio),
    tecnologias: z.array(textoObrigatorio),
  })),
  experienciaAnterior: z.array(z.object({ empresa: textoObrigatorio, cargo: textoObrigatorio, periodo: textoObrigatorio })),
  projetos: z.array(z.object({ nome: textoObrigatorio, descricao: textoObrigatorio, tecnologias: z.array(textoObrigatorio) })),
  formacao: z.array(z.object({ curso: textoObrigatorio, instituicao: textoObrigatorio, periodo: textoObrigatorio, status: textoObrigatorio })),
  certificados: z.array(textoObrigatorio),
  idiomas: z.array(z.object({ idioma: textoObrigatorio, nivel: textoObrigatorio })),
  comunidade: z.array(textoObrigatorio),
  dicas: z.array(z.object({ secao: textoObrigatorio, texto: textoObrigatorio })).min(1),
  fontes: z.array(z.object({ label: textoObrigatorio, url: urlAbsoluta })).min(1),
  atualizadoEm: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
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
