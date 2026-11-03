/* sites.mjs — endereços dos quatro sites usados pelos testes de ponta a ponta e pelos scripts de UX.
   Por padrão, testa produção. Para testar local, defina as variáveis (ex.: E2E_LEARN_TECH=http://localhost:5173). */
export const SITES = {
  "learn-tech": process.env.E2E_LEARN_TECH ?? "https://learn-tech-pied.vercel.app",
  bootcamps: process.env.E2E_BOOTCAMPS ?? "https://bootcamps-dun.vercel.app",
  career: process.env.E2E_CAREER ?? "https://douglasabnovato.github.io/career",
  tools: process.env.E2E_TOOLS ?? "https://douglasabnovato.github.io/tools",
};

/* Páginas representativas de cada site: a home, uma lista e uma página de detalhe. */
export const PAGINAS = [
  { site: "learn-tech", nome: "home", caminho: "/" },
  { site: "learn-tech", nome: "programa-1104", caminho: "/program/marketing-crm/1104" },
  { site: "learn-tech", nome: "artigo", caminho: "/blog/bastidores-de-um-hackathon-de-comunidade" },
  { site: "bootcamps", nome: "home", caminho: "/" },
  { site: "bootcamps", nome: "evento", caminho: "/event/hackathon-inovacao-social-jf" },
  { site: "career", nome: "home", caminho: "/" },
  { site: "career", nome: "empresa", caminho: "/detalhe.html#tipo=empresas&id=abc-da-construcao" },
  { site: "tools", nome: "home", caminho: "/" },
  { site: "tools", nome: "ferramenta", caminho: "/detalhe.html#id=figma" },
];

export const url = (p) => SITES[p.site].replace(/\/$/, "") + p.caminho;

/* Fim de sites.mjs */
