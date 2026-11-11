/* sdk-identificacao.test.ts — o script público /sdk/identificacao.js, que roda nos quatro sites, num DOM simulado (jsdom).
   Cobre: o modal aparece só sem identificação guardada, o acesso é registrado uma vez por sessão,
   o modo opcional (data-obrigatorio="false") e falha de rede sem quebrar a página (#6). */
import fs from "node:fs";
import path from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it, vi } from "vitest";

const CODIGO = fs.readFileSync(path.resolve(import.meta.dirname, "../public/sdk/identificacao.js"), "utf8");
const CHAVE = "learntech:identificacao";
const SESSAO = "learntech:sessao:tools";
const PESSOA = { nome: "Visitante de Teste", email: "e2e@example.com" };

type Opcoes = {
  atributos?: Record<string, string>;
  local?: Record<string, string>;
  sessao?: Record<string, string>;
  fetch?: (url: string, init?: RequestInit) => Promise<unknown>;
};

/* Põe o SDK na página como elemento <script> com os atributos dados. Vai pelo DOM, e não pelo HTML,
   porque o comentário de uso do SDK tem um "</script>" que fecharia a tag inline. */
function injetar(janela: JSDOM["window"], atributos: Record<string, string>) {
  const s = janela.document.createElement("script");
  for (const [k, v] of Object.entries(atributos)) s.setAttribute(k, v);
  s.textContent = CODIGO;
  janela.document.body.appendChild(s);
}

/* Carrega uma página com o SDK. O fetch é simulado; por padrão responde 201. */
function carregar(op: Opcoes = {}) {
  const fetch = vi.fn(op.fetch ?? (() => Promise.resolve({ ok: true, status: 201 })));
  const erros: unknown[] = [];
  const dom = new JSDOM(`<!doctype html><html><head></head><body><main id="conteudo">Página</main></body></html>`, {
    url: "https://site.test/tools/",
    runScripts: "dangerously",
    beforeParse(janela) {
      Object.assign(janela, { fetch });
      janela.addEventListener("error", (ev) => erros.push(ev.error));
      for (const [k, v] of Object.entries(op.local ?? {})) janela.localStorage.setItem(k, v);
      for (const [k, v] of Object.entries(op.sessao ?? {})) janela.sessionStorage.setItem(k, v);
    },
  });
  const janela = dom.window;
  injetar(janela, { "data-projeto": "tools", "data-api": "https://api.test", ...(op.atributos ?? {}) });
  const modal = () => janela.document.getElementById("learntech-identificacao");
  const raiz = () => modal()?.shadowRoot ?? null;
  return { janela, fetch, erros, modal, raiz };
}

/* Espera as promessas pendentes (fetch simulado e .then do SDK). */
const esperar = () => new Promise((ok) => setTimeout(ok, 10));

/* Preenche e envia o formulário do modal. */
function enviar(raiz: ShadowRoot, nome: string, email: string) {
  (raiz.getElementById("lt-nome") as HTMLInputElement).value = nome;
  (raiz.getElementById("lt-email") as HTMLInputElement).value = email;
  const form = raiz.querySelector("form")!;
  form.dispatchEvent(new form.ownerDocument.defaultView!.Event("submit", { cancelable: true }));
}

describe("sdk/identificacao.js", () => {
  it("sem identificação guardada, mostra o modal e não registra nada antes do envio", async () => {
    const p = carregar();
    await esperar();
    expect(p.modal()).not.toBeNull();
    expect(p.raiz()!.querySelector('[role="dialog"]')).not.toBeNull();
    expect(p.fetch).not.toHaveBeenCalled();
    expect(p.erros).toEqual([]);
  });

  it("modo obrigatório: não há botão \"Agora não\"", async () => {
    const p = carregar();
    await esperar();
    expect(p.raiz()!.querySelector(".depois")).toBeNull();
  });

  it("envio válido: registra o acesso, guarda a identificação e fecha o modal", async () => {
    const p = carregar();
    await esperar();
    enviar(p.raiz()!, "  Visitante   de Teste ", "E2E@Example.com");
    await esperar();
    expect(p.fetch).toHaveBeenCalledTimes(1);
    const [url, init] = p.fetch.mock.calls[0]!;
    expect(url).toBe("https://api.test/v1/acessos");
    expect(JSON.parse(String(init!.body))).toMatchObject({ ...PESSOA, projeto: "tools", pagina: "/tools/" });
    expect(JSON.parse(p.janela.localStorage.getItem(CHAVE)!)).toEqual(PESSOA);
    expect(p.janela.sessionStorage.getItem(SESSAO)).toBe("1");
    expect(p.modal()).toBeNull();
  });

  it("nome sem sobrenome ou e-mail inválido: mostra o erro e não envia", async () => {
    const p = carregar();
    await esperar();
    enviar(p.raiz()!, "Visitante", "e2e@example.com");
    expect(p.raiz()!.querySelector(".erro")!.textContent).toBe("Informe nome e sobrenome.");
    enviar(p.raiz()!, "Visitante de Teste", "sem-arroba");
    expect(p.raiz()!.querySelector(".erro")!.textContent).toBe("Informe um e-mail válido.");
    await esperar();
    expect(p.fetch).not.toHaveBeenCalled();
    expect(p.modal()).not.toBeNull();
  });

  it("já identificado no navegador: não mostra o modal e registra o acesso uma vez", async () => {
    const p = carregar({ local: { [CHAVE]: JSON.stringify(PESSOA) } });
    await esperar();
    expect(p.modal()).toBeNull();
    expect(p.fetch).toHaveBeenCalledTimes(1);
  });

  it("já registrado nesta sessão: não registra de novo", async () => {
    const p = carregar({ local: { [CHAVE]: JSON.stringify(PESSOA) }, sessao: { [SESSAO]: "1" } });
    await esperar();
    expect(p.modal()).toBeNull();
    expect(p.fetch).not.toHaveBeenCalled();
  });

  it("identificação guardada corrompida: trata como ausente e mostra o modal", async () => {
    const p = carregar({ local: { [CHAVE]: "{quebrado" } });
    await esperar();
    expect(p.modal()).not.toBeNull();
    expect(p.erros).toEqual([]);
  });

  it("API responde 400: descarta a identificação guardada", async () => {
    const p = carregar({ local: { [CHAVE]: JSON.stringify(PESSOA) }, fetch: () => Promise.resolve({ ok: false, status: 400 }) });
    await esperar();
    expect(p.janela.localStorage.getItem(CHAVE)).toBeNull();
    expect(p.janela.sessionStorage.getItem(SESSAO)).toBeNull();
  });

  it("modo opcional: tem \"Agora não\", que fecha o modal sem registrar", async () => {
    const p = carregar({ atributos: { "data-obrigatorio": "false" } });
    await esperar();
    const depois = p.raiz()!.querySelector<HTMLButtonElement>(".depois");
    expect(depois).not.toBeNull();
    depois!.click();
    expect(p.modal()).toBeNull();
    expect(p.fetch).not.toHaveBeenCalled();
  });

  it("falha de rede ao registrar: a página continua funcionando e o modal fecha", async () => {
    const p = carregar({ fetch: () => Promise.reject(new TypeError("Failed to fetch")) });
    await esperar();
    enviar(p.raiz()!, PESSOA.nome, PESSOA.email);
    await esperar();
    expect(p.erros).toEqual([]);
    expect(p.modal()).toBeNull();
    expect(p.janela.document.getElementById("conteudo")!.textContent).toBe("Página");
    /* Sem registro confirmado, a sessão não é marcada: o próximo carregamento tenta de novo. */
    expect(p.janela.sessionStorage.getItem(SESSAO)).toBeNull();
  });

  it("falha de rede já identificado: nenhum erro chega à página", async () => {
    const p = carregar({ local: { [CHAVE]: JSON.stringify(PESSOA) }, fetch: () => Promise.reject(new TypeError("Failed to fetch")) });
    await esperar();
    expect(p.erros).toEqual([]);
    expect(p.fetch).toHaveBeenCalledTimes(1);
  });

  it("data-projeto inválido: não faz nada e só avisa no console", async () => {
    const aviso = vi.spyOn(console, "warn").mockImplementation(() => {});
    const dom = new JSDOM(`<!doctype html><body></body>`, { url: "https://site.test/", runScripts: "dangerously" });
    injetar(dom.window, { "data-projeto": "outro" });
    await esperar();
    expect(aviso).toHaveBeenCalled();
    expect(dom.window.document.getElementById("learntech-identificacao")).toBeNull();
    expect((dom.window as unknown as { LearnTECH?: unknown }).LearnTECH).toBeUndefined();
    aviso.mockRestore();
  });
});

/* Fim de sdk-identificacao.test.ts */
