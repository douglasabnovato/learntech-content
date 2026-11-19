/* data-local.mjs — a data de hoje no horário de Brasília, no formato AAAA-MM-DD (issue #30).
 *
 * Não use new Date().toISOString().slice(0, 10): ela dá a data UTC. Das 21h à meia-noite em Brasília,
 * a UTC já está no dia seguinte, e o relatório sai com a data errada.
 */
export const FUSO = "America/Sao_Paulo";

export function hojeLocal(data = new Date()) {
  return data.toLocaleDateString("sv-SE", { timeZone: FUSO });
}
