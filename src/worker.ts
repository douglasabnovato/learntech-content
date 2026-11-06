/* worker.ts — ponto de entrada do Cloudflare Worker: liga o app Hono ao D1 e agenda a retenção diária. */
import { criarApp, aplicarRetencao, aplicarRetencaoMensagens, type Ambiente } from "./app";
import { repositorioD1 } from "./acessos/repositorio-d1";
import { repositorioMensagensD1 } from "./mensagens/repositorio-d1";
import pacote from "../package.json";

interface Env extends Ambiente {
  DB: D1Database;
  ASSETS: Fetcher;
  /* Binding "ratelimits" do wrangler.jsonc (gratuito, contagem por localização da Cloudflare). Opcional. */
  LIMITADOR_ESCRITA?: RateLimit;
}

/* Consulta o binding de limite de taxa. Sem binding, ou se ele falhar, deixa passar (o Turnstile e a
   deduplicação continuam valendo) e registra o erro, para o limite nunca derrubar o registro legítimo. */
async function limitarEscrita(env: Ambiente, chave: string): Promise<boolean> {
  const limitador = (env as Env).LIMITADOR_ESCRITA;
  if (!limitador) return true;
  try {
    return (await limitador.limit({ key: chave })).success;
  } catch (e) {
    console.error(JSON.stringify({ nivel: "erro", mensagem: `limite de taxa indisponível: ${e instanceof Error ? e.message : String(e)}` }));
    return true;
  }
}

const app = criarApp({
  repositorio: (env) => repositorioD1((env as Env).DB),
  mensagens: (env) => repositorioMensagensD1((env as Env).DB),
  versao: pacote.version,
  limitar: limitarEscrita,
});

/* Caminhos atendidos pelo Hono (os mesmos de run_worker_first em wrangler.jsonc; tests/worker.test.ts confere as duas listas). */
export const DINAMICOS = new Set(["/v1/saude", "/v1/acessos", "/v1/mensagens"]);
/* Prefixos com subcaminhos dinâmicos (em run_worker_first aparecem como "/v1/acessos/*"). */
export const PREFIXOS_DINAMICOS = ["/v1/acessos/"];

/* O caminho vai para o Hono (true) ou para os arquivos estáticos (false)? */
export function ehDinamico(pathname: string): boolean {
  return DINAMICOS.has(pathname) || PREFIXOS_DINAMICOS.some((p) => pathname.startsWith(p));
}

export default {
  /* Rotas dinâmicas passam pelo Hono; qualquer outra coisa vai para os arquivos estáticos. */
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (ehDinamico(pathname)) {
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
