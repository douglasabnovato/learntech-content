# Auditoria de dependências, 2026-11-03

Meta: zero vulnerabilidades altas ou críticas em produção. Situação: meta atingida.

| Repositório | Escopo | Crítica | Alta | Moderada | Baixa | Altas e críticas |
|---|---|---|---|---|---|---|
| learntech-content | produção | 0 | 0 | 0 | 0 | - |
| learntech-content | todas | 0 | 10 | 30 | 0 | @puppeteer/browsers (high), basic-ftp (high), chromium-bidi (high), extract-zip (high), get-uri (high), lighthouse (high) |
| learn-tech | produção | 0 | 0 | 0 | 0 | - |
| learn-tech | todas | 0 | 0 | 8 | 0 | - |
| bootcamps | produção | 0 | 0 | 0 | 0 | - |
| bootcamps | todas | 0 | 10 | 14 | 2 | brace-expansion (high), browserslist (high), flatted (high), js-yaml (high), nanoid (high), picomatch (high) |
| career | produção | 0 | 0 | 0 | 0 | - |
| career | todas | 0 | 0 | 5 | 0 | - |
| tools | produção | 0 | 0 | 0 | 0 | - |
| tools | todas | 0 | 0 | 5 | 0 | - |

Correção: `npm audit fix` (sem --force) no repositório; o que exigir troca de versão maior vira tarefa no backlog.
