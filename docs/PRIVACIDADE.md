# Privacidade do registro de acesso e das mensagens

## O que é coletado

| Dado | Por quê |
|---|---|
| Nome completo e e-mail | Saber quem usa o LearnTECH e poder falar com quem pediu contato |
| Site (projeto) e página | Saber qual conteúdo é usado |
| Data e hora (UTC) | Contar acessos por período |

Não coletamos senha, IP, localização, cookies de rastreamento nem dados de navegador. O nome e o e-mail ficam também no próprio navegador (`localStorage`), para não perguntar de novo.

## Mensagens do formulário "Fala aê"

| Dado | Por quê |
|---|---|
| Nome completo e e-mail | Responder à pessoa |
| Motivo e texto da mensagem (até 4000 caracteres) | Entender e atender o pedido |
| Site (projeto) e página de onde veio | Saber em que contexto surgiu a dúvida |
| Data e hora (UTC) | Ordenar e responder no prazo |

Ficam na tabela `mensagens` do D1, acessível só com o `ADMIN_TOKEN`. A única finalidade é responder ao contato, como diz a página de privacidade do learn-tech. Não coletamos IP nem dados de navegador; o Turnstile, se ativado, é verificado na hora e o token não é guardado.

## Base legal e finalidade (LGPD)

A finalidade é informada no formulário: "essa identificação nos ajuda a aperfeiçoar o conteúdo". Os dados não são vendidos, não são compartilhados e não são usados para propaganda.

## Retenção e exclusão

- Acessos e mensagens são apagados automaticamente após 365 dias (`RETENCAO_DIAS`, o mesmo cron diário apaga as duas tabelas).
- Quem pedir a exclusão tem todos os acessos **e todas as mensagens** do e-mail apagados com `DELETE /v1/acessos?email=` (ver [DEPLOY.md](DEPLOY.md)). `DELETE /v1/mensagens?email=` apaga só as mensagens.
- O pedido chega pelo próprio "Fala aê", com o motivo `privacidade`. Depois de atender, apague o e-mail com o comando acima; a mensagem do pedido sai junto.
- A própria pessoa pode apagar o que está no navegador executando `LearnTECH.esquecer()` no console, ou limpando os dados do site.

## Pendência

Falta definir o **e-mail de contato para pedidos de privacidade**. Ele entra na página de privacidade do learn-tech (`content/learn-tech/paginas/privacidade.json` e `src/constants/privacyData.js`).
