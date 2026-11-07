# Contrato: career

**Papel do site:** ajudar a pessoa a se posicionar no mercado: empresas para trabalhar, plataformas de vaga, perfis de referência e modelos de currículo fictícios. Produção em `https://douglasabnovato.github.io/career/`.

Regras comuns, hierarquia das fontes e verificação geral: [`README.md`](README.md).

## O que vira conteúdo aqui

| Material do hd | Recurso | Destino |
|---|---|---|
| Experiência numa empresa, material público dela | empresa | `career/empresas/<slug>` |
| Plataforma, programa de estágio ou trainee | vaga | `career/vagas/<slug>` |
| Pessoa pública de referência (só informação profissional e pública) | perfil | `career/perfis/<slug>` |
| Currículo, certificados, consultoria de carreira | modelo de currículo fictício ou dicas de um modelo | `career/modelos-curriculo/<slug>` |

## Empresa, vaga e perfil: itens de `content/career/{empresas,vagas,perfis}.json`
- **Schema:** `empresaSchema` e `vagaOuPerfilSchema` em `src/schemas/career-tools.ts`.
- **Exemplos de referência:** empresa `pitang`; vaga `coodesh`; perfil `tiago-gouvea`.
- **Card:** `title`, `location` (empresa) ou `duration` (vaga e perfil), `thumb`, `site_url`, `category`, `slug`.
- **Página de detalhe** (`detalhe`): `resumo` (2 a 3 frases) e de 4 a 5 `paragrafos`:
  1. como funciona;
  2. onde aparece no mercado;
  3. como começar;
  4. boas práticas e cuidados;
  5. onde aparece no ecossistema.

  Mais `links` oficiais, `fontes` de 2 domínios, de 1 a 5 `relacionados` e `atualizadoEm`.
- **Empresa de ex-empregador:** o nome real é permitido, contando a experiência do autor e o conteúdo técnico como aprendizado. Processos internos, rituais com números, ferramentas internas e eventos corporativos não entram (seção 7 das regras).
- **Item descontinuado:** fica, com `duration: "Descontinuado"`, e a página conta a história e as alternativas.
- **Thumb:** WebP em `media/career/` (logo oficial).

## Modelo de currículo: item de `content/career/modelos-curriculo.json`
- **Schema:** `modeloCurriculoSchema`. **Exemplo:** `desenvolvedor-backend-senior`.
- **Sempre fictício:** `ficticio: true`, contatos em `https://www.example.com/`. A experiência mantém o peso do original.
- **Obrigatórios:** `slug`, `nivel` (`estagio`, `junior`, `pleno`, `senior` ou `transicao`), `paraQuem`, `nome`, `titulo`, `objetivo`, `resumo`, `competencias`, `experiencias`, `formacao`, `certificados`, `idiomas`, `dicas` (pelo menos 1), `fontes` (pelo menos 1), `atualizadoEm`.

## Checklist do produtor
- [ ] `npm run validar` verde, sem item com `detalhe` e sem `slug`.
- [ ] Nenhum dado pessoal real em modelo de currículo.
- [ ] Perfis só com informação profissional e pública.
- [ ] Fontes de 2 domínios em toda página de detalhe, ou "Página em revisão".
- [ ] Relacionados com artigos e programas do learn-tech e eventos do bootcamps.

## Verificação na tela
- **API:** `/v1/career/empresas.json`, `vagas.json`, `perfis.json` e `modelos-curriculo.json`.
- **Cópias no site:** `js/good-companies.js`, `js/jobs.js`, `js/perfis-dev.js`, `js/curriculos.js` e `js/destaques.js`.
- **Página:** `detalhe.html?tipo=<empresas|vagas|perfis>&id=<slug>`, com título, `canonical` com a mesma URL e logo carregado; os modelos aparecem na seção de currículos da página inicial.
- **Sitemap:** `career/sitemap.xml`.
