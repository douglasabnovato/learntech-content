# Privacidade do registro de acesso

## O que é coletado

| Dado | Por quê |
|---|---|
| Nome completo e e-mail | Saber quem usa o LearnTECH e poder falar com quem pediu contato |
| Site (projeto) e página | Saber qual conteúdo é usado |
| Data e hora (UTC) | Contar acessos por período |

Não coletamos senha, IP, localização, cookies de rastreamento nem dados de navegador. O nome e o e-mail ficam também no próprio navegador (`localStorage`), para não perguntar de novo.

## Base legal e finalidade (LGPD)

A finalidade é informada no formulário: "essa identificação nos ajuda a aperfeiçoar o conteúdo". Os dados não são vendidos, não são compartilhados e não são usados para propaganda.

## Retenção e exclusão

- Os registros são apagados automaticamente após 365 dias (`RETENCAO_DIAS`, cron diário).
- Quem pedir a exclusão tem todos os registros do e-mail apagados com `DELETE /v1/acessos?email=` (ver [DEPLOY.md](DEPLOY.md)).
- A própria pessoa pode apagar o que está no navegador executando `LearnTECH.esquecer()` no console, ou limpando os dados do site.

## Pendência

Falta definir o **e-mail de contato para pedidos de privacidade**. Ele entra na página de privacidade do learn-tech (`content/learn-tech/paginas/privacidade.json` e `src/constants/privacyData.js`).
