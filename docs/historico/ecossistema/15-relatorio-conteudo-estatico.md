# Relatório: conteúdo estático dos 4 sites levado à API (28/10/2026)

Branch `feature/tasks-28-10-2026` nos 5 repositórios. Plano e inventário em `14-conteudo-estatico.md`.

## 1. Resultado

| Site | Antes | Depois |
|---|---|---|
| **learn-tech** | Tela `/category` com texto fixo e sem fontes. Cópia do blog com 5 artigos. 6 arquivos sem uso, incluindo depoimentos inventados | `/category` lê `learn-tech/areas.json` da API, com "Como começar", ferramentas e fontes por área. Cópia do blog gerada da API (18 artigos). Arquivos sem uso removidos |
| **bootcamps** | Cópia com 17 eventos e imagens importadas. Páginas próprias de BQ e ByteClass (rascunhos com formulário que coletava dados sem enviar) | Cópia gerada da API (22 eventos, imagens da API). As páginas saíram e o conteúdo aproveitável foi para os eventos na API. 20 imagens e 2 arquivos sem uso saíram |
| **career** | BRQ só na cópia local, com janela própria e 3 vagas sem data. Currículos de exemplo com possível dado real. Banner com seleção fixa no código. Cópias com 16 empresas e 16 vagas | BRQ na API, com página de detalhe e fontes. Janela, vagas e o código delas removidos. **Modelos de currículo** fictícios na API, com aviso, para quem serve, dicas e fontes. Banner usa a seleção da API. Cópias geradas (26 empresas, 19 vagas) |
| **tools** | Cópia com 45 ferramentas e 10 hospedagens | Cópia gerada da API (60 e 11). 2 imagens sem uso (1,9 MB) removidas |
| **API** | — | 2 tipos novos (`learn-tech/areas.json`, `career/modelos-curriculo.json`) com schema, regras no build, OpenAPI e 5 testes novos. BRQ, Vagas.com e We Work Remotely acrescentados. BQ e ByteClass completados. Script `npm run copias` e `npm run copias:conferir` |

## 2. Como funciona agora

1. **A fonte é a API.** O conteúdo é editado só em `learntech-content/content/`.
2. **`npm run copias`** (no learntech-content) gera a cópia de reserva dos 4 sites, que ficam como pastas irmãs.
3. **Com a API no ar,** cada site mostra o conteúdo dela e as páginas de detalhe.
4. **Sem a API,** o site mostra a cópia gerada: o mesmo conteúdo, sem as páginas de detalhe. O card abre o site oficial.
5. **O texto do site** (títulos, botões, rodapé, textos institucionais) continua no código de cada site.

## 3. Verificação

| O quê | Resultado |
|---|---|
| Conteúdo da API com os schemas reais (Zod) e as regras de integridade | 0 erros. São 34 programas, 22 eventos, 60 ferramentas, 26 empresas, 19 vagas, 5 áreas, 3 modelos e 78 recursos |
| Typecheck da API | ok |
| Typecheck e lint do bootcamps | ok |
| Lint do learn-tech nos arquivos alterados | ok (o projeto já tinha 71 erros de lint em outros arquivos) |
| Sintaxe de todos os JS do career e do tools | ok |
| Navegador (Chromium), career e tools, com e sem API, em 1366 px e em 390 px | 26 empresas. BRQ abre o detalhe com API e o site oficial sem API. Banner com 3 destaques. Os 3 modelos de currículo aparecem com aviso de fictício, dicas, fontes, `@example.com` e `(00) 00000-0000`. Tools com 60 ferramentas nos dois modos. Nenhum erro no console |
| Cópias em dia (`npm run copias:conferir`) | ok, 10 arquivos |

**Ainda falta, do seu lado:**
- **No learntech-content:** `npm run verificar`, que roda o build oficial e os testes (incluindo os 5 novos).
- **No learn-tech:** `npm test` e `npm run build`.
- **No bootcamps:** `npm run build`.
- **No navegador:** `/category` do learn-tech e a Home e os eventos do bootcamps. Vite não roda deste lado.

## 4. Decisões que você pode mudar

| # | Decisão | Onde mudar |
|---|---|---|
| 1 | BRQ com `site_url` na página de carreiras; categoria "Consultancy"; "+2.000 profissionais" (número do site da BRQ) em vez de "2.500"; sem vídeo (o canal do vídeo da página de carreiras não foi confirmado) | `content/career/empresas.json` (item `brq`) |
| 2 | As 3 vagas da BRQ no LinkedIn saíram e não foram para a API | — |
| 3 | 3 modelos de currículo: estágio em desenvolvimento web, transição de carreira para dados, front-end júnior. Pessoas e empresas fictícias, resultados ilustrativos | `content/career/modelos-curriculo.json` |
| 4 | O build **recusa** contato real nos modelos (telefone, e-mail e links obrigatoriamente fictícios) | `src/schemas/career-tools.ts` (`modeloCurriculoSchema`) |
| 5 | Áreas: 6 ícones trocados por equivalentes já registrados (ex.: servidor → Node). Para voltar aos originais, registre-os em `learn-tech/src/constants/icones.js` e troque os nomes no JSON | `content/learn-tech/areas.json` |
| 6 | Áreas: "sucesso garantido" e outros exageros saíram; entrou um parágrafo sobre IA em Diferenciais; cards novos "Fundamentos" e "IA" | `content/learn-tech/areas.json` |
| 7 | O gradiente de cada área ficou no código (é visual do site) | `learn-tech/src/pages/home/category/CategoriesAll.jsx` (`GRADIENTES`) |
| 8 | BQ: endereço da BQ Spazio tirado da página removida (não conferido por fora); créditos genéricos, sem nomes de terceiros; nome alternativo "BQ Café e Tecnologia" | `content/bootcamps/eventos/bq-agenda-tech.json` |
| 9 | ByteClass: "27" virou "25 tecnologias" (tirei Glassmorphism e UI/UX); trilhas e níveis apresentados como "grade planejada" | `content/bootcamps/eventos/byteclass-dev.json` |
| 10 | BQ e ByteClass com `officialLink` vazio, porque as páginas saíram | os dois JSON acima |
| 11 | Vagas.com ("Brasil", General Jobs) e We Work Remotely ("Remoto", Global Jobs); a Gupy não entrou de novo (já está em empresas) | `content/career/vagas.json` |
| 12 | A cópia local leva URLs absolutas da API para imagens `/media`: sem a API, essas imagens não carregam, mas a lista funciona | `scripts/exportar-copias.mjs` (`API_PUBLICA`) |
| 13 | `programsData` e `categoriesData` do learn-tech **não** são gerados (importam imagens, vídeo e ícones do site) | próximo lote |
| 14 | O vídeo do programa 1 (de terceiro) não foi para a API | sua decisão |

## 5. Recomendações fora do escopo de hoje (texto do site)

Estes textos estão **errados** e ficaram no código, como você pediu:

1. **"Fala aê" (learn-tech):** mostra "enviado", mas não envia. A política manda pedir exclusão de dados (LGPD) por ele.
2. **"Sem cadastro"** (Hero, FAQ, detalhe do programa): contradiz o formulário de identificação obrigatório.
3. **Roadmap (Recursos):** anuncia "área de membros", e a política diz que ela não existe.
4. **Números que envelheceram:**
   - Recursos: "42 ferramentas · 9 hospedagens" (hoje são 60 e 11);
   - About: "13 experiências" (hoje são 22 eventos);
   - estatísticas sem fonte.
5. **Link "Veja Todos" do blog:** aponta para `/blogs`, que não existe.
6. **Leitura do bootcamps:** o `readme.md` ainda cita as páginas `eventos-vivos` e o `context.txt`, que saíram.

## 6. Comandos (Git Bash)

```bash
cd /c/douglasabnovato-github/mundo-learn-tech/learntech-content
npm run verificar
npm run copias:conferir

cd ../learn-tech && npm test && npm run build
cd ../bootcamps && npm run lint && npm run build

# commit e push em cada repositório (as branches ainda não têm upstream)
for p in learntech-content learn-tech bootcamps career tools; do
  cd /c/douglasabnovato-github/mundo-learn-tech/$p
  git add -A && git commit -m "conteúdo estático para a API, cópias geradas e limpeza" && git push -u origin feature/tasks-28-10-2026
done

# publicar a API com o conteúdo novo
cd /c/douglasabnovato-github/mundo-learn-tech/learntech-content && npm run deploy
```

Depois, integre cada repositório até a `main` pelo seu fluxo, como na rodada anterior. Os sites ficam com o conteúdo novo assim que a API for publicada.

## 7. Segunda rodada (28/10, noite): textos corrigidos e conteúdo removido reaproveitado

### Conteúdo removido: o que tinha valor

| Item removido | Análise | Destino |
|---|---|---|
| Convites do BQ (palestrante, apoiador, parceiro) | Tema único, sem equivalente na API | **Artigo novo** no blog: "Como organizar um evento de comunidade tech, do propósito ao pós-evento". Completado com o seu material de organização do CodeXperience 2024 e 2025 (roteiro da abertura, deck, proposta de apoio, sem valores nem nomes) e com fontes públicas (OWASP, GDG, Conference Code of Conduct, W3C WAI, LGPD). Ligado também na página do CodeXperience no bootcamps |
| 6 depoimentos (`testimonialData`) | Inventados, sem origem | Não voltam: recriá-los seria inventar pessoas |
| Vagas da BRQ (LinkedIn) | Expiradas e sem data | A página de detalhe da BRQ já leva ao portal de vagas |
| Telas de login e cadastro, player MP4, `under-construction` | Código sem rota, não é conteúdo | Não voltam |
| Páginas de BQ e ByteClass, imagens antigas | O conteúdo bom já está nos eventos da API; o resto era rascunho ou imagem que a API já tem | — |

### Textos corrigidos

| Onde | Antes | Agora |
|---|---|---|
| Hero (learn-tech) | "Acesso livre, sem cadastro." | "Acesso livre e gratuito, sem conta e sem senha." |
| Detalhe do programa | "Sem cadastro e sem login: é só acessar" | "Sem conta e sem senha: na primeira visita pedimos só nome e e-mail" |
| FAQ, itens 2 e 3 (API e cópia local) | Prometiam área de membros e acesso "sem cadastro" | Sem área de membros; explicam o pedido de nome e e-mail e a exclusão pelo Fala aê |
| Termos (API e cópia local) | Seção "Conteúdo para Membros" | Seção "3. Acesso e identificação"; atualização em 28/10/2026 |
| Recursos | Roadmap com "Área de membros"; "42 ferramentas · 9 hospedagens" | Item removido; contagem lida da API (`/v1/index.json`) |
| Sobre | "13 experiências catalogadas" | Contagem lida da API |
| Home, "Top Artigos" | 18 cartões; "Veja Todos" levava a uma página inexistente | 6 cartões na home; nova página `/blogs` com todos os artigos |
| Readme do bootcamps | Citava `eventos-vivos`, `context.txt` e 17 eventos | Atualizado, com o aviso de que a cópia é gerada |

### "Fala aê" com destino real

O formulário só simulava o envio, e a política de privacidade o indica como canal para pedidos da LGPD. A API ganhou o recurso **mensagens**, no mesmo padrão dos acessos:

- **Rotas:**
  - `POST /v1/mensagens`, com origem permitida, validação, Turnstile opcional, limite de tamanho e bloqueio de mensagem duplicada em 10 minutos;
  - `GET` e `DELETE /v1/mensagens`, para a administração;
  - `DELETE /v1/acessos?email=`, que agora apaga também as mensagens do e-mail.
- **Retenção:** 365 dias, pelo mesmo cron diário.
- **Banco:** migração `0002_mensagens.sql`.
- **Site:** o formulário mostra "enviando", "enviado" e "erro, tentar de novo". Sem API configurada, avisa que o envio está indisponível, e não finge mais que enviou.
- **Motivos:** saiu "área de membros"; entrou "Quero exercer meus direitos de dados (LGPD)".

**Antes do deploy,** rode `npm run db:migrar:remoto`. Sem ele, a tabela não existe e o envio falha.

**Pendência:** se você ativar o Turnstile, o formulário precisa receber o widget. Até lá, ele seria recusado. Está documentado em `docs/DEPLOY.md`.

### Verificação

- Typecheck da API: ok.
- Conteúdo validado com os schemas reais: 0 erros.
- Cópias em dia.
- Lint do formulário, do serviço de mensagens e da página `/blogs`: ok.
- Os testes novos (`tests/mensagens.test.ts`) foram escritos, mas não rodados aqui: rode `npm run verificar`.
