/* app.ts — rotas dinâmicas da API (Hono): saúde, registro de acesso, mensagens do "Fala aê" e administração. O conteúdo estático é servido pelos Static Assets. */
import { Hono, type Context } from "hono";
import { bodyLimit } from "hono/body-limit";
import { entradaAcessoSchema } from "./acessos/schema";
import type { RepositorioAcessos } from "./acessos/repositorio";
import { entradaMensagemSchema } from "./mensagens/schema";
import type { RepositorioMensagens } from "./mensagens/repositorio";
import { lerOrigens, origemPermitida } from "./cors";
import { verificarTurnstile } from "./turnstile";

export interface Ambiente {
  ALLOWED_ORIGINS?: string;
  RETENCAO_DIAS?: string;
  JANELA_DEDUPE_MIN?: string;
  ADMIN_TOKEN?: string;
  TURNSTILE_SECRET?: string;
}

export interface Dependencias {
  repositorio: (env: Ambiente) => RepositorioAcessos;
  /* Sem este repositório, as rotas de mensagens respondem 503. */
  mensagens?: (env: Ambiente) => RepositorioMensagens;
  agora?: () => Date;
  versao?: string;
  buscar?: typeof fetch;
}

const MINUTO = 60_000;
const DIA = 24 * 60 * MINUTO;
/* Mensagem com o mesmo texto, do mesmo e-mail, dentro desta janela é tratada como envio repetido. */
const JANELA_MENSAGEM_IGUAL = 10 * MINUTO;

/* Compara dois textos em tempo constante (resumo SHA-256 de ambos antes do XOR). */
async function iguaisSeguro(a: string, b: string): Promise<boolean> {
  const enc = new TextEncoder();
  const [ha, hb] = await Promise.all([crypto.subtle.digest("SHA-256", enc.encode(a)), crypto.subtle.digest("SHA-256", enc.encode(b))]);
  const va = new Uint8Array(ha);
  const vb = new Uint8Array(hb);
  let dif = 0;
  for (let i = 0; i < va.length; i++) dif |= va[i]! ^ vb[i]!;
  return dif === 0;
}

/* Neutraliza células que planilhas interpretariam como fórmula e escapa aspas. */
function celulaCsv(valor: unknown): string {
  let t = valor === null || valor === undefined ? "" : String(valor);
  if (/^[=+\-@\t\r]/.test(t)) t = `'${t}`;
  return `"${t.replace(/"/g, '""')}"`;
}

/* Monta a aplicação com as dependências injetadas (repositório, relógio). */
export function criarApp(dep: Dependencias) {
  const agora = dep.agora ?? (() => new Date());
  const app = new Hono<{ Bindings: Ambiente }>();

  /* Cabeçalhos CORS para uma origem já aprovada. */
  const cors = (origem: string) => ({
    "Access-Control-Allow-Origin": origem,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  });

  /* Exige o token de administração no cabeçalho Authorization: Bearer. */
  const exigirAdmin = async (c: Context<{ Bindings: Ambiente }>): Promise<Response | null> => {
    const esperado = c.env.ADMIN_TOKEN;
    const recebido = c.req.header("Authorization")?.replace(/^Bearer\s+/i, "") ?? "";
    if (!esperado || esperado.length < 24 || !(await iguaisSeguro(recebido, esperado))) {
      return c.json({ erro: "não autorizado" }, 401);
    }
    return null;
  };

  app.get("/v1/saude", (c) => c.json({ status: "ok", versao: dep.versao ?? "dev", horario: agora().toISOString() }));

  app.options("/v1/acessos", (c) => {
    const origem = c.req.header("Origin");
    if (!origemPermitida(origem, lerOrigens(c.env.ALLOWED_ORIGINS))) return c.body(null, 403);
    return c.body(null, 204, cors(origem!));
  });

  app.post("/v1/acessos", bodyLimit({ maxSize: 8 * 1024, onError: (c) => c.json({ erro: "corpo grande demais" }, 413) }), async (c) => {
    const origem = c.req.header("Origin");
    if (!origemPermitida(origem, lerOrigens(c.env.ALLOWED_ORIGINS))) return c.json({ erro: "origem não permitida" }, 403);
    const h = cors(origem!);

    let bruto: unknown;
    try { bruto = await c.req.json(); } catch { return c.json({ erro: "JSON inválido" }, 400, h); }
    const r = entradaAcessoSchema.safeParse(bruto);
    if (!r.success) {
      return c.json({ erro: "dados inválidos", campos: r.error.issues.map((i) => ({ campo: i.path.join("."), mensagem: i.message })) }, 400, h);
    }

    if (c.env.TURNSTILE_SECRET) {
      const ok = await verificarTurnstile(c.env.TURNSTILE_SECRET, r.data.turnstileToken, c.req.header("CF-Connecting-IP") ?? null, dep.buscar);
      if (!ok) return c.json({ erro: "verificação anti-robô falhou" }, 403, h);
    }

    const repo = dep.repositorio(c.env);
    const momento = agora();
    const janela = Math.max(0, Number(c.env.JANELA_DEDUPE_MIN ?? "30")) * MINUTO;
    if (janela > 0 && (await repo.existeDesde(r.data.email, r.data.projeto, new Date(momento.getTime() - janela).toISOString()))) {
      return c.json({ registrado: false, motivo: "acesso já registrado recentemente" }, 200, h);
    }
    const id = await repo.inserir({ nome: r.data.nome, email: r.data.email, projeto: r.data.projeto, pagina: r.data.pagina ?? null, criadoEm: momento.toISOString() });
    return c.json({ registrado: true, id }, 201, h);
  });

  app.get("/v1/acessos/resumo", async (c) => {
    const negado = await exigirAdmin(c);
    if (negado) return negado;
    const desde = new Date(agora().getTime() - 30 * DIA).toISOString().slice(0, 10);
    return c.json(await dep.repositorio(c.env).resumir(desde));
  });

  app.get("/v1/acessos", async (c) => {
    const negado = await exigirAdmin(c);
    if (negado) return negado;
    const limite = Math.min(1000, Math.max(1, Number(c.req.query("limite") ?? "200") || 200));
    const desde = c.req.query("desde");
    if (desde && !/^\d{4}-\d{2}-\d{2}/.test(desde)) return c.json({ erro: "desde deve estar no formato AAAA-MM-DD" }, 400);
    const linhas = await dep.repositorio(c.env).listar({ projeto: c.req.query("projeto") || undefined, desde: desde || undefined, limite });
    if (c.req.query("formato") === "csv") {
      const csv = ["id,nome,email,projeto,pagina,criado_em", ...linhas.map((l) => [l.id, l.nome, l.email, l.projeto, l.pagina, l.criadoEm].map(celulaCsv).join(","))].join("\r\n");
      return c.body(csv, 200, { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": 'attachment; filename="acessos.csv"' });
    }
    return c.json({ total: linhas.length, acessos: linhas });
  });

  app.delete("/v1/acessos", async (c) => {
    const negado = await exigirAdmin(c);
    if (negado) return negado;
    const email = c.req.query("email")?.trim().toLowerCase();
    if (!email) return c.json({ erro: "informe ?email=" }, 400);
    /* Pedido do titular (LGPD): apaga os acessos e também as mensagens do "Fala aê" desse e-mail. */
    const apagados = await dep.repositorio(c.env).apagarPorEmail(email);
    const mensagens = dep.mensagens ? await dep.mensagens(c.env).apagarPorEmail(email) : 0;
    return c.json({ apagados, mensagens });
  });

  app.options("/v1/mensagens", (c) => {
    const origem = c.req.header("Origin");
    if (!origemPermitida(origem, lerOrigens(c.env.ALLOWED_ORIGINS))) return c.body(null, 403);
    return c.body(null, 204, cors(origem!));
  });

  app.post("/v1/mensagens", bodyLimit({ maxSize: 24 * 1024, onError: (c) => c.json({ erro: "corpo grande demais" }, 413) }), async (c) => {
    const origem = c.req.header("Origin");
    if (!origemPermitida(origem, lerOrigens(c.env.ALLOWED_ORIGINS))) return c.json({ erro: "origem não permitida" }, 403);
    const h = cors(origem!);
    if (!dep.mensagens) return c.json({ erro: "mensagens indisponíveis" }, 503, h);

    let bruto: unknown;
    try { bruto = await c.req.json(); } catch { return c.json({ erro: "JSON inválido" }, 400, h); }
    const r = entradaMensagemSchema.safeParse(bruto);
    if (!r.success) {
      return c.json({ erro: "dados inválidos", campos: r.error.issues.map((i) => ({ campo: i.path.join("."), mensagem: i.message })) }, 400, h);
    }

    if (c.env.TURNSTILE_SECRET) {
      const ok = await verificarTurnstile(c.env.TURNSTILE_SECRET, r.data.turnstileToken, c.req.header("CF-Connecting-IP") ?? null, dep.buscar);
      if (!ok) return c.json({ erro: "verificação anti-robô falhou" }, 403, h);
    }

    const repo = dep.mensagens(c.env);
    const momento = agora();
    if (await repo.existeIgualDesde(r.data.email, r.data.mensagem, new Date(momento.getTime() - JANELA_MENSAGEM_IGUAL).toISOString())) {
      return c.json({ registrado: false, motivo: "mensagem idêntica já recebida" }, 200, h);
    }
    const id = await repo.inserir({
      criadoEm: momento.toISOString(), projeto: r.data.projeto, motivo: r.data.motivo, nome: r.data.nome,
      email: r.data.email, mensagem: r.data.mensagem, pagina: r.data.pagina ?? null,
    });
    return c.json({ registrado: true, id }, 201, h);
  });

  app.get("/v1/mensagens", async (c) => {
    const negado = await exigirAdmin(c);
    if (negado) return negado;
    if (!dep.mensagens) return c.json({ erro: "mensagens indisponíveis" }, 503);
    const limite = Math.min(1000, Math.max(1, Number(c.req.query("limite") ?? "200") || 200));
    const desde = c.req.query("desde");
    if (desde && !/^\d{4}-\d{2}-\d{2}/.test(desde)) return c.json({ erro: "desde deve estar no formato AAAA-MM-DD" }, 400);
    const linhas = await dep.mensagens(c.env).listar({
      projeto: c.req.query("projeto") || undefined,
      motivo: c.req.query("motivo") || undefined,
      email: c.req.query("email")?.trim().toLowerCase() || undefined,
      desde: desde || undefined,
      limite,
    });
    if (c.req.query("formato") === "csv") {
      const csv = ["id,criado_em,projeto,motivo,nome,email,mensagem,pagina", ...linhas.map((l) => [l.id, l.criadoEm, l.projeto, l.motivo, l.nome, l.email, l.mensagem, l.pagina].map(celulaCsv).join(","))].join("\r\n");
      return c.body(csv, 200, { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": 'attachment; filename="mensagens.csv"' });
    }
    return c.json({ total: linhas.length, mensagens: linhas });
  });

  app.delete("/v1/mensagens", async (c) => {
    const negado = await exigirAdmin(c);
    if (negado) return negado;
    if (!dep.mensagens) return c.json({ erro: "mensagens indisponíveis" }, 503);
    const email = c.req.query("email")?.trim().toLowerCase();
    if (!email) return c.json({ erro: "informe ?email=" }, 400);
    return c.json({ apagadas: await dep.mensagens(c.env).apagarPorEmail(email) });
  });

  app.all("/v1/acessos", (c) => c.json({ erro: "método não permitido" }, 405));
  app.all("/v1/mensagens", (c) => c.json({ erro: "método não permitido" }, 405));
  app.notFound((c) => c.json({ erro: "não encontrado" }, 404));
  app.onError((e, c) => {
    console.error("erro não tratado", e);
    return c.json({ erro: "erro interno" }, 500);
  });

  return app;
}

/* Data de corte da retenção: agora menos RETENCAO_DIAS (padrão 365). */
function corteRetencao(env: Ambiente, agora: Date): string {
  const dias = Math.max(1, Number(env.RETENCAO_DIAS ?? "365") || 365);
  return new Date(agora.getTime() - dias * DIA).toISOString();
}

/* Apaga registros mais antigos que RETENCAO_DIAS; usado pelo cron diário. */
export async function aplicarRetencao(repo: RepositorioAcessos, env: Ambiente, agora: Date = new Date()): Promise<number> {
  return repo.apagarAntesDe(corteRetencao(env, agora));
}

/* Apaga mensagens do "Fala aê" mais antigas que RETENCAO_DIAS; usado pelo mesmo cron. */
export async function aplicarRetencaoMensagens(repo: RepositorioMensagens, env: Ambiente, agora: Date = new Date()): Promise<number> {
  return repo.apagarAntesDe(corteRetencao(env, agora));
}

/* Fim de app.ts */
