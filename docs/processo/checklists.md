# Checklists

## Pronto para produzir (por item do lote)
- [ ] Item registrado no `acervo.json`, com direitos e estado.
- [ ] Destino definido (`projeto/recurso/id`) e aprovado no plano do lote (A1).
- [ ] Dados pessoais e de clientes identificados, com a forma de anonimizar escolhida.
- [ ] Orçamento de buscas definido.

## Pronto para publicar (por item)
- [ ] Passa em `npm run validar`.
- [ ] Segue o modelo do tipo (`modelos.md`) e as regras do site (`regras-editoriais.md`).
- [ ] Todo número tem fonte aberta e data.
- [ ] Nenhum dado pessoal de terceiro, nenhum nome de cliente, nenhuma frase sobre o processo de pesquisa.
- [ ] Imagens com direito de uso, servidas por `/media`, com `alt`.
- [ ] Links com https.
- [ ] Relacionados de 1 a 5, com ligação real.

## Checklist do lote (antes da entrega)
- [ ] Revisão independente de uma amostra contra as fontes, cobrindo pelo menos 1 item de cada tipo.
- [ ] `npm run copias` rodado e `copias:conferir` em dia.
- [ ] Páginas novas abertas no navegador com os dados gerados.
- [ ] `acervo.json` atualizado com estado e destinos.
- [ ] Relatório do lote escrito em `lotes/AAAA-MM-DD.md`, com as pendências do autor.
- [ ] Comandos de teste e de deploy listados para o autor.
