"""hd-imagens.py — acha, para cada imagem do hd, a imagem publicada mais parecida (dHash 8x8).

Uso (na raiz do learntech-content):
  python scripts/hd-imagens.py            # hd em ../hd e repositórios irmãos em ..
  python scripts/hd-imagens.py --hd <pasta>

Compara com as imagens publicadas nos cinco repositórios (learntech-content, learn-tech, bootcamps, career, tools).
Distância até 5 (de 64) = a mesma imagem; de 6 a 10 = provável (tratada ou recortada).
Grava <hd>/.imagens-publicadas.json, fora do git, lido por `npm run hd:uso`.
Requer Pillow.
"""
import json
import warnings
import sys
from pathlib import Path
from PIL import Image, ImageOps

Image.MAX_IMAGE_PIXELS = None
warnings.simplefilter("ignore")
EXTS = {".jpg", ".jpeg", ".png", ".webp"}
REPOS = ["learntech-content", "learn-tech", "bootcamps", "career", "tools"]
FORA = {"node_modules", "dist", ".git", "e2e", "relatorios", ".wrangler", "coverage"}
RAIZ = Path(__file__).resolve().parent.parent.parent


def dhash(caminho: Path):
    try:
        with Image.open(caminho) as im:
            im = ImageOps.exif_transpose(im).convert("L").resize((9, 8))
            px = list(im.tobytes())
    except Exception:
        return None
    bits = 0
    for r in range(8):
        for c in range(8):
            bits = (bits << 1) | (px[r * 9 + c] > px[r * 9 + c + 1])
    return bits


def listar(base: Path):
    for p in base.rglob("*"):
        if p.is_file() and p.suffix.lower() in EXTS and not (FORA & set(p.parts)):
            yield p


def main() -> None:
    args = sys.argv[1:]
    hd = Path(args[args.index("--hd") + 1]).resolve() if "--hd" in args else RAIZ / "hd"
    publicadas = []
    for repo in REPOS:
        if (RAIZ / repo).exists():
            for p in listar(RAIZ / repo):
                h = dhash(p)
                if h is not None:
                    publicadas.append((h, p.relative_to(RAIZ).as_posix()))
    resultado = {}
    for p in listar(hd):
        h = dhash(p)
        rel = p.relative_to(hd).as_posix()
        if h is None or not publicadas:
            resultado[rel] = None
            continue
        dist, caminho = min((bin(h ^ x).count("1"), c) for x, c in publicadas)
        resultado[rel] = {"dist": dist, "publicada": caminho}
    saida = hd / ".imagens-publicadas.json"
    saida.write_text(json.dumps({"publicadas": len(publicadas), "hd": resultado}, ensure_ascii=False), encoding="utf-8")
    print(f"{len(publicadas)} imagens publicadas, {len(resultado)} imagens no hd -> {saida}")


if __name__ == "__main__":
    main()

# Fim de hd-imagens.py
