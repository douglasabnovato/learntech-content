/* mensagens.test.ts — rotas do formulário "Fala aê" (envio, administração, LGPD e retenção), com repositórios em memória e relógio controlado. */
import { describe, it, expect, beforeEach } from "vitest";
import { criarApp, aplicarRetencaoMensagens, type Ambiente } from "../src/app";
import { repositorioMemoria } from "../src/acessos/repositorio-memoria";
import { repositorioMensagensMemoria } from "../src/mensagens/repositorio-memoria";

const TOKEN = "token-de-teste-com-mais-de-24-caracteres";
const ORIGEM = "https://learn-tech-pied.vercel.app";
const env: Ambiente = {
  ALLOWED_ORIGINS: `${ORIGEM},http://localhost:*`,
  RETENCAO_DIAS: "365",
  ADMIN_TOKEN: TOKEN,
};

let acessos: ReturnType<typeof repositorioMemoria>;
let repo: ReturnType<typeof repositorioMensagensMemoria>;
let agora: Date;
let app: ReturnType<typeof criarApp>;

/* Monta um POST /v1/mensagens com origem e corpo. */
function postar(corpo: unknown, origem: string | null = ORIGEM, e: Ambiente = env) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (origem) headers.Origin = origem;
  return app.request("/v1/mensagens", { method: "POST", headers, body: typeof corpo === "string" ? corpo : JSON.stringify(corpo) }, e);
}

/* Monta uma requisição de administração com o token. */
function admin(caminho: string, metodo = "GET", token = TOKEN) {
  return app.request(caminho, { method: metodo, headers: { Authorization: `Bearer ${token}` } }, env);
}

const valida = {
  nome: "Maria da Silva",
  email: "Maria@Exemplo.com",
  motivo: "duvida-programa",
  mensagem: "Quando sai o próximo módulo de React?",
  projeto: "learn-tech",
  pagina: "/falaae",
};

beforeEach(() => {
  acessos = repositorioMemoria();
  repo = repositorioMensagensMemoria();
  agora = new Date("2026-10-28T12:00:00.000Z");
  app = criarApp({ repositorio: () => acessos, mensagens: () => repo, agora: () => agora, versao: "teste" });
});

describe("POST /v1/mensagens", () => {
  it("grava a mensagem com e-mail normalizado e responde 201 com CORS", async () => {
    const r = await postar(valida);
    expect(r.status).toBe(201);
    expect(r.headers.get("Access-Control-Allow-Origin")).toBe(ORIGEM);
    expect(await r.json()).toEqual({ registrado: true, id: 1 });
    expect(repo.linhas[0]).toMatchObject({
      nome: "Maria da Silva", email: "maria@exemplo.com", motivo: "duvida-programa",
      mensagem: "Quando sai o próximo módulo de React?", projeto: "learn-tech", pagina: "/falaae", criadoEm: "2026-10-28T12:00:00.000Z",
    });
  });

  it("aceita o motivo de privacidade e grava página nula quando ausente", async () => {
    const { pagina: _p, ...semPagina } = valida;
    expect((await postar({ ...semPagina, motivo: "privacidade" })).status).toBe(201);
    expect(repo.linhas[0]!.pagina).toBeNull();
  });

  it("ignora mensagem idêntica do mesmo e-mail em poucos minutos, mas aceita texto diferente", async () => {
    await postar(valida);
    agora = new Date("2026-10-28T12:05:00.000Z");
    const repetida = await postar(valida);
    expect(repetida.status).toBe(200);
    expect(await repetida.json()).toMatchObject({ registrado: false });
    expect((await postar({ ...valida, mensagem: "Outra pergunta" })).status).toBe(201);
    agora = new Date("2026-10-28T12:11:00.000Z");
    expect((await postar(valida)).status).toBe(201);
    expect(repo.linhas).toHaveLength(3);
  });

  it("rejeita corpo inválido com 400 e lista os campos", async () => {
    const invalidos = [
      { ...valida, nome: "Maria" },
      { ...valida, email: "maria@" },
      { ...valida, motivo: "area-membros" },
      { ...valida, mensagem: "   " },
      { ...valida, mensagem: "x".repeat(4001) },
      { ...valida, projeto: "outro" },
    ];
    for (const corpo of invalidos) {
      const r = await postar(corpo);
      expect(r.status).toBe(400);
      const json = (await r.json()) as { campos: { campo: string }[] };
      expect(json.campos.length).toBeGreaterThan(0);
    }
    expect((await postar("{nome:")).status).toBe(400);
    expect(repo.linhas).toHaveLength(0);
  });

  it("rejeita origem fora da lista e requisição sem origem com 403", async () => {
    expect((await postar(valida, "https://site-estranho.com")).status).toBe(403);
    expect((await postar(valida, null)).status).toBe(403);
    expect(repo.linhas).toHaveLength(0);
  });

  it("rejeita corpo grande demais com 413", async () => {
    expect((await postar({ ...valida, pagina: "x".repeat(30_000) })).status).toBe(413);
  });

  it("exige Turnstile válido quando TURNSTILE_SECRET está configurado", async () => {
    const buscar = (async () => new Response(JSON.stringify({ success: false }))) as unknown as typeof fetch;
    app = criarApp({ repositorio: () => acessos, mensagens: () => repo, agora: () => agora, buscar });
    expect((await postar({ ...valida, turnstileToken: "x" }, ORIGEM, { ...env, TURNSTILE_SECRET: "s" })).status).toBe(403);
    expect((await postar(valida, ORIGEM, { ...env, TURNSTILE_SECRET: "s" })).status).toBe(403);
    const buscarOk = (async () => new Response(JSON.stringify({ success: true }))) as unknown as typeof fetch;
    app = criarApp({ repositorio: () => acessos, mensagens: () => repo, agora: () => agora, buscar: buscarOk });
    expect((await postar({ ...valida, turnstileToken: "x" }, ORIGEM, { ...env, TURNSTILE_SECRET: "s" })).status).toBe(201);
  });

  it("responde 503 quando o app não tem repositório de mensagens", async () => {
    app = criarApp({ repositorio: () => acessos, agora: () => agora });
    expect((await postar(valida)).status).toBe(503);
  });
});

describe("OPTIONS /v1/mensagens (preflight)", () => {
  it("libera origem permitida e bloqueia as demais", async () => {
    const ok = await app.request("/v1/mensagens", { method: "OPTIONS", headers: { Origin: "http://localhost:5173" } }, env);
    expect(ok.status).toBe(204);
    expect(ok.headers.get("Access-Control-Allow-Methods")).toContain("POST");
    const negado = await app.request("/v1/mensagens", { method: "OPTIONS", headers: { Origin: "https://x.com" } }, env);
    expect(negado.status).toBe(403);
  });
});

describe("administração de mensagens", () => {
  beforeEach(async () => {
    await postar(valida);
    agora = new Date("2026-10-28T13:00:00.000Z");
    await postar({ ...valida, motivo: "privacidade", mensagem: "Quero apagar meus dados" });
    await postar({ nome: "João Souza", email: "joao@exemplo.com", motivo: "problema-tecnico", mensagem: "=1+1 quebrou a página", projeto: "learn-tech" });
  });

  it("exige token válido (401)", async () => {
    expect((await app.request("/v1/mensagens", {}, env)).status).toBe(401);
    expect((await admin("/v1/mensagens", "GET", "errado")).status).toBe(401);
    expect((await app.request("/v1/mensagens?email=maria@exemplo.com", { method: "DELETE" }, env)).status).toBe(401);
    expect(repo.linhas).toHaveLength(3);
  });

  it("lista da mais recente para a mais antiga, com filtros por motivo, e-mail e data", async () => {
    const todas = (await (await admin("/v1/mensagens")).json()) as { total: number; mensagens: { email: string; motivo: string }[] };
    expect(todas.total).toBe(3);
    expect(todas.mensagens[0]!.email).toBe("joao@exemplo.com");
    const priv = (await (await admin("/v1/mensagens?motivo=privacidade")).json()) as { total: number };
    expect(priv.total).toBe(1);
    const maria = (await (await admin("/v1/mensagens?email=MARIA@exemplo.com")).json()) as { total: number };
    expect(maria.total).toBe(2);
    expect((await admin("/v1/mensagens?desde=28/10/2026")).status).toBe(400);
  });

  it("exporta CSV neutralizando fórmulas", async () => {
    const r = await admin("/v1/mensagens?formato=csv");
    expect(r.headers.get("Content-Type")).toContain("text/csv");
    const texto = await r.text();
    expect(texto.split("\r\n")[0]).toBe("id,criado_em,projeto,motivo,nome,email,mensagem,pagina");
    expect(texto).toContain(`"'=1+1 quebrou a página"`);
  });

  it("DELETE /v1/mensagens?email= apaga só as mensagens desse e-mail", async () => {
    const r = await admin("/v1/mensagens?email=MARIA@exemplo.com", "DELETE");
    expect(await r.json()).toEqual({ apagadas: 2 });
    expect(repo.linhas.map((l) => l.email)).toEqual(["joao@exemplo.com"]);
    expect((await admin("/v1/mensagens", "DELETE")).status).toBe(400);
  });

  it("DELETE /v1/acessos?email= apaga também as mensagens do e-mail (pedido do titular)", async () => {
    await app.request("/v1/acessos", { method: "POST", headers: { "Content-Type": "application/json", Origin: ORIGEM }, body: JSON.stringify({ nome: "Maria da Silva", email: "maria@exemplo.com", projeto: "learn-tech" }) }, env);
    const r = await admin("/v1/acessos?email=maria@exemplo.com", "DELETE");
    expect(await r.json()).toEqual({ apagados: 1, mensagens: 2 });
    expect(acessos.linhas).toHaveLength(0);
    expect(repo.linhas).toHaveLength(1);
  });
});

describe("retenção de mensagens", () => {
  it("remove mensagens mais antigas que RETENCAO_DIAS", async () => {
    await postar(valida);
    agora = new Date("2027-11-01T12:00:00.000Z");
    await postar({ ...valida, mensagem: "Mensagem nova" });
    expect(await aplicarRetencaoMensagens(repo, env, agora)).toBe(1);
    expect(repo.linhas.map((l) => l.mensagem)).toEqual(["Mensagem nova"]);
  });
});

/* Fim de mensagens.test.ts */
