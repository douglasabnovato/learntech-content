# Segurança e privacidade

## Dados pessoais (LGPD)
- **Não publicar** nome, contato, documento, foto ou dado de terceiros identificáveis, exceto informação profissional pública de perfis indicados no career e fotos de cobertura de evento.
- **Material de ex-empregador ou de cliente** (marca, clientes, campanhas, leads, relatórios): por padrão é `nao-publicavel` ou `sensivel-anonimizar`. O que pode virar conteúdo é o **conhecimento** (método, processo, ferramenta), escrito com dados fictícios e sem marca, nomes, números internos ou peças.
- **Planilhas de leads, contatos, CPFs, e-mails ou dados de clientes** nunca saem da pasta do autor. A triagem só registra que existem.
- **Currículos:** os contatos são falsos, e o schema obriga.

## Acervo
- `content/acervo.json` é público. Guarda **só** hash, tipo, tamanho, uma descrição sem nomes e a decisão editorial.
- Nomes de arquivos e caminhos ficam em `hd/.acervo-local.json`, fora do git, e somem com o hd.

## Imagens e mídia
- Usar só imagens com direito de uso: próprias, com licença livre (Pixabay, Unsplash) ou oficiais da marca no tools e no career.
- Sempre servir a imagem pela API (`/media`), nunca por link direto para site de terceiro (`npm run midia:externa`).
- Fotos de pessoas só em eventos. Remover EXIF e GPS (`scripts/tratar-fotos.py`).

## Código e segredos
- Nenhum segredo em arquivo. Os segredos da Cloudflare ficam só em GitHub Secrets ou no `wrangler login` do autor. Claude não lê `.env` nem tokens.
- Dados da API nunca viram HTML nos sites: usar `textContent`, links só com http ou https e embeds só do YouTube no formato `/embed/ID`.
- A API de acessos e mensagens tem retenção e exclusão por e-mail (ver `docs/PRIVACIDADE.md`).
