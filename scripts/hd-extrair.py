"""hd-extrair.py: extração do hd para o triador (fase 1 do fluxo de agentes, issue #16).

Uso (na raiz do learntech-content):
  python scripts/hd-extrair.py                  # extrai os arquivos de todos os itens do acervo
  python scripts/hd-extrair.py --item HD-0007   # só um item (pode repetir --item)
  python scripts/hd-extrair.py --marcar         # itens "novo" com tudo extraído passam a "extraido"
  python scripts/hd-extrair.py --hd <pasta>

Saída em <hd>/.extraido/, fora do git (o hd não é versionado):
  <sha256>.json   { sha256, ext, bytes, palavras, texto, imagem }   texto limitado a 20 mil caracteres
  indice.json     { item: { origem, arquivos: [{ sha256, ext, bytes, caminho }] } }   caminho relativo ao hd

Regras:
  - texto de pdf (pdftotext, se instalado), docx, xlsx, pptx (XML do pacote), html, txt, md, csv e json;
  - imagem: largura, altura, formato, data e câmera do EXIF. Nunca a localização (GPS) nem outros campos;
  - é incremental: um arquivo já extraído (mesmo sha256) não é lido de novo;
  - o acervo continua sem nome nem conteúdo de arquivo: o texto extraído fica só no hd.
Requer Pillow (pip install pillow) para imagens; pdftotext é opcional.
"""
import html
import json
import re
import shutil
import subprocess
import sys
import zipfile
from datetime import date
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
LIMITE_TEXTO = 20000
TEXTO_PURO = {"txt", "md", "csv", "json", "xml", "css", "js"}
IMAGEM = {"jpg", "jpeg", "png", "webp", "gif"}
EXIF_PERMITIDO = {306: "data", 36867: "data", 271: "fabricante", 272: "modelo"}  # nunca 34853 (GPSInfo)


def ler_zip(caminho: Path, padrao: str) -> str:
    partes = []
    with zipfile.ZipFile(caminho) as z:
        for nome in sorted(z.namelist()):
            if re.search(padrao, nome):
                partes.append(re.sub(r"<[^>]+>", " ", z.read(nome).decode("utf-8", "ignore")))
    return html.unescape(" ".join(partes))


def extrair_texto(caminho: Path, ext: str) -> str:
    try:
        if ext == "docx":
            return ler_zip(caminho, r"^word/document\.xml$")
        if ext == "xlsx":
            return ler_zip(caminho, r"^xl/sharedStrings\.xml$")
        if ext == "pptx":
            return ler_zip(caminho, r"^ppt/slides/slide\d+\.xml$")
        if ext == "pdf":
            if not shutil.which("pdftotext"):
                return ""
            r = subprocess.run(["pdftotext", "-l", "30", str(caminho), "-"], capture_output=True, timeout=60)
            return r.stdout.decode("utf-8", "ignore")
        if ext in ("html", "htm"):
            bruto = caminho.read_text(encoding="utf-8", errors="ignore")
            bruto = re.sub(r"(?is)<(script|style)[^>]*>.*?</\1>", " ", bruto)
            return html.unescape(re.sub(r"<[^>]+>", " ", bruto))
        if ext in TEXTO_PURO:
            return caminho.read_text(encoding="utf-8", errors="ignore")
    except (OSError, zipfile.BadZipFile, subprocess.SubprocessError, KeyError):
        return ""
    return ""


def extrair_imagem(caminho: Path):
    try:
        from PIL import Image
    except ImportError:
        return None
    try:
        with Image.open(caminho) as im:
            meta = {"largura": im.width, "altura": im.height, "formato": im.format}
            exif = im.getexif()
            for tag, campo in EXIF_PERMITIDO.items():
                valor = exif.get(tag)
                if valor and campo not in meta:
                    meta[campo] = str(valor).strip()
            return meta
    except OSError:
        return None


def args():
    a = sys.argv[1:]
    hd = Path(a[a.index("--hd") + 1]) if "--hd" in a else RAIZ.parent / "hd"
    itens = {a[i + 1] for i, v in enumerate(a) if v == "--item"}
    return hd.resolve(), itens, "--marcar" in a


def main() -> None:
    hd, so_itens, marcar = args()
    if not hd.is_dir():
        sys.exit(f"hd não encontrado em {hd}")
    saida = hd / ".extraido"
    saida.mkdir(exist_ok=True)
    acervo_arq = RAIZ / "content" / "acervo.json"
    acervo = json.loads(acervo_arq.read_text(encoding="utf-8"))
    cache = json.loads((hd / ".hash-cache.json").read_text(encoding="utf-8"))
    caminho_de = {}
    for chave, sha in cache.items():
        rel = chave.split("|")[0]
        if (hd / rel).is_file():
            caminho_de.setdefault(sha, rel)

    indice, novos, faltam_por_item = {}, 0, {}
    for item in acervo["itens"]:
        if so_itens and item["id"] not in so_itens:
            continue
        lista, faltam = [], 0
        for f in item.get("arquivos", []):
            rel = caminho_de.get(f["sha256"])
            if not rel:
                faltam += 1
                continue
            lista.append({"sha256": f["sha256"], "ext": f["ext"], "bytes": f["bytes"], "caminho": rel})
            destino = saida / f"{f['sha256']}.json"
            if destino.exists():
                continue
            arq = hd / rel
            texto = "" if f["ext"] in IMAGEM else extrair_texto(arq, f["ext"])
            texto = re.sub(r"\s+", " ", texto).strip()
            registro = {
                "sha256": f["sha256"], "ext": f["ext"], "bytes": f["bytes"],
                "palavras": len(texto.split()), "texto": texto[:LIMITE_TEXTO],
                "imagem": extrair_imagem(arq) if f["ext"] in IMAGEM else None,
            }
            destino.write_text(json.dumps(registro, ensure_ascii=False), encoding="utf-8")
            novos += 1
        indice[item["id"]] = {"origem": item.get("origem"), "arquivos": lista}
        faltam_por_item[item["id"]] = faltam

    arq_indice = saida / "indice.json"
    anterior = json.loads(arq_indice.read_text(encoding="utf-8")) if arq_indice.exists() else {}
    anterior.update(indice)
    arq_indice.write_text(json.dumps(anterior, ensure_ascii=False), encoding="utf-8")

    marcados = 0
    if marcar:
        hoje = date.today().isoformat()
        for item in acervo["itens"]:
            if item["id"] in indice and item["estado"] == "novo" and faltam_por_item[item["id"]] == 0 and item.get("arquivos"):
                item["estado"] = "extraido"
                item.setdefault("etapas", []).append({"estado": "extraido", "em": hoje, "por": "triador"})
                marcados += 1
        if marcados:
            texto = json.dumps(acervo, ensure_ascii=False, indent=2) + "\n"
            acervo_arq.write_text(texto.replace("\n", "\r\n"), encoding="utf-8", newline="")

    total = sum(len(v["arquivos"]) for v in indice.values())
    sem_caminho = sum(faltam_por_item.values())
    print(f"{len(indice)} itens, {total} arquivos no índice, {novos} extraídos agora, {sem_caminho} sem arquivo no hd")
    if marcar:
        print(f"{marcados} item(ns) passaram de novo para extraido")
    print(f"Saída: {saida}")


if __name__ == "__main__":
    main()

# Fim de hd-extrair.py
