/* worker.ts — ponto de entrada do Cloudflare Worker: liga o app Hono ao D1 e agenda a retenção diária. */
import { criarApp, aplicarRetencao, aplicarRetencaoMensagens, type Ambiente } from "./app";
import { repositorioD1 } from "./acessos/repositorio-d1";
import { repositorioMensagensD1 } from "./mensagens/repositorio-d1";
import pacote from "../package.json";

interface Env extends Ambiente {
  DB: D1Database;
  ASSETS: Fetcher;
}

const app = criarApp({
  repositorio: (env) => repositorioD1((env as Env).DB),
  mensagens: (env) => repositorioMensagensD1((env as Env).DB),
  versao: pacote.version,
});

/* Caminhos atendidos pelo Hono (os mesmos de run_worker_first em wrangler.jsonc). */
const DINAMICOS = new Set(["/v1/saude", "/v1/acessos", "/v1/mensagens"]);

export default {
  /* Rotas dinâmicas passam pelo Hono; qualquer outra coisa vai para os arquivos estáticos. */
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (DINAMICOS.has(pathname) || pathname.startsWith("/v1/acessos/")) {
      return app.fetch(request, env, ctx);
    }
    return env.ASSETS.fetch(request);
  },

  /* Cron diário: remove acessos e mensagens mais antigos que a retenção configurada. */
  async scheduled(_evento: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(Promise.all([
      aplicarRetencao(repositorioD1(env.DB), env).then((n) => console.log(`retenção: ${n} acesso(s) removido(s)`)),
      aplicarRetencaoMensagens(repositorioMensagensD1(env.DB), env).then((n) => console.log(`retenção: ${n} mensagem(ns) removida(s)`)),
    ]));
  },
} satisfies ExportedHandler<Env>;

/* Fim de worker.ts */
