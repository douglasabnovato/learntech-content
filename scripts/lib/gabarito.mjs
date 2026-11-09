/* gabarito.mjs — compara a proposta do triador com a ficha já decidida no acervo (fase 1, issue #16).
 *
 * Acerto de direitos: o valor proposto é o mesmo do acervo.
 * Acerto de destinos: pelo menos um destino em comum e pelo menos metade dos propostos está no acervo
 *   (o triador pode sugerir um destino a menos, mas não pode errar a maioria).
 * Uso por arquivo: concordância só informativa, porque muitos usos do acervo foram decididos depois da publicação.
 */
export const META = 0.8;

export function compararItem(proposta, item) {
  const certos = new Set(item.destinos ?? []);
  const propostos = [...new Set(proposta.destinos ?? [])];
  const comuns = propostos.filter((d) => certos.has(d)).length;
  const destinosOk = certos.size === 0 ? propostos.length === 0 : comuns > 0 && comuns / Math.max(propostos.length, 1) >= 0.5;
  const usoCerto = new Map((item.arquivos ?? []).filter((f) => f.uso).map((f) => [f.sha256, f.uso]));
  const comparaveis = (proposta.arquivos ?? []).filter((f) => usoCerto.has(f.sha256));
  const usoIgual = comparaveis.filter((f) => f.uso === usoCerto.get(f.sha256)).length;
  return {
    id: item.id,
    direitosOk: proposta.direitos === item.direitos,
    destinosOk,
    comuns,
    propostos: propostos.length,
    certos: certos.size,
    uso: { iguais: usoIgual, comparados: comparaveis.length },
    confianca: proposta.triagem?.confianca ?? null,
  };
}

export function resumir(linhas) {
  const n = linhas.length || 1;
  const direitos = linhas.filter((l) => l.direitosOk).length / n;
  const destinos = linhas.filter((l) => l.destinosOk).length / n;
  const usoIg = linhas.reduce((s, l) => s + l.uso.iguais, 0);
  const usoN = linhas.reduce((s, l) => s + l.uso.comparados, 0);
  return { itens: linhas.length, direitos, destinos, uso: usoN ? usoIg / usoN : null, aprovado: direitos >= META && destinos >= META };
}

/* Fim de gabarito.mjs */
