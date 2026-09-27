/* turnstile.ts — verificação opcional do Cloudflare Turnstile (anti-robô gratuito). Sem TURNSTILE_SECRET, a checagem é ignorada. */

/* Consulta o endpoint siteverify; devolve true quando o token é válido. */
export async function verificarTurnstile(segredo: string, token: string | undefined, ip: string | null, buscar: typeof fetch = fetch): Promise<boolean> {
  if (!token) return false;
  const corpo = new FormData();
  corpo.append("secret", segredo);
  corpo.append("response", token);
  if (ip) corpo.append("remoteip", ip);
  try {
    const r = await buscar("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: corpo });
    const dados = (await r.json()) as { success?: boolean };
    return dados.success === true;
  } catch {
    return false;
  }
}

/* Fim de turnstile.ts */
