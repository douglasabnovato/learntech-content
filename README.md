# learntech-content

API de conteúdo do ecossistema **LearnTECH**: um só lugar para os programas, eventos, empresas, vagas, perfis e ferramentas que alimentam os quatro sites. O projeto é gratuito e sem fins comerciais.

| Site | O que consome |
|---|---|
| [learn-tech](https://learn-tech-pied.vercel.app/) | programas, quizzes e páginas |
| [bootcamps](https://bootcamps-dun.vercel.app/) | eventos, edições e galerias |
| [career](https://douglasabnovato.github.io/career/) | empresas, vagas, perfis e destaques |
| [tools](https://douglasabnovato.github.io/tools/) | ferramentas e hospedagens |

## Como funciona

- **Leitura:** o conteúdo fica em `content/` como JSON versionado no Git. O build valida tudo com Zod e com regras de integridade, depois gera arquivos estáticos em `dist/v1`. A Cloudflare serve esses arquivos direto da borda, sem banco.
- **Escrita:** é só o registro de acesso (nome completo, e-mail, projeto, página e horário). Ele passa pelo Worker e grava no D1.
- **Identificação:** os quatro sites carregam o mesmo script, `/sdk/identificacao.js`. Ele pede nome e e-mail uma vez por navegador e registra um acesso por sessão. Não existe login nem senha.

Mais detalhes em [docs/ARQUITETURA.md](docs/ARQUITETURA.md) e [docs/DECISOES.md](docs/DECISOES.md).

## Endpoints

| Método | Caminho | Descrição |
|---|---|---|
| GET | `/v1/index.json` | Índice dos recursos |
| GET | `/v1/openapi.json` | Documentação OpenAPI 3.1 |
| GET | `/v1/learn-tech/programas.json` | Catálogo de programas (campos de card) |
| GET | `/v1/learn-tech/programas/{id}.json` | Programa completo, com módulos e quiz |
| GET | `/v1/learn-tech/paginas/{nome}.json` | sobre, aprender, carreira, categorias, blog, faq, navegacao, mentorias, privacidade, termos, estatisticas |
| GET | `/v1/bootcamps/eventos.json` e `/v1/bootcamps/eventos/{slug}.json` | Eventos |
| GET | `/v1/career/{empresas,vagas,perfis,destaques}.json` | Career |
| GET | `/v1/tools/{ferramentas,hospedagens}.json` | Tools |
| GET | `/v1/cobertura.json` | Matriz de cobertura do acervo |
| GET | `/v1/saude` | Verificação de funcionamento |
| POST | `/v1/acessos` | Registro de acesso (só a partir dos 4 domínios) |
| GET | `/v1/acessos`, `/v1/acessos/resumo` | Administração (token) |
| DELETE | `/v1/acessos?email=` | Apaga os acessos e as mensagens de um e-mail (token) |
| POST | `/v1/mensagens` | Mensagem do formulário "Fala aê" (só a partir dos 4 domínios) |
| GET | `/v1/mensagens` | Administração (token) |
| DELETE | `/v1/mensagens?email=` | Apaga só as mensagens de um e-mail (token) |

## Rodando localmente

```bash
npm install
cp .dev.vars.example .dev.vars        # defina um ADMIN_TOKEN local
npm run db:migrar:local               # cria as tabelas acessos e mensagens no D1 local
npm run dev                           # build + wrangler dev em http://localhost:8787
```

| Comando | O que faz |
|---|---|
| `npm run validar` | Só valida `content/` (rápido, bom antes de commitar conteúdo) |
| `npm test` | Testes de conteúdo e das rotas de acesso |
| `npm run typecheck` | TypeScript estrito |
| `npm run build` | Gera `dist/` |
| `npm run verificar` | typecheck + testes + build |

## Deploy

Tudo roda no plano gratuito da Cloudflare. O passo a passo está em [docs/DEPLOY.md](docs/DEPLOY.md).

## Editando conteúdo

Veja [docs/CONTEUDO.md](docs/CONTEUDO.md). Resumo: edite o JSON em `content/`, rode `npm run validar`, faça commit. O deploy publica.

## Privacidade

Veja [docs/PRIVACIDADE.md](docs/PRIVACIDADE.md). Nenhum dado pessoal fica no repositório.
