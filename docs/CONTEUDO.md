# Guia de conteúdo

## Onde fica cada coisa

| Arquivo | Formato |
|---|---|
| `content/learn-tech/programas/{id}.json` | Um programa completo, no mesmo formato de `programsData` do learn-tech. O nome do arquivo é o id |
| `content/learn-tech/paginas/{nome}.json` | Uma página. Listas ficam em `itens`; ícones são nomes do react-icons (ex.: `"FaCode"`) |
| `content/bootcamps/eventos/{slug}.json` | Um evento, no formato `BootcampEvent`. O nome do arquivo é o slug |
| `content/career/*.json` | `empresas`, `vagas`, `perfis` (listas) e `destaques` (títulos do carrossel) |
| `content/tools/*.json` | `ferramentas` e `hospedagens` |
| `content/cobertura.json` | Liga cada pasta do acervo `a-arquivos-e-livros` ao que foi publicado |
| `media/` | Imagens WebP e PDFs referenciados como `/media/...` |

## Regras que o build confere

- Ids e slugs únicos; o nome do arquivo bate com o id ou o slug.
- Programa com `moduleContents`:
  - todo módulo tem conteúdo com o mesmo título;
  - `lessonsCount` é igual ao número de passos;
  - os passos são numerados 1, 2, 3...;
  - os ícones são os aceitos pelo `ModuleRenderer`.
- Quiz: cada questão aponta para um módulo existente e tem exatamente uma alternativa correta.
- Nenhum programa tem `rating` nem `students`.
- Toda referência `/media/...` existe em `media/`.
- Os destaques do career existem nas listas.
- A cobertura só aponta para itens que existem.

## Imagens

Converta para WebP com no máximo 1600 px e sem EXIF. O EXIF pode conter localização. Exemplo com Python/Pillow:

```python
from PIL import Image, ImageOps
im = ImageOps.exif_transpose(Image.open("foto.jpg")).convert("RGB")
im.thumbnail((1600, 1600)); im.save("media/bootcamps/eventos/evento/1.webp", "WEBP", quality=78, method=6)
```

## Cuidados

- Nada de dados pessoais de terceiros: CPF, telefones, listas de e-mails, bases de clientes.
- Livros, apostilas e cursos pagos entram só como referência citada.
- O case da empresa do varejo de construção usa nome fictício e números em proporção.

## Cópias locais dos sites

Cada site guarda uma cópia de reserva para quando a API não responde. Essa cópia é **gerada** a partir de `content/` e não deve ser editada à mão:

- tools: `data/tools.js`, `data/host.js`;
- career: `js/good-companies.js`, `js/jobs.js`, `js/perfis-dev.js`, `js/destaques.js`, `js/curriculos.js`;
- bootcamps: `src/entities/event/api/events.data.ts`;
- learn-tech: `src/constants/blogData.js`, `src/constants/areasData.js`.

Depois de mudar `content/`, rode `npm run copias` (com os sites como pastas irmãs em `mundo-learn-tech/`) e faça o commit dos arquivos gerados em cada site. `npm run copias:conferir` acusa cópia desatualizada.

## Tipos de conteúdo novos (28/10/2026)

- `learn-tech/areas.json`: áreas de atuação, com fontes obrigatórias. O build confere se `categorias` existe como `categoryFilter` de algum programa e se `cards[].categoria` existe em `paginas/categorias.json`.
- `career/modelos-curriculo.json`: modelos de currículo **fictícios**. O build exige `ficticio: true`, telefone `(00) 00000-0000`, e-mail `@example.com` e links `https://www.example.com/`, para nenhum dado real entrar por engano.
