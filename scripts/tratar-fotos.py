"""tratar-fotos.py: converte fotos originais do hd em WebP publicável (até 1600 px, sem EXIF).

Uso (na raiz do learntech-content):
  python scripts/tratar-fotos.py <pasta-origem> <pasta-destino> ORIGINAL:destino [ORIGINAL:destino ...]

Exemplo:
  python scripts/tratar-fotos.py ../hd/eventos/codexperience-21-22-10-2023 media/bootcamps/eventos/codexperience-2023 IMG_5302:7

Regras (docs/CONTEUDO.md): corrige a orientação, reduz para no máximo 1600 px, salva WebP
qualidade 78 sem metadados (o EXIF pode conter localização). Não altera o original.
Requer Pillow (pip install pillow).
"""
import sys
from pathlib import Path
from PIL import Image, ImageOps

LADO_MAXIMO = 1600
QUALIDADE = 78


def localizar(origem: Path, nome: str) -> Path:
    for candidato in origem.iterdir():
        if candidato.stem == nome or candidato.name == nome:
            return candidato
    raise FileNotFoundError(f"{nome} não encontrado em {origem}")


def tratar(origem: Path, destino: Path, nome: str, saida: str) -> Path:
    arquivo = localizar(origem, nome)
    with Image.open(arquivo) as im:
        im = ImageOps.exif_transpose(im).convert("RGB")
        im.thumbnail((LADO_MAXIMO, LADO_MAXIMO))
        alvo = destino / f"{saida}.webp"
        im.save(alvo, "WEBP", quality=QUALIDADE, method=6)
    return alvo


def main() -> None:
    if len(sys.argv) < 4:
        print(__doc__)
        sys.exit(1)
    origem, destino = Path(sys.argv[1]), Path(sys.argv[2])
    destino.mkdir(parents=True, exist_ok=True)
    for par in sys.argv[3:]:
        nome, saida = par.split(":", 1)
        alvo = tratar(origem, destino, nome, saida)
        with Image.open(alvo) as w:
            print(f"{nome} -> {alvo} {w.size[0]}x{w.size[1]} {alvo.stat().st_size // 1024} KB exif={bool(w.info.get('exif'))}")


if __name__ == "__main__":
    main()
