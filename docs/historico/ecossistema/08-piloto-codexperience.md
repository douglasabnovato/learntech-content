# Piloto: CodeXperience 2023, do hd aos sites

Executado em 27/10/2026, seguindo `05-metodo.md`. Este documento registra o que foi feito, as decisões tomadas e como ajustá-las.

## 1. Resultado

| Etapa do funil | O que foi feito | Arquivo |
|---|---|---|
| Fonte | 621 fotos do `hd`, filtradas por foco e duplicidade até 178 candidatas, revistas em folhas de contato | `hd/eventos/codexperience-21-22-10-2023/` (não muda) |
| Seleção | 10 fotos com muita gente, cobrindo o dia inteiro | Tabela da seção 2 |
| Tratamento | WebP de até 1600 px, sem EXIF, 46 a 108 KB cada (cerca de 800 KB no total) | `scripts/tratar-fotos.py`; `media/bootcamps/eventos/codexperience-2023/7.webp` a `16.webp` |
| API, evento | Galeria de 6 para 16 fotos (as 6 anteriores mantidas no fim), parágrafo sobre o que as fotos registram, vídeo provisório e link para o artigo | `content/bootcamps/eventos/codexperience.json` |
| API, artigo | Artigo "O que um evento de comunidade tech ensina que nenhum curso ensina", com duas das mesmas fotos e link para a cobertura | `content/learn-tech/paginas/blog.json` (primeiro item, id `eventos-de-comunidade-tech`) |
| Catálogo | A fonte EV-001 aponta para o evento no bootcamps e para o blog do learn-tech | `content/cobertura.json` |

**Uma mídia, dois sites.** O artigo usa `/media/bootcamps/eventos/codexperience-2023/7.webp` e `14.webp`, os mesmos arquivos da galeria. A foto existe uma vez na API e aparece nos dois sites.

**Links cruzados:**
- o evento no bootcamps tem o link "Artigo no LearnTECH";
- o artigo no learn-tech cita "Cobertura do CodeXperience no Bootcamps" nas fontes.

## 2. Fotos escolhidas

Critérios, na ordem:
1. Muita gente.
2. Momentos diferentes do dia.
3. Nitidez.
4. Nenhuma pessoa isolada em destaque, porque a regra do Douglas é de foto real de evento.

| Publicada | Original | Momento | Por que |
|---|---|---|---|
| 7.webp | IMG_5302 | Almoço | Foto oficial: participantes, palestrantes e equipe à frente do auditório. Capa do artigo |
| 8.webp | IMG_5094 | Manhã | Plano aberto do auditório lotado |
| 9.webp | IMG_5060 | Manhã | Plateia de perto, com expressão de atenção |
| 10.webp | IMG_5120 | Manhã | Palestrante e auditório cheio no mesmo quadro |
| 11.webp | IMG_5098 | Manhã | Pergunta da plateia ao palestrante |
| 12.webp | IMG_5181 | Fim da manhã | Coffee break com o hall cheio |
| 13.webp | IMG_5266 | Fim da manhã | Equipe no palco com a identidade do evento no telão |
| 14.webp | IMG_5341 | Início da tarde | Workshop no laboratório. Ilustração do artigo |
| 15.webp | IMG_5517 | Meio da tarde | Grupo reunido e sorrindo no hall |
| 16.webp | IMG_5571 | Fim da tarde | Roda de conversa em open space |

**Volume.** Dez fotos novas mais as seis que já existiam somam 16, o suficiente para contar o dia sem repetição. Outras boas candidatas, caso queira trocar ou ampliar:
- auditório: IMG_5064, IMG_5100, IMG_5260, IMG_5289;
- palco: IMG_5195;
- workshop: IMG_5326, IMG_5335;
- hall: IMG_5183;
- equipe: IMG_5068;
- roda de conversa: IMG_5545.

## 3. Vídeo

| Situação | Valor em `content.videoUrl` |
|---|---|
| Agora (provisório) | `https://www.youtube.com/embed/WW8qL1QAhOE`, vídeo público da Alura Latam (em espanhol) sobre a importância de participar de eventos de tecnologia |
| Definitivo | O vídeo do Douglas |

Para trocar pelo vídeo definitivo:

1. Suba no seu YouTube, como público ou não listado, o arquivo `C:\douglasabnovato-github\mundo-learn-tech\hd\eventos\codexperience-21-22-10-2023\MVI_5108.MP4`. São 17 segundos em 1080p, gravados na abertura de 21/10/2023.
   - Título sugerido: "CodeXperience Zona da Mata 2023: abertura".
2. Copie o id do vídeo: em `https://youtu.be/ABC123`, o id é `ABC123`.
3. Em `content/bootcamps/eventos/codexperience.json`, troque `videoUrl` por `https://www.youtube.com/embed/ABC123`. O bootcamps usa o formato `/embed/`.

## 4. Como ver funcionando

Os sites leem a API só quando `VITE_API_URL` está configurado. Sem ele, mostram os dados locais do próprio código (ADR 5). A `06-conferencia.md` registra que a URL de produção da API ainda não está anotada em lugar nenhum.

**Na sua máquina**, com três terminais:

```powershell
# Terminal 1: API
cd C:\douglasabnovato-github\mundo-learn-tech\learntech-content
npm run verificar     # typecheck + testes + build (valida schema, integridade e mídia)
npm run dev           # sobe a API em http://localhost:8787

# Terminal 2: bootcamps
cd C:\douglasabnovato-github\mundo-learn-tech\bootcamps
$env:VITE_API_URL="http://localhost:8787"; npm run dev
# abra /event/codexperience: galeria com 16 fotos, vídeo e link "Artigo no LearnTECH"

# Terminal 3: learn-tech
cd C:\douglasabnovato-github\mundo-learn-tech\learn-tech
$env:VITE_API_URL="http://localhost:8787"; npm run dev
# abra a home (seção "Top Artigos") e /blog/eventos-de-comunidade-tech
```

**Em produção:**
1. `npm run deploy` no learntech-content.
2. Anote a URL `workers.dev`.
3. Configure `VITE_API_URL` na Vercel do learn-tech e do bootcamps.
4. Faça um novo deploy dos dois sites.

O passo a passo completo está em `docs/DEPLOY.md`.

## 5. Como ajustar

| Quero… | Faça |
|---|---|
| Trocar uma foto | `python scripts/tratar-fotos.py ../hd/eventos/codexperience-21-22-10-2023 media/bootcamps/eventos/codexperience-2023 IMG_5064:9`. Isso sobrescreve o `9.webp`; ajuste o `alt` no JSON se a cena mudar |
| Acrescentar uma foto | Gere o próximo número (`IMG_xxxx:17`) e acrescente um item em `content.gallery` |
| Mudar a ordem da galeria | Reordene `content.gallery` no `codexperience.json` |
| Tirar uma foto do ar | Remova o item da galeria. O arquivo pode ficar em `media/` ou ser apagado, desde que nada mais o cite (o build acusa referência quebrada) |
| Mudar a capa do artigo | Troque `img` ou `illustrationImg` do item `eventos-de-comunidade-tech` em `blog.json` |
| Editar o texto | Campos `lead`, `body`, `highlights`, `quote`, `bodyContinued` e `sources` do artigo |

## 6. Repetir o processo em outro evento

1. Inventário e pré-seleção: método do apêndice de `01-inventario-eventos.md`.
2. Folhas de contato e escolha, com os critérios da seção 2.
3. `scripts/tratar-fotos.py` para `media/bootcamps/eventos/<slug>[-ano]/`.
4. Galeria, texto, vídeo e links no JSON do evento.
5. Artigo ou módulo no learn-tech reaproveitando a mídia, com link cruzado.
6. Item no `cobertura.json` com todos os destinos.
7. `npm run verificar`, conferência local e commit em `feature/conteudo-AAAA-MM-DD`.

## 7. Limites conhecidos

- **Dados locais.** O bootcamps e o learn-tech sem `VITE_API_URL` mostram os dados locais, que não têm as fotos novas nem o artigo. É a divergência D12 de `02-contratos.md`.
- **Fontes do artigo.** O link do bootcamps aponta para `https://bootcamps-dun.vercel.app/event/codexperience`, o domínio encontrado no código. Se o domínio mudar, ajuste em `blog.json`.
- **Competências.** O vínculo com competências (`03-modelo-canonico.md`) ainda não existe no código. O piloto usa o `cobertura.json`, que já é validado pelo build.
- **Arquivos deste piloto que você precisa apagar.** A pasta `.tmp-amostra/` tem as folhas de contato e miniaturas. Está no `.gitignore`, mas apague-a.
