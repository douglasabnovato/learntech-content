/* comum.ts — peças de schema reaproveitadas por todos os recursos da API. */
import { z } from "zod";

export const textoObrigatorio = z.string().trim().min(1);

export const urlAbsoluta = z.url({ protocol: /^https?$/ });

export const caminhoMidia = z.string().regex(/^\/media\/[a-z0-9/_.-]+\.(webp|pdf|png|jpg|svg|mp4)$/, "caminho de mídia deve começar com /media/ e usar minúsculas");

export const urlOuMidia = z.union([urlAbsoluta, caminhoMidia]);

export const slug = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "slug em minúsculas separado por hífen");

export const projetos = ["learn-tech", "bootcamps", "career", "tools"] as const;
export const projeto = z.enum(projetos);
export type Projeto = z.infer<typeof projeto>;

/* Fim de comum.ts */
