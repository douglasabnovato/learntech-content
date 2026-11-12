# Revisão editorial e técnica do catálogo tools (conteúdo anterior a 28/10/2026)

Somente leitura. Fonte da verdade: `learntech-content/content/tools/ferramentas.json` e `hospedagens.json`. Comparado com `tools/data/tools.js`, `tools/data/host.js` e `tools/assets/`.
Fora do escopo: Microsoft Excel, Google Planilhas, GLPI, CryptoJS (novos) e o conteúdo de detalhe de Figma, GitHub e Salesforce Marketing Cloud.

Limitação: a VM e o contêiner não tinham rede para `curl`; nenhum `site_url` foi testado por HTTP. Status de preço/produto foi conferido por busca na web só nos itens suspeitos (fontes no fim). Itens marcados "não verificado" precisam de um clique manual.

## 1. Resumo (números)

| Medida | Valor |
|---|---|
| Ferramentas no JSON | 60 (56 no escopo) |
| Hospedagens no JSON | 11 |
| Ferramentas em `data/tools.js` | 45 (todas existem no JSON) |
| Hospedagens em `data/host.js` | 10 (todas existem no JSON) |
| Só na API (ferramentas) | 15: Git, VS Code, Vite, Vitest, Tailwind CSS, VisuAlg, Prisma, Logisim Evolution, StarUML, Power BI, Salesforce Marketing Cloud, Microsoft Excel, Google Planilhas, GLPI, CryptoJS |
| Só na API (hospedagens) | 1: Cloudflare Workers |
| Só no local | 0 |
| Campos divergentes entre os dois lados | 1 (descrição do GitHub, alterada em 28/10) |
| Categorias de ferramentas | 12 (Código 9, Design 8, Comunidade 7, Imagens 5, Versionamento 4, Produtividade 4, Ícones 4, Marca e Site 4, Back-end 3, Dados 3, Cores 3, Performance 2 — contagem dos 56) |
| Categorias de hospedagens | 3 (Site Estático 6, Aplicação 4, Tempo Real 1) |
| Miniaturas locais | 42 em `thumb_tools` + 9 em `thumb_host`, todas existem; capturas de tela de ~1650x920 px (8,5 MB + 1,4 MB) |
| Miniaturas acima de 300 KB | 6: pinterest 490 KB, unsplash 368, behance 364, freepik 332, dribbble 332, nicepage 310 |
| Miniaturas via `google.com/s2/favicons` | 15 ferramentas + 2 hospedagens (dependência externa, 128 a 256 px) |
| Órfãos em assets | `logos/logo-tools-1.png` (1,5 MB) e `thumbs/tool-1.jpg` (433 KB) |
| Itens com pricing/descrição desatualizados (confirmado) | 4: Railway, Heroku, Hashnode, Postman |
| Itens a remover ou repensar (decisão) | 5: Imagens Gratuitas, Mockingbird, Fronteditor, Pusher, Heroku |
| `site_url` estranhos | 4: CodePen, CodeSandbox, GitLab Pages, brModelo Web (mais 2 domínios antigos: Railway, Tailor Brands) |
| Itens avaliados (56 + 11) | ok 30 · revisar 32 · remover? 5 (de 67) |

## 2. Tabela de achados

| # | Onde | Problema | Gravidade | Ação | Decisão do Douglas? |
|---|---|---|---|---|---|
| 1 | hospedagens.json · Railway | `pricing: "Pago"` e descrição "hoje sem plano gratuito permanente" estão errados: a documentação oficial lista plano Free (US$ 0, US$ 1 de crédito/mês), Trial de US$ 5 e Hobby de US$ 5/mês. `site_url` usa o domínio antigo `railway.app` (a documentação usa `railway.com`) | Alta | Trocar para Freemium, reescrever descrição, trocar URL para `https://railway.com/` | Não |
| 2 | hospedagens.json · Heroku | Descrição correta sobre 2022, mas omite que em fev/2026 a Salesforce colocou o Heroku em "sustaining engineering" (sem novos recursos, contratos Enterprise fechados para clientes novos). Para iniciante é uma recomendação ruim | Alta | Atualizar descrição ou remover do catálogo | Sim (manter como referência histórica ou remover) |
| 3 | ferramentas.json · Hashnode | `pricing: "Gratuito"` e "com domínio próprio" ficaram errados: em jun/2026 o Hashnode Pro passou a cobrar domínio próprio para blogs novos, API e backup no GitHub | Média | Freemium; reescrever descrição sem "domínio próprio" e sem "publicação a partir do Git" | Não |
| 4 | ferramentas.json · Postman | Freemium continua certo, mas desde mar/2026 o plano Free é limitado a 1 usuário e não cria equipe. A descrição não avisa, e o catálogo não tem alternativa (Insomnia, Bruno, Hoppscotch) | Média | Acrescentar "plano gratuito individual"; avaliar incluir alternativa | Sim (incluir alternativa) |
| 5 | ferramentas.json · CodePen e CodeSandbox | `site_url` aponta para página interna: `codepen.io/your-work` (exige login) e `codesandbox.io/s/vanilla-vanilla` (um sandbox específico) | Média | Trocar por `https://codepen.io/` e `https://codesandbox.io/` | Não |
| 6 | hospedagens.json · GitLab Pages e ferramentas.json · brModelo Web | GitLab Pages aponta para `about.gitlab.com` (a mesma URL do item GitLab, sem nada sobre Pages). brModelo aponta para a documentação, não para o app | Média | GitLab Pages: `https://docs.gitlab.com/user/project/pages/`; brModelo: conferir e apontar para o app (`app.brmodeloweb.com`, não verificado) | Não |
| 7 | ferramentas.json · Imagens Gratuitas | Não é ferramenta: é um post de blog da Rocketseat (link externo de terceiro, pode cair). Redundante com Unsplash/Freepik/illlustrations | Média | Remover ou substituir por uma ferramenta real (ex.: Pexels) | Sim |
| 8 | hospedagens.json · Pusher | Não é hospedagem (é serviço de WebSocket); cria a categoria "Tempo Real" com 1 item | Média | Mover para ferramentas (Back-end) ou remover | Sim |
| 9 | Categorias de ferramentas | Itens mal classificados: Google Fonts em "Ícones"; Logisim Evolution (circuitos) e StarUML/brModelo/Diagrams (modelagem) em "Design"; Behance/Dribbble/Pinterest em "Comunidade" (são referência visual); "Código" mistura editores online, VS Code, Vite, Vitest e Tailwind; "Performance" só tem 2 | Média | Proposta: Design (Figma, Balsamiq, Whimsical, Mockingbird) · Modelagem e Diagramas (Diagrams, brModelo, StarUML, Logisim) · Editores online (CodePen, CodeSandbox, StackBlitz, Fronteditor) · Desenvolvimento (VS Code, Vite, Vitest, Tailwind, Prisma, VisuAlg) · Inspiração (Behance, Dribbble, Pinterest) · "Ícones e Fontes" ou "Tipografia" | Sim (lista final de categorias) |
| 10 | data/tools.js e data/host.js | Fallback local tem 45/10 itens contra 60/11 na API e a descrição antiga do GitHub. Se a API demorar mais de 2,5 s, o visitante vê o catálogo antigo (sem VS Code, Git, Vite, Power BI etc.). Readme ainda diz "45 ferramentas · 10 hospedagens" | Média | Regenerar os .js a partir do JSON (ou gerar no build) e atualizar o Readme | Não (só decidir se o fallback deve ser gerado automaticamente) |
| 11 | ferramentas.json · Mockingbird | Produto sem sinal de atualização recente (não verificado), `site_url` em `/home`, duplica Balsamiq e Whimsical | Baixa | Remover ou verificar manualmente | Sim |
| 12 | ferramentas.json · Fronteditor | Editor pouco conhecido (projeto pessoal, não verificado se está no ar), duplica CodePen | Baixa | Verificar; remover se fora do ar | Sim |
| 13 | Miniaturas favicon | VisuAlg usa o favicon do SourceForge e Logisim o do GitHub: o card mostra a marca do host, não da ferramenta. 17 itens dependem de `google.com/s2/favicons` (serviço externo não documentado) | Baixa | Produzir miniatura própria (webp em `/media/tools/`) para esses itens | Não |
| 14 | Miniaturas locais | 6 arquivos acima de 300 KB; todas são capturas de tela de 1650 px para um espaço de 320x200 (o relatório 01 já apontava). Capturas de sites de terceiros envelhecem (layout e logo antigos) | Baixa | Redimensionar para ~640 px webp; rever capturas antigas | Não |
| 15 | ferramentas.json · Data Studio | Nome voltou a ser "Data Studio" em abr/2026 (era Looker Studio desde 2022), então o título está certo. Falta conferir se `datastudio.google.com` é a URL atual. Há plano Pro pago | Baixa | Conferir URL; pricing pode virar Freemium | Não |
| 16 | Diagrams | Título pouco reconhecível; o nome usado é draw.io | Baixa | Título "draw.io (diagrams.net)" | Não |
| 17 | Hospedagens · Firebase Hosting | Categoria "Aplicação", mas a descrição fala em hospedagem estática | Baixa | Mover para Site Estático ou citar App Hosting na descrição | Não |
| 18 | Hospedagens · Vercel e Netlify | Descrições não citam limites relevantes: Vercel Hobby é só para uso pessoal não comercial; Netlify usa plano de créditos (taxas revistas em abr/2026) | Baixa | Acrescentar meia frase de limite | Não |
| 19 | Tailor Brands | `site_url` em subdomínio `studio.` (página de app) | Baixa | `https://www.tailorbrands.com/` | Não |
| 20 | Slack | "histórico pesquisável": o plano gratuito só mostra 90 dias | Baixa | Ajustar descrição | Não |
| 21 | Pricing Gratuito com plano pago | Unsplash (Unsplash+), Behance (Pro), Photopea (Premium sem anúncio) | Baixa | Freemium ou manter "Gratuito" pelo uso principal | Sim (critério de pricing) |
| 22 | assets | Órfãos `logos/logo-tools-1.png` (1,5 MB) e `thumbs/tool-1.jpg` (433 KB) | Baixa | Apagar | Não |

## 3. Tabela por item

### Ferramentas (56 no escopo; Figma, GitHub e Salesforce Marketing Cloud avaliados só nos campos de lista)

| title | categoria | estado | motivo curto |
|---|---|---|---|
| Figma | Design | ok | fora do escopo (detalhe novo) |
| Balsamiq | Design | ok | Pago com teste; `balsamiq.cloud` é o app, `balsamiq.com` seria mais neutro |
| Mockingbird | Design | remover? | sem sinal de atividade, duplica Balsamiq/Whimsical |
| Whimsical | Design | ok | |
| Diagrams | Design | revisar | título "draw.io (diagrams.net)"; categoria Modelagem |
| brModelo Web | Design | revisar | URL da documentação, não do app; categoria Modelagem |
| CodePen | Código | revisar | URL `/your-work` exige login |
| CodeSandbox | Código | revisar | URL de um sandbox específico |
| StackBlitz | Código | ok | |
| Fronteditor | Código | remover? | não verificado, duplica CodePen |
| GitHub | Versionamento | ok | fora do escopo (detalhe novo); fallback local com descrição antiga |
| GitLab | Versionamento | ok | |
| Bitbucket | Versionamento | ok | |
| Postman | Back-end | revisar | plano Free virou individual (mar/2026) |
| Mailtrap | Back-end | ok | |
| PageSpeed Insights | Performance | ok | categoria com 2 itens |
| Squoosh | Performance | ok | |
| Data Studio | Dados | revisar | nome certo de novo (abr/2026); conferir URL e pricing |
| Notion | Produtividade | ok | |
| Trello | Produtividade | ok | candidata a detalhe (programa 602) |
| Dontpad | Produtividade | ok | |
| Pomofocus | Produtividade | ok | |
| Stack Overflow | Comunidade | ok | |
| Discord | Comunidade | ok | |
| Slack | Comunidade | revisar | plano gratuito com histórico de 90 dias |
| Hashnode | Comunidade | revisar | Freemium; domínio próprio virou pago |
| Behance | Comunidade | revisar | categoria Inspiração; thumb 364 KB |
| Dribbble | Comunidade | revisar | categoria Inspiração; thumb 332 KB |
| Pinterest | Comunidade | revisar | categoria Inspiração; thumb 490 KB |
| Unsplash | Imagens | revisar | thumb 368 KB; existe Unsplash+ |
| illlustrations | Imagens | ok | não verificado se segue no ar |
| Freepik | Imagens | revisar | thumb 332 KB |
| Photopea | Imagens | ok | gratuito com anúncio |
| Imagens Gratuitas | Imagens | remover? | é post de blog, não ferramenta |
| Phosphor Icons | Ícones | ok | |
| Flaticon | Ícones | ok | |
| Icons8 | Ícones | ok | |
| Google Fonts | Ícones | revisar | não é ícone: categoria "Ícones e Fontes" ou Tipografia |
| HTML Color Codes | Cores | ok | sobreposição com Converting Colors |
| uiGradients | Cores | ok | projeto parado há anos, mas funciona (não verificado) |
| Converting Colors | Cores | ok | sobreposição com HTML Color Codes |
| Canva | Marca e Site | ok | |
| Tailor Brands | Marca e Site | revisar | URL em subdomínio `studio.` |
| Nicepage | Marca e Site | revisar | thumb 310 KB |
| WordPress | Marca e Site | ok | aponta para wordpress.com (serviço), não wordpress.org (software livre); aceitável |
| Git | Versionamento | revisar | só na API; candidato a detalhe (604) |
| VS Code | Código | revisar | só na API; categoria Desenvolvimento |
| Vite | Código | revisar | só na API; categoria Desenvolvimento |
| Vitest | Código | revisar | só na API; categoria Desenvolvimento |
| Tailwind CSS | Código | revisar | só na API; categoria Desenvolvimento |
| VisuAlg | Código | revisar | só na API; miniatura é o favicon do SourceForge |
| Prisma | Back-end | revisar | só na API |
| Logisim Evolution | Design | revisar | só na API; não é design; miniatura é o favicon do GitHub |
| StarUML | Design | revisar | só na API; categoria Modelagem |
| Power BI | Dados | revisar | só na API |
| Salesforce Marketing Cloud | Dados | ok | fora do escopo (detalhe novo); categoria Dados discutível (Marketing/CRM) |

### Hospedagens (11)

| title | categoria | estado | motivo curto |
|---|---|---|---|
| Vercel | Site Estático | revisar | citar Hobby só para uso pessoal não comercial |
| Netlify | Site Estático | revisar | plano por créditos; citar limite |
| Cloudflare Pages | Site Estático | ok | miniatura favicon |
| GitHub Pages | Site Estático | ok | |
| GitLab Pages | Site Estático | revisar | URL genérica igual à do GitLab |
| Surge | Site Estático | ok | segue ativo (fontes de 2026) |
| Firebase Hosting | Aplicação | revisar | descrição diz estática, categoria diz aplicação |
| Railway | Aplicação | revisar | tem plano Free; URL `railway.app` antiga |
| Heroku | Aplicação | remover? | sustaining engineering desde fev/2026 |
| Pusher | Tempo Real | remover? | não é hospedagem; categoria de 1 item |
| Cloudflare Workers | Aplicação | revisar | só na API (falta no host.js) |

## 4. Lacunas sugeridas

Já existem: VS Code, Postman, Notion, Trello, Git, Power BI. Faltam, por ordem de utilidade para quem começa e de ligação com programas do learn-tech:

| Sugestão | Por quê |
|---|---|
| Docker (Docker Desktop) | Programa 303 (microsserviços) e 1 citam Docker; não há item |
| Assistente de IA (ChatGPT, Claude, GitHub Copilot) | Ausência mais visível de um catálogo de 2026; DOC-003 do mapa é conversa com IA como mentora |
| Alternativa ao Postman (Insomnia, Bruno ou Hoppscotch) | Postman Free ficou individual em mar/2026 |
| Expo | Programas 404, 503 e 602 citam; nenhum item mobile no catálogo |
| Jira | Programa 602 (Scrum e Kanban) cita junto com Trello |
| Node.js | Programas 302 e 404; base para Vite, Vitest e Prisma |
| MDN Web Docs | Referência gratuita básica para quem começa |
| Banco gerenciado gratuito (Supabase ou Neon) | Programas 402 e 404 citam PostgreSQL/MySQL; hospedagens não têm banco |
| Render (hospedagem) | Plano gratuito para web service; substituto natural do Heroku no catálogo |
| Miro | Mapa 11 (EV-007: Lean Canvas, Matriz CSD); quadro colaborativo |

## 5. Candidatas a página de detalhe

Já têm detalhe: Figma, GitHub, Salesforce Marketing Cloud, Microsoft Excel, Google Planilhas, GLPI, CryptoJS. O mapa 11 (seção 3.5) diz que o hd não tem outra candidata com material próprio; a prioridade abaixo vem das ligações com programas.

| Prioridade | Item | Ligação |
|---|---|---|
| 1 | Git | Programa 604 (Git e GitHub Workflow); complementa o detalhe do GitHub |
| 2 | Trello (e Jira, se entrar) | Programa 602; DOC-003 (rotina e gestão) |
| 3 | Vite | Programas 1, 404 e 602 |
| 4 | VisuAlg | Programa 901 (Lógica de Programação), público iniciante |
| 5 | Tailwind CSS | Programa 102 |
| 6 | Vercel / Netlify (hospedagens) | Programa 1 (landing page) cita os dois; o schema de hospedagem aceita detalhe; EV-003 (landing do CodeXperience) se houver material |
| 7 | Power BI | Liga com o futuro programa "Excel para indicadores" (DOC-050/052) e com o detalhe de Excel |
| 8 | Docker (se entrar) | Programa 303 |

## 6. Seguro corrigir sem decisão x precisa de decisão

### Seguro corrigir sem decisão
- Railway: pricing Freemium, descrição nova, URL `https://railway.com/`.
- Hashnode: pricing Freemium e descrição sem "domínio próprio".
- Postman: acrescentar que o plano gratuito é individual.
- URLs: CodePen, CodeSandbox, GitLab Pages, Tailor Brands (e brModelo, depois de conferir o endereço do app).
- Título "draw.io (diagrams.net)".
- Firebase Hosting: alinhar categoria e descrição.
- Vercel, Netlify, Slack: meia frase sobre limite do plano gratuito.
- Heroku: atualizar descrição com a situação de 2026 (se for mantido).
- Regenerar `data/tools.js` e `data/host.js` a partir do JSON e atualizar contagens do Readme.
- Redimensionar as 6 miniaturas acima de 300 KB; trocar miniaturas de VisuAlg e Logisim (favicon do host); apagar os 2 órfãos.

### Precisa de decisão
- Remover ou manter: Heroku, Pusher, Imagens Gratuitas, Mockingbird, Fronteditor.
- Lista final de categorias (Modelagem e Diagramas, Editores online, Desenvolvimento, Inspiração, Ícones e Fontes; juntar Performance a outra).
- Critério de pricing para serviços gratuitos com plano pago opcional (Unsplash, Behance, Photopea, Data Studio).
- Quais lacunas entram (Docker, IA, alternativa ao Postman, Expo, Jira, Node.js, banco gratuito, Render, Miro) e se o catálogo admite ferramentas pagas de IA.
- Ordem das próximas páginas de detalhe.
- Se o fallback local deve ser gerado no build para não divergir de novo.

## Fontes consultadas (busca na web em 28/10/2026)
- Railway, planos: https://docs.railway.com/pricing/plans
- Heroku em sustaining engineering: https://www.deployhq.com/blog/heroku-sustaining-engineering-alternatives e https://www.techradar.com/pro/salesforce-halts-development-of-new-features-for-heroku-cloud-ai-platform
- Postman, planos: https://learning.postman.com/docs/billing/about-plans
- Hashnode Pro: https://hashnode.com/changelog/2026-06-11-introducing-hashnode-pro
- Netlify, preços abr/2026: https://www.netlify.com/changelog/2026-04-14-pricing-updates-april-2026/
- Data Studio (rename de abr/2026): https://www.dataslayer.ai/blog/looker-studio-data-studio-rebrand-2026
- Vercel Hobby: https://vercel.com/docs/plans/hobby
- Mockingbird: https://www.trustradius.com/products/mockingbird (sem data de atualização)
