-- 0002_mensagens.sql — mensagens do formulário "Fala aê" (motivo, nome, e-mail, texto, projeto, página e horário em UTC ISO-8601).
CREATE TABLE IF NOT EXISTS mensagens (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  criado_em TEXT    NOT NULL,
  projeto   TEXT    NOT NULL CHECK (projeto IN ('learn-tech', 'bootcamps', 'career', 'tools')),
  motivo    TEXT    NOT NULL,
  nome      TEXT    NOT NULL,
  email     TEXT    NOT NULL,
  mensagem  TEXT    NOT NULL,
  pagina    TEXT
);

CREATE INDEX IF NOT EXISTS idx_mensagens_email_data ON mensagens (email, criado_em);
CREATE INDEX IF NOT EXISTS idx_mensagens_data ON mensagens (criado_em);
-- Fim de 0002_mensagens.sql
