/* acessos.test.ts — rotas de registro de acesso e administração, com repositório em memória e relógio controlado. */
import { describe, it, expect, beforeEach } from "vitest";
import { criarApp, aplicarRetencao, type Ambiente } from "../src/app";
import { repositorioMemoria } from "../src/acessos/repositorio-memoria";
import { origemPermitida, lerOrigens } from "../src/cors";

const TOKEN = "token-de-teste-com-mais-de-24-caracteres";
const ORIGEM = "https://learn-tech-pied.vercel.app";
const env: Ambiente = {
  ALLOWED_ORIGINS: `${ORIGEM},https://douglasabnovato.github.io,http://localhost:*`,
  RETENCAO_DIAS: "365",
  JANELA_DEDUPE_MIN: "30",
  ADMIN_TOKEN: TOKEN,
};

let repo: ReturnType<typeof repositorioMemoria>;
let agora: Date;
let app: ReturnType<typeof criarApp>;

/* Monta um POST /v1/acessos com origem e corpo. */
function postar(corpo: unknown, origem: string | null = ORIGEM, e: Ambiente = env) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (origem) headers.Origin = origem;
  return app.request("/v1/acessos", { method: "POST", headers, body: typeof corpo === "string" ? corpo : JSON.stringify(corpo) }, e);
}

/* Monta uma requisição de administração com o token. */
function admin(caminho: string, metodo = "GET", token = TOKEN) {
  return app.request(caminho, { method: metodo, headers: { Authorization: `Bearer ${token}` } }, env);
}

const valido = { nome: "Maria da Silva", email: "Maria@Exemplo.com", projeto: "learn-tech", pagina: "/programs" };

beforeEach(() => {
  repo = repositorioMemoria();
  agora = new Date("2026-09-27T12:00:00.000Z");
  app = criarApp({ repositorio: () => repo, agora: () => agora, versao: "teste" });
});

describe("GET /v1/saude", () => {
  it("responde ok com versão e horário", async () => {
    const r = await app.request("/v1/saude", {}, env);
    expect(r.status).toBe(200);
    expect(await r.json()).toEqual({ status: "ok", versao: "teste", horario: "2026-09-27T12:00:00.000Z" });
  });
});

describe("POST /v1/acessos", () => {
  it("registra nome, e-mail normalizado, projeto, página e horário", async () => {
    const r = await postar(valido);
    expect(r.status).toBe(201);
    expect(r.headers.get("Access-Control-Allow-Origin")).toBe(ORIGEM);
    expect(repo.linhas).toHaveLength(1);
    expect(repo.linhas[0]).toMatchObject({ nome: "Maria da Silva", email: "maria@exemplo.com", projeto: "learn-tech", pagina: "/programs", criadoEm: "2026-09-27T12:00:00.000Z" });
  });

  it("não duplica o mesmo e-mail no mesmo projeto dentro de 30 minutos", async () => {
    await postar(valido);
    agora = new Date("2026-09-27T12:20:00.000Z");
    const r = await postar(valido);
    expect(r.status).toBe(200);
    expect(await r.json()).toMatchObject({ registrado: false });
    expect(repo.linhas).toHaveLength(1);
  });

  it("registra de novo depois da janela ou em outro projeto", async () => {
    await postar(valido);
    await postar({ ...valido, projeto: "tools" });
    agora = new Date("2026-09-27T12:31:00.000Z");
    await postar(valido);
    expect(repo.linhas).toHaveLength(3);
  });

  it("rejeita nome sem sobrenome, e-mail inválido e projeto desconhecido", async () => {
    for (const corpo of [{ ...valido, nome: "Maria" }, { ...valido, email: "maria@" }, { ...valido, projeto: "outro" }]) {
      const r = await postar(corpo);
      expect(r.status).toBe(400);
    }
    expect(repo.linhas).toHaveLength(0);
  });

  it("rejeita JSON malformado", async () => {
    const r = await postar("{nome:");
    expect(r.status).toBe(400);
  });

  it("rejeita origem fora da lista e requisição sem origem", async () => {
    expect((await postar(valido, "https://site-estranho.com")).status).toBe(403);
    expect((await postar(valido, null)).status).toBe(403);
    expect(repo.linhas).toHaveLength(0);
  });

  it("aceita localhost em qualquer porta quando configurado", async () => {
    expect((await postar(valido, "http://localhost:5173")).status).toBe(201);
  });

  it("rejeita corpo grande demais", async () => {
    const r = await postar({ ...valido, pagina: "x".repeat(10_000) });
    expect(r.status).toBe(413);
  });

  it("exige Turnstile válido quando TURNSTILE_SECRET está configurado", async () => {
    const buscar = (async () => new Response(JSON.stringify({ success: false }))) as unknown as typeof fetch;
    app = criarApp({ repositorio: () => repo, agora: () => agora, buscar });
    const r = await postar({ ...valido, turnstileToken: "x" }, ORIGEM, { ...env, TURNSTILE_SECRET: "s" });
    expect(r.status).toBe(403);
    const buscarOk = (async () => new Response(JSON.stringify({ success: true }))) as unknown as typeof fetch;
    app = criarApp({ repositorio: () => repo, agora: () => agora, buscar: buscarOk });
    expect((await postar({ ...valido, turnstileToken: "x" }, ORIGEM, { ...env, TURNSTILE_SECRET: "s" })).status).toBe(201);
  });
});

describe("OPTIONS /v1/acessos (preflight)", () => {
  it("libera origem permitida e bloqueia as demais", async () => {
    const ok = await app.request("/v1/acessos", { method: "OPTIONS", headers: { Origin: ORIGEM } }, env);
    expect(ok.status).toBe(204);
    expect(ok.headers.get("Access-Control-Allow-Methods")).toContain("POST");
    const negado = await app.request("/v1/acessos", { method: "OPTIONS", headers: { Origin: "https://x.com" } }, env);
    expect(negado.status).toBe(403);
  });
});

describe("administração", () => {
  beforeEach(async () => {
    await postar(valido);
    await postar({ ...valido, projeto: "career" });
    await postar({ nome: "João Souza", email: "joao@exemplo.com", projeto: "tools" });
  });

  it("exige token válido", async () => {
    expect((await app.request("/v1/acessos", {}, env)).status).toBe(401);
    expect((await admin("/v1/acessos", "GET", "errado")).status).toBe(401);
    expect((await app.request("/v1/acessos", { headers: { Authorization: `Bearer ${TOKEN}` } }, { ...env, ADMIN_TOKEN: "curto" })).status).toBe(401);
  });

  it("lista com filtro por projeto", async () => {
    const r = await admin("/v1/acessos?projeto=tools");
    const corpo = (await r.json()) as { total: number; acessos: { email: string }[] };
    expect(corpo.total).toBe(1);
    expect(corpo.acessos[0]!.email).toBe("joao@exemplo.com");
  });

  it("exporta CSV neutralizando fórmulas", async () => {
    await postar({ nome: "=HYPERLINK(1) Teste", email: "f@exemplo.com", projeto: "tools" });
    const r = await admin("/v1/acessos?formato=csv");
    expect(r.headers.get("Content-Type")).toContain("text/csv");
    const texto = await r.text();
    expect(texto.split("\r\n")[0]).toBe("id,nome,email,projeto,pagina,criado_em");
    expect(texto).toContain(`"'=HYPERLINK(1) Teste"`);
  });

  it("resume por projeto e conta pessoas únicas", async () => {
    const r = await admin("/v1/acessos/resumo");
    const corpo = (await r.json()) as { total: number; pessoas: number; porProjeto: unknown[]; porDia: { dia: string; acessos: number }[] };
    expect(corpo.total).toBe(3);
    expect(corpo.pessoas).toBe(2);
    expect(corpo.porProjeto).toHaveLength(3);
    expect(corpo.porDia).toEqual([{ dia: "2026-09-27", acessos: 3 }]);
  });

  it("apaga todos os registros de um e-mail (pedido do titular)", async () => {
    const r = await admin("/v1/acessos?email=MARIA@exemplo.com", "DELETE");
    expect(await r.json()).toEqual({ apagados: 2 });
    expect(repo.linhas.map((l) => l.email)).toEqual(["joao@exemplo.com"]);
  });
});

describe("retenção", () => {
  it("remove registros mais antigos que RETENCAO_DIAS", async () => {
    await postar(valido);
    agora = new Date("2027-10-01T12:00:00.000Z");
    await postar({ nome: "João Souza", email: "joao@exemplo.com", projeto: "tools" });
    const removidos = await aplicarRetencao(repo, env, agora);
    expect(removidos).toBe(1);
    expect(repo.linhas).toHaveLength(1);
  });
});

describe("cors", () => {
  it("interpreta a lista e o curinga de porta", () => {
    const lista = lerOrigens(" https://a.com/ , http://localhost:* ");
    expect(lista).toEqual(["https://a.com", "http://localhost:*"]);
    expect(origemPermitida("https://a.com", lista)).toBe(true);
    expect(origemPermitida("http://localhost:3000", lista)).toBe(true);
    expect(origemPermitida("http://localhost.evil.com", lista)).toBe(false);
    expect(origemPermitida("https://a.com.evil.com", lista)).toBe(false);
    expect(origemPermitida(undefined, lista)).toBe(false);
  });
});

/* Fim de acessos.test.ts */
