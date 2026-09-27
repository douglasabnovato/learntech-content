/* identificacao.js — script único de identificação dos sites LearnTECH.
 * Uso: <script src="https://SUA-API/sdk/identificacao.js" data-projeto="tools" defer></script>
 * Pede nome completo e e-mail uma vez por navegador, guarda no próprio navegador e registra um acesso por sessão
 * (projeto, página e horário) em POST /v1/acessos. Não é login: não há senha nem conta.
 * Atributos opcionais: data-api, data-privacidade, data-obrigatorio="false", data-turnstile-sitekey. */
(function () {
  "use strict";

  var script = document.currentScript;
  if (!script || window.LearnTECH) return;

  var projeto = script.getAttribute("data-projeto") || "";
  var api = (script.getAttribute("data-api") || new URL(script.src, location.href).origin).replace(/\/$/, "");
  var privacidade = script.getAttribute("data-privacidade") || "https://learn-tech-pied.vercel.app/privacy";
  var obrigatorio = script.getAttribute("data-obrigatorio") !== "false";
  var siteKey = script.getAttribute("data-turnstile-sitekey") || "";
  var CHAVE = "learntech:identificacao";
  var SESSAO = "learntech:sessao:" + projeto;
  var PROJETOS = ["learn-tech", "bootcamps", "career", "tools"];

  if (PROJETOS.indexOf(projeto) === -1) {
    console.warn("[LearnTECH] data-projeto inválido:", projeto);
    return;
  }

  /* Leitura e escrita protegidas: navegação privada ou armazenamento bloqueado não podem quebrar o site. */
  function ler(area, chave) {
    try { return window[area].getItem(chave); } catch (e) { return null; }
  }
  function gravar(area, chave, valor) {
    try { valor === null ? window[area].removeItem(chave) : window[area].setItem(chave, valor); } catch (e) { /* sem armazenamento */ }
  }

  /* Devolve a identificação guardada, ou null se ausente ou corrompida. */
  function identificacao() {
    try {
      var d = JSON.parse(ler("localStorage", CHAVE) || "null");
      return d && typeof d.nome === "string" && typeof d.email === "string" ? d : null;
    } catch (e) { return null; }
  }

  /* Carrega o Turnstile sob demanda e devolve um token (ou undefined quando não configurado). */
  var turnstilePronto = null;
  function tokenTurnstile() {
    if (!siteKey) return Promise.resolve(undefined);
    if (!turnstilePronto) {
      turnstilePronto = new Promise(function (ok) {
        var s = document.createElement("script");
        s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        s.async = true;
        s.onload = function () { ok(); };
        s.onerror = function () { ok(); };
        document.head.appendChild(s);
      });
    }
    return turnstilePronto.then(function () {
      return new Promise(function (ok) {
        if (!window.turnstile) return ok(undefined);
        var caixa = document.createElement("div");
        caixa.style.cssText = "position:fixed;bottom:16px;right:16px;z-index:2147483647";
        document.body.appendChild(caixa);
        window.turnstile.render(caixa, {
          sitekey: siteKey,
          appearance: "interaction-only",
          callback: function (t) { ok(t); setTimeout(function () { caixa.remove(); }, 0); },
          "error-callback": function () { ok(undefined); caixa.remove(); },
        });
      });
    });
  }

  /* Envia o registro de acesso; 400 significa identificação guardada inválida, então ela é descartada. */
  function registrar(dados) {
    return tokenTurnstile().then(function (token) {
      return fetch(api + "/v1/acessos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({ nome: dados.nome, email: dados.email, projeto: projeto, pagina: location.pathname + location.hash, turnstileToken: token }),
      });
    }).then(function (r) {
      if (r.ok) gravar("sessionStorage", SESSAO, "1");
      if (r.status === 400) gravar("localStorage", CHAVE, null);
      return r;
    }).catch(function () { return null; });
  }

  var ESTILO = [
    ":host{all:initial}",
    ".fundo{position:fixed;inset:0;z-index:2147483646;background:rgba(15,23,42,.55);display:flex;align-items:center;justify-content:center;padding:16px;font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif}",
    ".caixa{--fundo:#fff;--texto:#0f172a;--suave:#475569;--borda:#cbd5e1;--marca:#075985;background:var(--fundo);color:var(--texto);width:100%;max-width:440px;border-radius:16px;padding:24px;box-shadow:0 20px 50px rgba(0,0,0,.25);box-sizing:border-box}",
    "@media (prefers-color-scheme:dark){.caixa{--fundo:#0f172a;--texto:#f1f5f9;--suave:#94a3b8;--borda:#334155;--marca:#38bdf8}}",
    "h2{margin:0 0 8px;font-size:20px;line-height:1.3}",
    "p{margin:0 0 16px;font-size:14px;line-height:1.55;color:var(--suave)}",
    "label{display:block;font-size:13px;font-weight:600;margin:0 0 6px}",
    "input{width:100%;box-sizing:border-box;font:inherit;font-size:15px;padding:10px 12px;border-radius:10px;border:1px solid var(--borda);background:transparent;color:var(--texto);margin:0 0 14px}",
    "input:focus{outline:2px solid var(--marca);outline-offset:1px}",
    ".erro{color:#dc2626;font-size:13px;min-height:18px;margin:-6px 0 10px}",
    ".acoes{display:flex;gap:8px;flex-wrap:wrap;align-items:center}",
    "button{font:inherit;font-size:15px;font-weight:600;border:0;border-radius:10px;padding:10px 18px;cursor:pointer}",
    ".enviar{background:var(--marca);color:#fff}",
    "@media (prefers-color-scheme:dark){.enviar{color:#0f172a}}",
    ".depois{background:transparent;color:var(--suave)}",
    ".nota{font-size:12px;margin:14px 0 0}",
    "a{color:var(--marca)}",
  ].join("");

  /* Monta o formulário em Shadow DOM (isolado do CSS do site) e resolve quando a pessoa se identifica. */
  function mostrarFormulario() {
    if (document.getElementById("learntech-identificacao")) return;
    var host = document.createElement("div");
    host.id = "learntech-identificacao";
    var raiz = host.attachShadow({ mode: "open" });
    var atual = identificacao() || { nome: "", email: "" };
    raiz.innerHTML =
      '<style>' + ESTILO + '</style>' +
      '<div class="fundo"><form class="caixa" role="dialog" aria-modal="true" aria-labelledby="lt-titulo" aria-describedby="lt-texto" novalidate>' +
      '<h2 id="lt-titulo">Boas-vindas ao LearnTECH</h2>' +
      '<p id="lt-texto">Todo o conteúdo é gratuito e não tem cadastro nem senha. Pedimos só seu nome e e-mail para saber quantas pessoas usam e quem são: essa identificação nos ajuda a aperfeiçoar o conteúdo.</p>' +
      '<label for="lt-nome">Nome completo</label><input id="lt-nome" name="nome" autocomplete="name" required maxlength="120">' +
      '<label for="lt-email">E-mail</label><input id="lt-email" name="email" type="email" autocomplete="email" required maxlength="254">' +
      '<div class="erro" role="alert"></div>' +
      '<div class="acoes"><button type="submit" class="enviar">Continuar</button>' +
      (obrigatorio ? "" : '<button type="button" class="depois">Agora não</button>') + "</div>" +
      '<p class="nota">Guardamos nome, e-mail, site, página e horário do acesso por até 12 meses. Não enviamos propaganda nem compartilhamos com terceiros. <a target="_blank" rel="noopener" href="' + privacidade + '">Política de privacidade</a>.</p>' +
      "</form></div>";

    var form = raiz.querySelector("form");
    var nome = raiz.getElementById("lt-nome");
    var email = raiz.getElementById("lt-email");
    var erro = raiz.querySelector(".erro");
    var enviar = raiz.querySelector(".enviar");
    nome.value = atual.nome;
    email.value = atual.email;

    var overflowAnterior = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.appendChild(host);
    setTimeout(function () { nome.focus(); }, 0);

    /* Fecha o formulário e devolve a rolagem da página. */
    function fechar() {
      document.documentElement.style.overflow = overflowAnterior;
      host.remove();
    }

    /* Mantém o foco do teclado dentro do diálogo. */
    form.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape" && !obrigatorio) return fechar();
      if (ev.key !== "Tab") return;
      var focaveis = form.querySelectorAll("input,button,a");
      var primeiro = focaveis[0];
      var ultimo = focaveis[focaveis.length - 1];
      if (ev.shiftKey && raiz.activeElement === primeiro) { ev.preventDefault(); ultimo.focus(); }
      else if (!ev.shiftKey && raiz.activeElement === ultimo) { ev.preventDefault(); primeiro.focus(); }
    });

    var depois = raiz.querySelector(".depois");
    if (depois) depois.addEventListener("click", fechar);

    /* Valida no navegador, grava localmente e registra o acesso. */
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var n = nome.value.trim().replace(/\s+/g, " ");
      var e = email.value.trim().toLowerCase();
      if (n.split(" ").length < 2) { erro.textContent = "Informe nome e sobrenome."; nome.focus(); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) { erro.textContent = "Informe um e-mail válido."; email.focus(); return; }
      erro.textContent = "";
      enviar.disabled = true;
      var dados = { nome: n, email: e };
      registrar(dados).then(function (r) {
        enviar.disabled = false;
        if (r && r.status === 400) { erro.textContent = "Confira nome e e-mail."; return; }
        gravar("localStorage", CHAVE, JSON.stringify(dados));
        fechar();
      });
    });
  }

  /* Decide entre registrar direto (já identificado) ou pedir a identificação. */
  function iniciar() {
    var dados = identificacao();
    if (!dados) return mostrarFormulario();
    if (ler("sessionStorage", SESSAO) !== "1") registrar(dados);
  }

  window.LearnTECH = {
    trocarIdentificacao: mostrarFormulario,
    esquecer: function () { gravar("localStorage", CHAVE, null); gravar("sessionStorage", SESSAO, null); },
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})();
/* Fim de identificacao.js */
