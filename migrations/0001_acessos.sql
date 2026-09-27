-- 0001_acessos.sql — tabela de registro de acessos (nome completo, e-mail, projeto, página e horário em UTC ISO-8601).
CREATE TABLE IF NOT EXISTS acessos (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  nome      TEXT    NOT NULL,
  email     TEXT    NOT NULL,
  projeto   TEXT    NOT NULL CHECK (projeto IN ('learn-tech', 'bootcamps', 'career', 'tools')),
  pagina    TEXT,
  criado_em TEXT    NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_acessos_email_projeto_data ON acessos (email, projeto, criado_em);
CREATE INDEX IF NOT EXISTS idx_acessos_data ON acessos (criado_em);
-- Fim de 0001_acessos.sql
