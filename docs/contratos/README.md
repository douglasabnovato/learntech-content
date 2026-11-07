# Contratos dos projetos

Um contrato por site. Ele diz ao **produtor** daquele projeto o que gerar, em que padrão e onde gravar, e diz ao **verificador** como confirmar que o conteúdo apareceu na tela. O fluxo completo está em [`../processo/agentes.md`](../processo/agentes.md).

| Contrato | Recursos |
|---|---|
| [`learn-tech.md`](learn-tech.md) | programas, artigos do blog, áreas |
| [`bootcamps.md`](bootcamps.md) | eventos e formações |
| [`career.md`](career.md) | empresas, vagas, perfis, modelos de currículo |
| [`tools.md`](tools.md) | ferramentas, hospedagens |

## Hierarquia das fontes da verdade
1. **Schema Zod** em `src/schemas/`: os campos e os tipos. O contrato nunca contradiz o schema; se divergirem, vale o schema e o contrato é corrigido.
2. **Regras editoriais** em `../processo/regras-editoriais.md`: o que pode e o que não pode ser publicado. Só o autor cria regra nova.
3. **Modelos** em `../processo/modelos.md`: o padrão de qualidade de cada tipo.
4. **Este contrato:** junta os três para um projeto só e acrescenta exemplos, saída esperada e verificação.

## Regras comuns aos quatro produtores
- **Entrada:** só itens do `acervo.json` com estado `planejado` e destino no projeto (`<projeto>/<recurso>/<id>`). Nada é produzido sem o A1.
- **Texto:** em português, claro e didático, sem marketing, sem promessa e sem falar do processo de pesquisa.
- **Privacidade:** nenhum nome de pessoa que não seja figura pública, cliente, e-mail, telefone, CPF ou dado interno de empresa. Material de ex-empregador segue a seção 7 das regras.
- **Fontes:** todo número tem fonte aberta e data. Páginas de detalhe têm fontes de 2 domínios diferentes.
- **Mídia:** imagens tratadas (`scripts/tratar-fotos.py`, WebP sem EXIF) em `media/<projeto>/`, referenciadas por `/media/...` e sempre com `alt`. Imagens parecidas: uma só (`scripts/imagens-parecidas.py`).
- **Relacionados:** de 1 a 5 ligações `{ tipo, id }` com conteúdo dos outros projetos, quando houver ligação real. O build confere se o alvo existe.
- **Acervo:** ao terminar, o item vai para `produzido`, com uma etapa `{ estado: "produzido", em, por: "produtor-<projeto>" }`.
- **Saída obrigatória:** `npm run validar` e `npm test` verdes, e uma seção do produtor no relatório do lote (`../processo/lotes/AAAA-MM-DD.md`) com o que foi criado e as dúvidas.
- **O produtor nunca:** muda schema, mexe em arquivo de outro projeto, edita as cópias geradas nos sites, faz deploy ou fecha o A2.

## O que o verificador confere em todo item
1. A API publicada serve o item no endpoint do recurso.
2. A cópia do site (`npm run copias`) contém o item.
3. A página de detalhe abre com o título certo, sem "não encontrado".
4. A imagem principal carrega e tem `alt`.
5. Os links de "Veja também" abrem páginas existentes.
6. A URL está no `sitemap.xml` do site.
7. O axe não acha violação `critical` na página.

Se tudo passar, o item vai para `exibido`. Se algo falhar, o verificador registra no relatório do lote e abre issue no repositório do site com a evidência.
