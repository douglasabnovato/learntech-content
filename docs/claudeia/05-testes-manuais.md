# 05 · Testes manuais — learntech-content

Marque `[x]` ao concluir. Use uma janela anônima para começar sem identificação guardada. Onde aparece `API`, use a URL publicada da API (não está no repositório — **confirmar**) ou `http://localhost:8787` com `npm run dev`.

Sites publicados (README.md): learn-tech `https://learn-tech-pied.vercel.app/`, bootcamps `https://bootcamps-dun.vercel.app/`, career `https://douglasabnovato.github.io/career/`, tools `https://douglasabnovato.github.io/tools/`.

## T1 — Formulário de identificação (regra de negócio: medir volume e perfil de uso)

Repita em cada um dos 4 sites.

| # | Ação | Esperado | OK |
|---|---|---|---|
| T1.1 | Abrir o site em janela anônima | Aparece "Boas-vindas ao LearnTECH" com nome, e-mail e "Continuar"; a página por trás não rola | [ ] |
| T1.2 | Clicar fora do formulário e apertar Esc | Formulário continua aberto (modo obrigatório é o padrão) | [ ] |
| T1.3 | Digitar só "Maria" e "Continuar" | Mensagem "Informe nome e sobrenome." | [ ] |
| T1.4 | Nome completo e e-mail `maria@` | Mensagem "Informe um e-mail válido." | [ ] |
| T1.5 | Navegar com Tab e Shift+Tab | Foco circula só dentro do formulário (nome, e-mail, botão, link) | [ ] |
| T1.6 | Passar o mouse/abrir "Política de privacidade" | Abre em nova aba a política (padrão `https://learn-tech-pied.vercel.app/privacy`) — confirma a mudança L1.1 | [ ] |
| T1.7 | Preencher nome completo e e-mail válidos e "Continuar" | Formulário fecha, página volta a rolar; na aba Rede, `POST API/v1/acessos` com 201 | [ ] |
| T1.8 | Recarregar e navegar para outra página | Formulário não reaparece; nenhum novo POST na mesma sessão | [ ] |
| T1.9 | Depois de identificado, abrir uma aba nova e digitar o endereço do site (não usar "abrir link em nova aba", que copia a sessão) | Sem formulário; um POST novo (cada aba é uma sessão) que responde 200 `registrado: false` se for em menos de 30 min | [ ] |
| T1.10 | No console: `LearnTECH.trocarIdentificacao()` | Formulário reabre com os dados preenchidos | [ ] |
| T1.11 | No console: `LearnTECH.esquecer()` e recarregar | Formulário volta a aparecer | [ ] |
| T1.12 | Tema escuro do sistema ligado | Formulário com fundo escuro e texto legível | [ ] |
| T1.13 | Celular (ou largura 360 px) | Formulário cabe na tela, sem rolagem horizontal | [ ] |

## T2 — Leitura de conteúdo (API)

| # | Ação | Esperado | OK |
|---|---|---|---|
| T2.1 | Abrir `API/v1/saude` | JSON `status: "ok"`, versão `1.0.0` e horário | [ ] |
| T2.2 | Abrir `API/v1/index.json` | Lista de recursos com contagem de itens | [ ] |
| T2.3 | Abrir `API/v1/learn-tech/programas.json` | 34 programas, sem `moduleContents`/`quiz`, com `modulesCount` e `hasQuiz` | [ ] |
| T2.4 | Abrir `API/v1/learn-tech/programas/901.json` | 4 módulos e pelo menos 8 questões | [ ] |
| T2.5 | Abrir `API/v1/learn-tech/paginas/privacidade.json` | Texto da política | [ ] |
| T2.6 | Abrir `API/v1/bootcamps/eventos.json` | 21 eventos | [ ] |
| T2.7 | Abrir uma capa, ex. `API/media/bootcamps/instituicoes/dio.webp` | Imagem carrega | [ ] |
| T2.8 | Abrir `API/media/arquivos/minas-summit-2025-certificado.pdf` | PDF abre | [ ] |
| T2.9 | Abrir `API/v1/career/empresas.json` e `API/v1/tools/ferramentas.json` | 21 empresas; 56 ferramentas | [ ] |
| T2.10 | Abrir `API/v1/openapi.json` | Documento OpenAPI 3.1 | [ ] |
| T2.11 | Ver cabeçalhos de um `/v1/*.json` (F12 → Rede) | `Access-Control-Allow-Origin: *` e `Cache-Control: public, max-age=300, ...` | [ ] |
| T2.12 | Abrir `API/v1/nao-existe.json` | 404 | [ ] |

## T3 — Sites consumidores e fallback

| # | Ação | Esperado | OK |
|---|---|---|---|
| T3.1 | learn-tech: abrir `/programs` | Catálogo de programas carrega; na Rede, GET para `API/v1/learn-tech/programas.json` | [ ] |
| T3.2 | learn-tech: abrir um programa com módulos (ex. 901) e responder o quiz | Módulos e quiz funcionam | [ ] |
| T3.3 | learn-tech: bloquear o domínio da API nas DevTools (Request blocking) e recarregar | Site continua mostrando programas (dados locais) em até ~5 s | [ ] |
| T3.4 | bootcamps: abrir a lista e um evento com galeria (ex. codexperience) | Capas e fotos de `/media` carregam | [ ] |
| T3.5 | career: carrossel de destaques | Mostra os destaques de `career/destaques.json` | [ ] |
| T3.6 | tools: lista de ferramentas e hospedagens | Miniaturas `./assets` aparecem | [ ] |

## T4 — Administração e privacidade (precisa do `ADMIN_TOKEN`; use local se possível)

| # | Ação | Esperado | OK |
|---|---|---|---|
| T4.1 | `curl API/v1/acessos` sem token | 401 | [ ] |
| T4.2 | `curl -H "Authorization: Bearer $TOKEN" API/v1/acessos/resumo` | Totais, por projeto e por dia | [ ] |
| T4.3 | `...API/v1/acessos?formato=csv` | CSV com cabeçalho `id,nome,email,projeto,pagina,criado_em` | [ ] |
| T4.4 | `curl -X POST API/v1/acessos -H "Origin: https://site-estranho.com" ...` | 403 | [ ] |
| T4.5 | Local: `curl -X DELETE -H "Authorization: Bearer $TOKEN" "http://localhost:8787/v1/acessos?email=teste@exemplo.com"` | `{"apagados": n}` | [ ] |
| T4.6 | Painel Cloudflare → Workers → learntech-content → Cron | Execução diária às 03:00 UTC com log "retenção: n registro(s) removido(s)" | [ ] |

## T5 — Fluxo de conteúdo (editor)

| # | Ação | Esperado | OK |
|---|---|---|---|
| T5.1 | Em cópia local, mudar `lessonsCount` de um módulo do 901 e rodar `npm run validar` | Erro "lessonsCount ... ≠ ... passos"; desfazer a mudança | [ ] |
| T5.2 | Referenciar `/media/nao-existe.webp` num evento e rodar `npm run validar` | Erro "mídia ausente"; desfazer | [ ] |
