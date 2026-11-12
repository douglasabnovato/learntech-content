# Registros de conversas

Cada conversa com o Claude termina com um registro aqui. É assim que processos e resultados passam de um chat para outro: a conversa nova lê o `../ESTADO.md` e o registro mais recente da mesma frente.

Nome do arquivo: `AAAA-MM-DD-<frente>-<tema>.md`. Frentes: `conteudo`, `engenharia`, `processo`, `revisao`.

## Modelo
```markdown
# AAAA-MM-DD — <frente>: <tema>

## Pedido
<objetivo, critério de pronto e prioridade, nas palavras do autor>

## Feito
- <entrega> — <evidência (script, teste, relatório, link)>

## Decisões
- <decisão> — <por quê> — <quem decidiu>

## Aprendizados e ajustes de processo
- <o que falhou ou funcionou> → <regra, script ou documento que mudou>

## Placar
<saída resumida de npm run progresso>

## Pendências
- Autor: <itens novos em PROXIMOS-PASSOS.md>
- Claude, na próxima conversa: <o que retomar>

## Para a próxima conversa ler
<arquivos e trechos que importam>
```
