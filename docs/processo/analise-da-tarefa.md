# Ficha de análise da tarefa

A análise que o Claude faz antes de produzir conteúdo a partir do hd ou de tomar qualquer decisão de produto. Entrega 1 do método aprovado pelo autor em 15/11/2026 ("aprovo o plano"). Ela não substitui as 10 etapas de [`README.md`](README.md): entra na triagem (etapa 3) e no mapa editorial (etapa 4), e é gravada no plano do lote.

O objetivo é que o autor leia o porquê de cada escolha e corrija o raciocínio, não só o resultado.

## As 5 perguntas

### 1. Contexto
- Em que momento da trajetória do autor o item se encaixa? Use [`trajetoria-do-autor.md`](trajetoria-do-autor.md).
- O que já existe na API sobre o tema? Procure em `content/` e em `content/cobertura.json`.
- O item é novo ou aprofunda um conteúdo existente?

### 2. Tema
- O que o item ensina: método, ferramenta, processo, vivência ou referência?
- Qual é a fonte e o direito de uso: `proprio`, `terceiro-citavel`, `sensivel-anonimizar` ou `descartar`?
- Há dado de pessoa, marca de cliente, credencial ou material de ex-empregador? Se sim, vale a seção 7 de [`regras-editoriais.md`](regras-editoriais.md) e [`seguranca-privacidade.md`](seguranca-privacidade.md).

### 3. Objetivo do projeto
- Que problema do público o item resolve? O público de cada site está no `docs/MVP.md` dele.
- Em que site e em que recurso ele cabe, no formato `projeto/recurso/id`? Veja a cobertura entre projetos (etapa 7b de [`README.md`](README.md)).
- Ele serve à hipótese do MVP (learntech-content#23)? Enquanto a hipótese não existe, diga isso.

### 4. Competências do autor
- Que papel o item ensina: engenharia de software, produto ou arquitetura de IA?
- Em que nível o autor domina o tema, e com que evidência no hd ou na API?
- O que só o autor pode contar sobre isso (o relato, o erro, o bastidor)? Isso é o que diferencia o conteúdo.

Até o perfil do autor (`perfil-do-autor.md`, entrega 2, ainda não escrito) ser confirmado, responda com a evidência encontrada e marque "perfil a confirmar".

### 5. Decisão
- **Uma de três:** produzir, usar só como referência ou perguntar ao autor.
- **Justificativa:** uma ou duas frases, citando os princípios aplicados de [`decisoes-do-autor.md`](decisoes-do-autor.md) (por exemplo, "aplica P-02").
- **Confiança:** de 0 a 1.
- **Quando perguntar:** confiança abaixo do nível de autonomia em vigor, princípio só `a confirmar`, caso sem princípio, ou qualquer item de [`decisoes-do-autor.md`](decisoes-do-autor.md) marcado como fora do alcance do Claude.

## Formato da ficha no plano do lote

```markdown
### HD-0000 · <descrição curta, sem nomes>
- **Contexto:** <fase da trajetória> · <o que já existe na API> · <novo | aprofunda>
- **Tema:** <o que ensina> · direitos: <proprio | terceiro-citavel | sensivel-anonimizar | descartar> · riscos: <nenhum | quais>
- **Objetivo:** <problema do público> · destinos: <projeto/recurso/id, ...> · hipótese: <serve | não se aplica | hipótese ainda não escrita>
- **Competência:** <engenharia | produto | IA> · nível: <...> · evidência: <...> · o que só o autor conta: <...>
- **Decisão:** <produzir | referência | perguntar> · confiança: <0,00> · princípios: <P-NN, ...>
- **Justificativa:** <1 a 2 frases>
```

## Depois da decisão do autor

Quando o autor muda uma decisão do Claude, o motivo dele vira um registro novo em [`decisoes-do-autor.md`](decisoes-do-autor.md), e o princípio é proposto ou corrigido. A ficha original fica no lote, com a correção ao lado, para a medição de acerto (entrega 5).
