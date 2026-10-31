"""imagens-parecidas.py — aponta imagens quase iguais (dHash), para publicar só uma de cada.

Uso (na raiz do learntech-content):
  python scripts/imagens-parecidas.py <pasta> [<pasta> ...] [--limite 10]

Compara todas as imagens das pastas (recursivo) pelo hash de diferença 8x8; distância <= limite (padrão 10 de 64)
indica a mesma cena (rajada, recorte, outra resolução). Útil antes de montar galerias a partir do hd.
Requer Pillow.
"""
import sys
from pathlib import Path
from PIL import Image, ImageOps

EXTS = {".jpg", ".jpeg", ".png", ".webp"}


def dhash(caminho: Path) -> int:
    with Image.open(caminho) as im:
        im = ImageOps.exif_transpose(im).convert("L").resize((9, 8))
        px = list(im.getdata())
    bits = 0
    for r in range(8):
        for c in range(8):
            bits = (bits << 1) | (px[r * 9 + c] > px[r * 9 + c + 1])
    return bits


def main() -> None:
    args = sys.argv[1:]
    limite = 10
    if "--limite" in args:
        i = args.index("--limite")
        limite = int(args[i + 1])
        del args[i:i + 2]
    if not args:
        print(__doc__)
        return
    arquivos = [p for a in args for p in Path(a).rglob("*") if p.suffix.lower() in EXTS]
    hashes = {}
    for p in arquivos:
        try:
            hashes[p] = dhash(p)
        except OSError:
            print(f"! não abriu: {p}")
    lista = list(hashes.items())
    grupos = 0
    for i, (a, ha) in enumerate(lista):
        for b, hb in lista[i + 1:]:
            d = bin(ha ^ hb).count("1")
            if d <= limite:
                grupos += 1
                print(f"{d:2d}  {a}  ~  {b}")
    print(f"{len(lista)} imagens, {grupos} par(es) parecido(s) (limite {limite})")


if __name__ == "__main__":
    main()
