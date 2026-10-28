"""gerar-capa.py: gera uma capa própria (sem imagem de terceiros) para artigos, eventos e fichas.

Uso (na raiz do learntech-content):
  python scripts/gerar-capa.py <arquivo-destino.webp> "<título>" "<rótulo>" [largura] [altura]

Exemplo:
  python scripts/gerar-capa.py media/learn-tech/blog/como-ler-uma-vaga.webp "Como ler uma vaga" "Carreira"

Gera WebP (qualidade 80, sem metadados) com gradiente da identidade do LearnTECH,
título quebrado em linhas e o rótulo acima dele. Padrão: 1600 x 900.
Requer Pillow (pip install pillow).
"""
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

FONTES = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "C:/Windows/Fonts/segoeuib.ttf",
    "C:/Windows/Fonts/arialbd.ttf",
]
TOPO = (12, 30, 54)      # azul-marinho
BASE = (7, 89, 133)      # sky-800, cor de destaque do learn-tech
DESTAQUE = (125, 211, 252)


def fonte(tamanho: int) -> ImageFont.ImageFont:
    for caminho in FONTES:
        if Path(caminho).exists():
            return ImageFont.truetype(caminho, tamanho)
    return ImageFont.load_default()


def quebrar(d: ImageDraw.ImageDraw, texto: str, f: ImageFont.ImageFont, largura_max: int) -> list[str]:
    linhas, atual = [], ""
    for palavra in texto.split():
        tentativa = f"{atual} {palavra}".strip()
        if d.textlength(tentativa, font=f) <= largura_max:
            atual = tentativa
        else:
            linhas.append(atual)
            atual = palavra
    if atual:
        linhas.append(atual)
    return linhas


def gerar(destino: Path, titulo: str, rotulo: str, largura: int = 1600, altura: int = 900) -> None:
    im = Image.new("RGB", (largura, altura))
    d = ImageDraw.Draw(im)
    for y in range(altura):
        t = y / altura
        d.line([(0, y), (largura, y)], fill=tuple(int(TOPO[i] + (BASE[i] - TOPO[i]) * t) for i in range(3)))
    margem = int(largura * 0.08)
    d.rectangle([margem, int(altura * 0.28), margem + 120, int(altura * 0.28) + 10], fill=DESTAQUE)
    d.text((margem, int(altura * 0.18)), rotulo.upper(), font=fonte(int(altura * 0.045)), fill=DESTAQUE)
    corpo = fonte(int(altura * 0.085))
    linhas = quebrar(d, titulo, corpo, largura - 2 * margem)[:4]
    y = int(altura * 0.36)
    for linha in linhas:
        d.text((margem, y), linha, font=corpo, fill=(255, 255, 255))
        y += int(altura * 0.11)
    d.text((margem, int(altura * 0.88)), "LearnTECH", font=fonte(int(altura * 0.04)), fill=(186, 230, 253))
    destino.parent.mkdir(parents=True, exist_ok=True)
    im.save(destino, "WEBP", quality=80, method=6)


if __name__ == "__main__":
    if len(sys.argv) < 4:
        print(__doc__)
        sys.exit(1)
    largura = int(sys.argv[4]) if len(sys.argv) > 4 else 1600
    altura = int(sys.argv[5]) if len(sys.argv) > 5 else 900
    gerar(Path(sys.argv[1]), sys.argv[2], sys.argv[3], largura, altura)
    print(f"ok {sys.argv[1]}")
