/* learn-tech.ts — schemas dos programas, quizzes e páginas do site learn-tech (mesmo formato que o frontend consome). */
import { z } from "zod";
import { textoObrigatorio, urlOuMidia, urlAbsoluta } from "./comum";

export const ICONES_MODULO = [
  "bolt", "clipboard", "comment", "folder", "gauge", "github", "globe",
  "grid", "laptop", "list", "mobile", "palette", "rocket", "search",
  "shield", "sitemap", "sync", "tags", "tasks", "tools",
] as const;

const icone = z.enum(ICONES_MODULO);

export const questaoSchema = z.object({
  id: z.number().int().positive(),
  moduleId: z.number().int().nonnegative(),
  question: textoObrigatorio,
  explanation: textoObrigatorio,
  options: z.array(z.object({ text: textoObrigatorio, isCorrect: z.boolean() })).min(2),
});

const passoSchema = z.looseObject({
  number: z.number().int().positive(),
  title: textoObrigatorio,
  guidance: textoObrigatorio,
  code: z.string().optional(),
  tips: z.array(z.string()).optional(),
});

export const conteudoModuloSchema = z.looseObject({
  id: z.number().int().nonnegative(),
  icon: icone,
  title: textoObrigatorio,
  shortDescription: textoObrigatorio,
  introductionText: textoObrigatorio,
  sections: z.array(z.looseObject({ title: textoObrigatorio, subsections: z.array(passoSchema).min(1) })).min(1),
  highlightsTitle: z.string().optional(),
  highlights: z.array(z.looseObject({ icon: icone, title: textoObrigatorio, text: textoObrigatorio })).optional(),
  closingText: textoObrigatorio,
  ctaTitle: textoObrigatorio,
  ctaText: textoObrigatorio,
  nextButtonText: textoObrigatorio,
});

export const moduloSchema = z.object({
  id: z.number().int().nonnegative(),
  title: textoObrigatorio,
  lessonsCount: z.number().int().nonnegative(),
  component: z.string(),
});

export const programaSchema = z.looseObject({
  id: z.number().int().positive(),
  image: urlOuMidia.nullable().optional(),
  video: urlOuMidia.nullable().optional(),
  videoPoster: urlOuMidia.nullable().optional(),
  category: textoObrigatorio,
  categoryFilter: z.string().regex(/^[a-z0-9-]+$/),
  title: textoObrigatorio,
  lessons: z.string().optional(),
  duration: z.string().optional(),
  access: z.string().optional(),
  accessType: z.string().optional(),
  level: z.string().nullable().optional(),
  description: z.string().optional(),
  modules: z.array(moduloSchema).optional(),
  moduleContents: z.array(conteudoModuloSchema).optional(),
  quiz: z.array(questaoSchema).optional(),
  sources: z.array(z.object({ label: textoObrigatorio, url: urlAbsoluta })).optional(),
}).refine((p) => !("rating" in p) && !("students" in p), "programa não expõe rating nem students (números que a plataforma não mede)");

export type Programa = z.infer<typeof programaSchema>;

export const CAMPOS_RESUMO = [
  "id", "image", "video", "videoPoster", "category", "categoryFilter", "title",
  "lessons", "duration", "access", "accessType", "level", "description",
] as const;

export const paginaSchema = z.record(z.string(), z.unknown());

export const PAGINAS = [
  "sobre", "aprender", "carreira", "categorias", "blog", "faq",
  "navegacao", "mentorias", "privacidade", "termos", "estatisticas",
] as const;

/* Fim de learn-tech.ts */
