"""hd-imagens.py — acha, para cada imagem do hd, a imagem publicada mais parecida (dHash 8x8).

Uso (na raiz do learntech-content):
  python scripts/hd-imagens.py            # hd em ../hd e repositórios irmãos em ..
  python scripts/hd-imagens.py --hd <pasta>

Compara com as imagens publicadas nos cinco repositórios (learntech-content, learn-tech, bootcamps, career, tools).
Distância até 5 (de 64) = a mesma imagem; de 6 a 10 = provável (tratada ou recortada).
Grava <hd>/.imagens-publicadas.json, fora do git, lido por `npm run hd:uso`.
Cache do dHash em <hd>/.dhash-cache.json (caminho + tamanho + data): só recalcula imagem nova ou alterada.
Requer Pillow.
"""
import json
import os
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


def com_cache(antigo: dict, novo: dict, caminho: Path):
    """dHash pelo cache (caminho + tamanho + data); só abre a imagem se ela for nova ou tiver mudado."""
    st = caminho.stat()
    chave = f"{caminho.as_posix()}|{st.st_size}|{st.st_mtime_ns}"
    novo[chave] = antigo[chave] if chave in antigo else dhash(caminho)
    return novo[chave]


def listar(base: Path):
    """Imagens da pasta, sem entrar em node_modules, dist e afins (o rglob entrava e gastava quase todo o tempo)."""
    for raiz, pastas, arquivos in os.walk(base):
        pastas[:] = [d for d in pastas if d not in FORA]
        for nome in arquivos:
            if Path(nome).suffix.lower() in EXTS:
                yield Path(raiz) / nome


def main() -> None:
    args = sys.argv[1:]
    hd = Path(args[args.index("--hd") + 1]).resolve() if "--hd" in args else RAIZ / "hd"
    arq_cache = hd / ".dhash-cache.json"
    antigo = json.loads(arq_cache.read_text(encoding="utf-8")) if arq_cache.exists() else {}
    cache = {}
    publicadas = []
    for repo in REPOS:
        if (RAIZ / repo).exists():
            for p in listar(RAIZ / repo):
                h = com_cache(antigo, cache, p)
                if h is not None:
                    publicadas.append((h, p.relative_to(RAIZ).as_posix()))
    resultado = {}
    for p in listar(hd):
        h = com_cache(antigo, cache, p)
        rel = p.relative_to(hd).as_posix()
        if h is None or not publicadas:
            resultado[rel] = None
            continue
        dist, caminho = min((bin(h ^ x).count("1"), c) for x, c in publicadas)
        resultado[rel] = {"dist": dist, "publicada": caminho}
    arq_cache.write_text(json.dumps(cache), encoding="utf-8")
    saida = hd / ".imagens-publicadas.json"
    saida.write_text(json.dumps({"publicadas": len(publicadas), "hd": resultado}, ensure_ascii=False), encoding="utf-8")
    print(f"{len(publicadas)} imagens publicadas, {len(resultado)} imagens no hd -> {saida}")


if __name__ == "__main__":
    main()

# Fim de hd-imagens.py
