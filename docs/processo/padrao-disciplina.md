# Padrão por disciplina (`5-expertise`)

Atualizado em 22/11/2026 (decisões 116 a 120 do autor, [#49](https://github.com/douglasabnovato/learntech-content/issues/49)). O padrão vale para as disciplinas de 3 cursos: o bacharelado em Ciência da Computação (42 disciplinas), o técnico do IF (35) e o ADS (14). **Uma disciplina por vez.** O piloto é a DCC013, Estrutura de Dados I (decisão 118).

## As regras do autor (22/11/2026)
- "nenhum conteúdo pode ser descartado ou superficialidade";
- do PDF do professor ou do livro: "resumir os conteúdos de forma estratégica [...] mantendo o título dos capítulos e subcapítulos e realizar a demonstração das resoluções dos exercícios e atividades";
- "os meus trabalhos são meus então devem ser transcritos e implementados e hospedados com documentação e detalhes".

## 1. Cada arquivo ganha um destino (nada é descartado)

| Tipo de arquivo | Tratamento | Publica? |
|---|---|---|
| **Trabalho do autor** (código, relatório, anotação) | transcrito na íntegra, implementado, hospedado e documentado | sim |
| **PDF do professor** (slides, apostila) | resumo estratégico com as palavras do Claude, com os títulos de capítulos e subcapítulos e exemplos próprios | o resumo; o PDF não |
| **Livro em PDF** | o mesmo resumo por capítulo, com a referência bibliográfica completa | o resumo; o PDF não |
| **Lista de exercícios, atividade ou prova** | enunciado reescrito, com a resolução demonstrada passo a passo e o código, quando houver | sim |
| **Arquivo compilado** (`.o`, `.exe`) | não é publicado: a CI recompila a partir do código-fonte e prova que roda. Fica no registro como "derivado de" | registrado |
| **Cópia idêntica** | fica no registro como "cópia de HC-nnn" | registrado |
| **Áudio** | transcrito para estudo; entra no resumo, e o áudio não é publicado | o resumo |
| **Arquivo com nome sensível** | não é aberto ([`hd-codes.md`](hd-codes.md)) | não |

## 2. O pacote da disciplina
1. **Página no learn-tech, pela API:** usa o tipo `disciplina` ([#47](https://github.com/douglasabnovato/learntech-content/issues/47), decisão 120). Leva:
   - a referência no formato fixo;
   - o mapa de capítulos e subcapítulos, com os títulos originais;
   - o resumo estratégico de cada capítulo;
   - os exercícios com resolução;
   - **3 usos práticos** pesquisados, com fontes ([`pesquisa.md`](pesquisa.md));
   - os links para o repositório e para o visual.
2. **Repositório do curso:** 1 repositório por curso, com 1 pasta por disciplina (decisão 117). Cada pasta tem:
   - o trabalho original intacto, em `original/`;
   - a implementação revisada e comentada;
   - o README com o que é, como rodar, como funciona e o que o autor aprendeu;
   - a CI que compila e testa;
   - o visual no GitHub Pages, quando o tema é lógico (por exemplo, pilha, fila e lista).
3. **Studio D:** o roteiro da aula com blocos-corte, para o autor gravar mexendo no visual.
4. **Registro (`acervo.json`):** cada arquivo da pasta com o seu destino. Depois vem o aviso "pronto: HC-nnn", e o autor arrasta a pasta para a `000-catalogado`.

## 3. A referência (formato fixo)
> Conteúdo criado a partir do trabalho da disciplina de \<disciplina\> do curso de \<curso\> do \<grau\> da \<instituição\> em \<ano\>.

Exemplo: "Conteúdo criado a partir do trabalho da disciplina de Estrutura de Dados I (DCC013) do curso de Ciência da Computação do Bacharelado da UFJF em 2009."

O ano e o código saem dos arquivos. **Se não for possível confirmar, o campo fica "a confirmar" e o autor é perguntado. Nunca se inventa.** O schema aceita "a confirmar" ([#47](https://github.com/douglasabnovato/learntech-content/issues/47)).

## 4. As etapas

| # | Etapa | Saída | Quem |
|---|---|---|---|
| 1 | Inventário da pasta | arquivos com tipo, hash e autoria provável | Claude |
| 2 | Separação por autoria | do autor, de professor, de livro, lista, derivado ou cópia | Claude, com o ok do autor na dúvida |
| 3 | Mapa de capítulos | títulos e subtítulos na ordem | Claude |
| 4 | Resumo estratégico e resoluções | o texto por capítulo | Claude |
| 5 | 3 usos práticos | o texto com fontes | Claude (pesquisa) |
| 6 | Transcrição e implementação | o repositório com `original/`, a implementação, os testes e o visual | sessão GitHub |
| 7 | Revisão de qualidade | checklist: nada descartado, nenhum trecho copiado, fontes, código rodando | revisor |
| 8 | **A1** | o ok do autor | **autor** |
| 9 | Publicação | o merge na API e no repositório, e a página no ar | sessão LearnTech + **autor** |

O ritmo é de 1 capítulo por turno ([`motor-2-por-dia.md`](motor-2-por-dia.md)).

## 5. Cuidados
- **Resumo de livro:** é feito com as palavras do Claude, sem copiar parágrafos e com exemplos próprios. Os títulos podem ser mantidos. O resumo não pode virar uma versão reescrita do livro.
- **Enunciado:** é reescrito, nunca copiado. A resolução é toda nova.
- **Integridade acadêmica:** cada resolução vem explicada, nunca só a resposta.
- **Trabalho em grupo:** o crédito fica como "trabalho em grupo", sem nomes de colegas, a não ser com o ok deles.
- **Professores:** os nomes não aparecem. A referência cita a disciplina, o curso, o grau, a instituição e o ano.
- **Ferramentas:** o Python e as bibliotecas de PDF e de OCR são da decisão 76, que fica com o autor e bloqueia a L7 até ser resolvida.
