/* worker.test.ts — roteamento do Worker (Hono ou arquivos estáticos), coerência com run_worker_first do wrangler.jsonc
 * e o caminho completo POST → D1 → GET, com o D1 simulado sobre SQLite (tests/apoio/d1-sqlite.ts). */
import fs from "node:fs";
import path from "node:path";
import { describe, it, expect, beforeEach } from "vitest";
import worker, { DINAMICOS, PREFIXOS_DINAMICOS, ehDinamico } from "../src/worker";
import { d1EmMemoria } from "./apoio/d1-sqlite";

const TOKEN = "token-de-teste-com-mais-de-24-caracteres";
const ORIGEM = "https://learn-tech-pied.vercel.app";

/* Lê o wrangler.jsonc ignorando as linhas de comentário (as URLs dentro das strings mantêm o "//"). */
function lerWrangler(): { assets: { run_worker_first: string[] }; ratelimits?: { name: string; simple: { limit: number; period: number } }[] } {
  const texto = fs.readFileSync(path.resolve(import.meta.dirname, "..", "wrangler.jsonc"), "utf8");
  return JSON.parse(texto.split(/\r?\n/).filter((l) => !/^\s*\/\//.test(l)).join("\n"));
}

/* Contexto de execução mínimo: guarda as promessas do waitUntil para o teste aguardar. */
function contexto() {
  const pendentes: Promise<unknown>[] = [];
  return { pendentes, ctx: { waitUntil: (p: Promise<unknown>) => { pendentes.push(p); }, passThroughOnException: () => {}, props: {} } as unknown as ExecutionContext };
}

let env: Parameters<typeof worker.fetch>[1];
let estaticos: string[];

beforeEach(() => {
  estaticos = [];
  env = {
    DB: d1EmMemoria().d1,
    ASSETS: { fetch: async (r: Request) => { estaticos.push(new URL(r.url).pathname); return new Response("estático", { status: 200 }); } } as unknown as Fetcher,
    ALLOWED_ORIGINS: ORIGEM,
    ADMIN_TOKEN: TOKEN,
    JANELA_DEDUPE_MIN: "30",
    RETENCAO_DIAS: "365",
  };
});

/* Chama o fetch do Worker com um caminho relativo. */
const chamar = (caminho: string, init: RequestInit = {}) => worker.fetch(new Request(`https://api.exemplo${caminho}`, init), env, contexto().ctx);

describe("coerência com wrangler.jsonc", () => {
  const lista = lerWrangler().assets.run_worker_first;

  it("todo caminho dinâmico do Worker está em run_worker_first", () => {
    for (const c of DINAMICOS) expect(lista).toContain(c);
    for (const p of PREFIXOS_DINAMICOS) expect(lista).toContain(`${p}*`);
  });

  it("todo padrão de run_worker_first é tratado pelo Hono no Worker", () => {
    for (const padrao of lista) expect(ehDinamico(padrao.replace("*", "resumo")), padrao).toBe(true);
    expect(lista).toHaveLength(DINAMICOS.size + PREFIXOS_DINAMICOS.length);
  });
});

describe("roteamento do Worker", () => {
  it("/v1/saude vai ao Hono", async () => {
    const r = await chamar("/v1/saude");
    expect(r.status).toBe(200);
    expect(await r.json()).toMatchObject({ status: "ok" });
    expect(estaticos).toEqual([]);
  });

  it("/v1/acessos/resumo vai ao Hono (e exige token)", async () => {
    expect((await chamar("/v1/acessos/resumo")).status).toBe(401);
    expect(estaticos).toEqual([]);
  });

  it("conteúdo estático vai ao ASSETS", async () => {
    for (const c of ["/v1/index.json", "/v1/learn-tech/programas.json", "/v1/openapi.json", "/"]) {
      const r = await chamar(c);
      expect(await r.text()).toBe("estático");
    }
    expect(estaticos).toEqual(["/v1/index.json", "/v1/learn-tech/programas.json", "/v1/openapi.json", "/"]);
  });

  it("caminho parecido, mas fora da lista, não vai ao Hono", () => {
    expect(ehDinamico("/v1/acessos.json")).toBe(false);
    expect(ehDinamico("/v1/mensagens/123")).toBe(false);
    expect(ehDinamico("/v1/saude/")).toBe(false);
  });
});

describe("Worker com D1 (SQLite)", () => {
  it("POST /v1/acessos grava no banco e GET /v1/acessos devolve a linha", async () => {
    const corpo = JSON.stringify({ nome: "Maria da Silva", email: "Maria@Exemplo.com", projeto: "career", pagina: "/vagas" });
    const r = await chamar("/v1/acessos", { method: "POST", headers: { "Content-Type": "application/json", Origin: ORIGEM }, body: corpo });
    expect(r.status).toBe(201);
    const lista = (await (await chamar("/v1/acessos", { headers: { Authorization: `Bearer ${TOKEN}` } })).json()) as { total: number; acessos: { email: string; projeto: string }[] };
    expect(lista.total).toBe(1);
    expect(lista.acessos[0]).toMatchObject({ email: "maria@exemplo.com", projeto: "career" });
  });

  it("POST /v1/mensagens grava e o segundo envio idêntico não duplica", async () => {
    const corpo = JSON.stringify({ nome: "Maria da Silva", email: "maria@exemplo.com", motivo: "outro", mensagem: "Olá!", projeto: "tools" });
    const init = { method: "POST", headers: { "Content-Type": "application/json", Origin: ORIGEM }, body: corpo };
    expect((await chamar("/v1/mensagens", init)).status).toBe(201);
    expect((await chamar("/v1/mensagens", init)).status).toBe(200);
    const lista = (await (await chamar("/v1/mensagens", { headers: { Authorization: `Bearer ${TOKEN}` } })).json()) as { total: number };
    expect(lista.total).toBe(1);
  });

  it("o cron de retenção apaga acessos e mensagens antigos", async () => {
    const db = env.DB;
    await db.prepare("INSERT INTO acessos (nome, email, projeto, pagina, criado_em) VALUES (?, ?, ?, ?, ?)").bind("Maria da Silva", "m@e.com", "tools", null, "2000-01-01T00:00:00.000Z").run();
    await db.prepare("INSERT INTO mensagens (criado_em, projeto, motivo, nome, email, mensagem, pagina) VALUES (?, ?, ?, ?, ?, ?, ?)").bind("2000-01-01T00:00:00.000Z", "tools", "outro", "Maria da Silva", "m@e.com", "antiga", null).run();
    const { ctx, pendentes } = contexto();
    await worker.scheduled({} as ScheduledController, env, ctx);
    await Promise.all(pendentes);
    expect(await db.prepare("SELECT COUNT(*) AS n FROM acessos").first()).toEqual({ n: 0 });
    expect(await db.prepare("SELECT COUNT(*) AS n FROM mensagens").first()).toEqual({ n: 0 });
  });
});

describe("binding de limite de taxa (LIMITADOR_ESCRITA)", () => {
  const corpo = (email: string) => JSON.stringify({ nome: "Maria da Silva", email, projeto: "career" });
  const postar = (email: string) => chamar("/v1/acessos", { method: "POST", headers: { "Content-Type": "application/json", Origin: ORIGEM, "CF-Connecting-IP": "203.0.113.7" }, body: corpo(email) });

  it("wrangler.jsonc declara o binding usado pelo Worker", () => {
    const cfg = lerWrangler();
    expect(cfg.ratelimits?.map((r) => r.name)).toContain("LIMITADOR_ESCRITA");
  });

  it("com o binding recusando, o POST responde 429 e não grava", async () => {
    const chaves: string[] = [];
    env.LIMITADOR_ESCRITA = { limit: async ({ key }: { key: string }) => { chaves.push(key); return { success: false }; } } as RateLimit;
    expect((await postar("a@exemplo.com")).status).toBe(429);
    expect(chaves).toEqual(["203.0.113.7:acessos"]);
    expect(await env.DB.prepare("SELECT COUNT(*) AS n FROM acessos").first()).toEqual({ n: 0 });
  });

  it("se o binding falhar, deixa passar (o limite nunca derruba o registro)", async () => {
    env.LIMITADOR_ESCRITA = { limit: async () => { throw new Error("fora do ar"); } } as RateLimit;
    expect((await postar("a@exemplo.com")).status).toBe(201);
  });

  it("sem o binding, o comportamento é o de antes", async () => {
    expect((await postar("a@exemplo.com")).status).toBe(201);
  });
});

/* Fim de worker.test.ts */
