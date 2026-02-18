// 1. Importe o Swup e o Head Plugin
import Swup from "https://unpkg.com/swup@4?module";
import SwupHeadPlugin from "https://unpkg.com/@swup/head-plugin@2?module";

// 2. Configure o Swup com o plugin
const swup = new Swup({
  containers: ["#swup"],
  cache: false,
  plugins: [
    new SwupHeadPlugin({
      // Isso diz ao plugin para persistir (NÃO remover) o CSS principal,
      // mas trocar os outros. Ajuste conforme necessário.
      // Se quiser trocar tudo, pode deixar vazio: new SwupHeadPlugin()
      persistTags: (tag) =>
        tag.rel === "stylesheet" && tag.href.includes("style-global.css"),
    }),
  ],
});

// Variável global para o Lenis
let lenis;

/**
 * FUNÇÃO MESTRE: Inicializa todo o site.
 * Roda no carregamento inicial e a cada troca de página do Swup.
 */
function init() {
  console.log("🚀 Inicializando scripts...");

  // 1. REGISTRO DE PLUGINS E EASES
  gsap.registerPlugin(SplitText, CustomEase, ScrollTrigger);
  CustomEase.create("hop", ".8, 0, .3, 1");
  CustomEase.create("menuHop", ".87, 0, .13, 1");

  // 2. CONFIGURAÇÃO DO LENIS (Scroll Suave)
  if (lenis) lenis.destroy();

  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
  });

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.remove(lenisRaf);
  gsap.ticker.add(lenisRaf);
  gsap.ticker.lagSmoothing(0);

  // 3. EXECUÇÃO DOS MÓDULOS
  runIntroducao();
  runNavegacao();
  runConhecimento();
  runFuncionalidades();
  runEfeitosScroll();

  // 4. ATUALIZAÇÃO FINAL
  ScrollTrigger.refresh();
}

function lenisRaf(time) {
  if (lenis) lenis.raf(time * 1000);
}

// --- MÓDULO 1: INTRODUÇÃO (VERSÃO "UMA VEZ POR SESSÃO") ---
function runIntroducao() {
  const introducaoElement = document.querySelector(".introducao");
  if (!introducaoElement) return;

  const body = document.body;

  // Verifica se já rodou nesta aba (sessionStorage) ou nesta navegação (window)
  const jaViuIntro =
    sessionStorage.getItem("introExecutada") || window.introConcluida;
  const navEntries = performance.getEntriesByType("navigation");
  const isReload = navEntries.length > 0 && navEntries[0].type === "reload";

  // Lógica de Bloqueio: Se já viu e não é F5, pula a intro
  if (jaViuIntro && !isReload) {
    console.log("⏩ Navegação interna detectada: Introdução suprimida.");
    introducaoElement.style.display = "none";
    body.classList.remove("lock-scroll");

    // Força o estado final dos elementos da página
    gsap.set(".testt", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    });

    iniciarAnimacoesTexto();
    return; // Encerra a função aqui
  }

  // Se chegou aqui, é a primeira vez ou F5
  console.log("🎬 Iniciando animação de introdução...");
  sessionStorage.setItem("introExecutada", "true");
  window.introConcluida = true; // Trava para trocas de página via Swup

  introducaoElement.classList.add("executar-animacao");

  // Helpers de SplitText
  const splitTextElements = (
    selector,
    type = "words, chars",
    addFirstChar = false,
  ) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element) => {
      const splitText = new SplitText(element, {
        type,
        wordsClass: "word",
        charsClass: "char",
      });
      if (type.includes("chars")) {
        splitText.chars.forEach((char, index) => {
          char.innerHTML = `<span>${char.textContent}</span>`;
          if (addFirstChar && index === 0) char.classList.add("first-char");
        });
      }
    });
  };

  splitTextElements(".intro-title h1", "words, chars", true);
  splitTextElements(".outro-title h1");
  splitTextElements(".tag p", "words");
  splitTextElements(".card h1", "words, chars", true);

  const isMobile = window.innerWidth < 1000;
  const tags = gsap.utils.toArray(".tag");

  const tl = gsap.timeline({
    defaults: { ease: "hop" },
    onStart: () => body.classList.add("lock-scroll"),
  });

  // Configuração inicial
  gsap.set(
    [
      ".split-overlay .intro-title .first-char span",
      ".split-overlay .outro-title .char span",
    ],
    { y: "0%" },
  );
  gsap.set(".split-overlay .intro-title .first-char", {
    x: isMobile ? "-10vw" : "18rem",
    y: isMobile ? "-10vw" : "-2.75rem",
    fontWeight: "900",
    scale: 0.75,
  });
  gsap.set(".split-overlay .outro-title .char", {
    x: isMobile ? "-5vw" : "-8rem",
    fontSize: isMobile ? "11vw" : "10vw",
    fontWeight: "500",
  });

  // Sequência da Animação
  tags.forEach((tag, index) => {
    tl.to(
      tag.querySelectorAll("p .word"),
      { y: "0%", duration: 0.75 },
      0.5 + index * 0.1,
    );
  });

  tl.to(".preloader .intro-title .char span", { y: "0%", stagger: 0.05 }, 0.5)
    .to(
      ".preloader .intro-title .char:not(.first-char) span",
      { y: "100%", duration: 0.75, stagger: 0.05 },
      2,
    )
    .to(
      ".preloader .outro-title .char span",
      { y: "0%", duration: 0.75, stagger: 0.075 },
      2.5,
    )
    .to(
      ".preloader .intro-title .first-char",
      { x: isMobile ? "25.50vw" : "22.25vw", duration: 1 },
      3.5,
    )
    .to(
      ".preloader .outro-title .char",
      { x: isMobile ? "-9vw" : "-8rem", duration: 1 },
      3.5,
    )
    .to(
      ".preloader .intro-title .first-char",
      {
        x: isMobile ? "320%" : "11.60vw",
        y: isMobile ? "-2.50vw" : "-1.80vw",
        scale: 0.75,
        duration: 0.75,
      },
      4.5,
    )
    .to(
      ".preloader .outro-title .char",
      {
        x: isMobile ? "-5vw" : "-8rem",
        fontSize: isMobile ? "11vw" : "10vw",
        fontWeight: "500",
        duration: 0.75,
        onComplete: () => {
          gsap.set(".preloader", {
            clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)",
          });
          gsap.set(".split-overlay", {
            clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)",
          });
        },
      },
      4.5,
    )
    .to(
      ".tstt",
      {
        clipPath: "polygon(0% 48%, 100% 48%, 100% 52%, 0% 52%)",
        duration: 1,
        onComplete: () => {
          body.classList.remove("lock-scroll");
          iniciarAnimacoesTexto();
          ScrollTrigger.refresh();
        },
      },
      5,
    );

  tags.forEach((tag, index) => {
    tl.to(
      tag.querySelectorAll("p .word"),
      { y: "100%", duration: 0.75 },
      5.5 + index * 0.1,
    );
  });

  tl.to(
    [".preloader", ".split-overlay"],
    { y: (i) => (i === 0 ? "-50%" : "50%"), duration: 1 },
    6,
  )
    .to(".introducao", { display: "none", duration: 1 }, 6)
    .to(
      ".testt",
      { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", duration: 1 },
      6,
    );
}

function iniciarAnimacoesTexto() {
  const elementos = document.querySelectorAll(".split-animar");
  elementos.forEach((el) => {
    const split = new SplitText(el, { type: "chars, words" });
    gsap.set(el, { opacity: 1, visibility: "visible" });
    gsap.from(split.chars, {
      scrollTrigger: { trigger: el, start: "top 85%", once: true },
      duration: 1,
      y: 100,
      opacity: 0,
      stagger: 0.05,
      ease: "expo.out",
      onComplete: () => split.revert(),
    });
  });

  // Texto Webflow e Animate-me
  document.fonts.ready.then(() => {
    if (document.querySelector(".animate-me")) {
      let split = SplitText.create(".animate-me", {
        type: "words",
        aria: "hidden",
      });
      gsap.from(split.words, {
        opacity: 0,
        duration: 0.5,
        ease: "sine.out",
        stagger: 0.1,
      });
    }
  });

  gsap.from(".texto-webflow", { opacity: 0, x: 100, duration: 1 });
}

// --- MÓDULO 2: NAVEGAÇÃO ---
function runNavegacao() {
  const menuToggleBtn = document.querySelector(".menu-toggle-btn");
  if (!menuToggleBtn) return;

  const container = document.querySelector(".container");
  const menuOverlay = document.querySelector(".menu-overlay");
  const menuOverlayContainer = document.querySelector(".menu-overlay-content");
  const menuMediaWrapper = document.querySelector(".menu-media-warapper");
  const copyContainers = document.querySelectorAll(".menu-col");
  const menuToggleLabel = document.querySelector(".menu-toggle-label p");
  const hamburgerIcon = document.querySelector(".menu-hamburger-icon");

  let isMenuOpen = false;
  let isAnimating = false;
  let splitTextByContainer = [];

  copyContainers.forEach((container) => {
    const textElements = container.querySelectorAll("a, p");
    let containerSplits = [];
    textElements.forEach((element) => {
      const split = SplitText.create(element, {
        type: "lines",
        linesClass: "line",
      });
      containerSplits.push(split);
      gsap.set(split.lines, { y: "-110%" });
    });
    splitTextByContainer.push(containerSplits);
  });

  const fecharMenu = () => {
    if (isAnimating || !isMenuOpen) return;
    isAnimating = true;
    hamburgerIcon.classList.remove("active");

    const tl = gsap.timeline();
    tl.to(container, { opacity: 1, duration: 0.9, ease: "menuHop" })
      .to(
        menuOverlay,
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
          duration: 1,
          ease: "menuHop",
        },
        "<",
      )
      .to(menuToggleLabel, { y: "0%", duration: 1, ease: "menuHop" }, "<")
      .to(copyContainers, { opacity: 0.25, duration: 1, ease: "menuHop" }, "<")
      .call(() => {
        splitTextByContainer.forEach((splits) => {
          const lines = splits.flatMap((s) => s.lines);
          gsap.set(lines, { y: "-110%" });
        });
        isAnimating = false;
        isMenuOpen = false;
        if (lenis) lenis.start();
      });
  };

  const abrirMenu = () => {
    if (isAnimating || isMenuOpen) return;
    isAnimating = true;
    if (lenis) lenis.stop();

    const tl = gsap.timeline();
    tl.to(menuToggleLabel, { y: "-110%", duration: 1, ease: "menuHop" }).to(
      menuOverlay,
      {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 1,
        ease: "menuHop",
      },
      "<",
    );

    splitTextByContainer.forEach((splits) => {
      const lines = splits.flatMap((s) => s.lines);
      tl.to(
        lines,
        { y: "0%", duration: 2, ease: "menuHop", stagger: -0.075 },
        -0.15,
      );
    });

    hamburgerIcon.classList.add("active");
    tl.call(() => {
      isAnimating = false;
      isMenuOpen = true;
    });
  };

  menuToggleBtn.addEventListener("click", () =>
    isMenuOpen ? fecharMenu() : abrirMenu(),
  );
  copyContainers.forEach((col) => col.addEventListener("click", fecharMenu));
}

// --- MÓDULO 3: ABAS CONHECIMENTO ---
function runConhecimento() {
  const abas = document.querySelectorAll(".item-menu");
  const conteudos = document.querySelectorAll(".descricao-conteudo");
  if (abas.length === 0) return;

  abas.forEach((aba) => {
    aba.addEventListener("click", (event) => {
      abas.forEach((a) => a.classList.remove("ativo"));
      conteudos.forEach((c) => c.classList.remove("visivel"));
      event.currentTarget.classList.add("ativo");
      document
        .getElementById(event.currentTarget.dataset.alvo)
        ?.classList.add("visivel");
    });
  });
}

// --- MÓDULO 4: FUNCIONALIDADES & CARDS ---
function runFuncionalidades() {
  const wrapper = document.querySelector(".wrapper-404");
  if (wrapper) {
    const cards = [
      { id: "#card-1", endX: -2000, rotate: 45 },
      { id: "#card-2", endX: -1000, rotate: -30 },
      { id: "#card-3", endX: -2000, rotate: 25 },
      { id: "#card-4", endX: -1000, rotate: -30 },
    ];
    const mainTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".wrapper-404",
        start: "top top",
        end: () => `+=${window.innerHeight * 6}`,
        scrub: 1,
        pin: true,
        invalidateOnRefresh: true,
      },
    });
    mainTl.to(".wrapper-404", { x: () => `-${260}vw`, ease: "none" }, 0);
    cards.forEach((card) => {
      if (document.querySelector(card.id)) {
        mainTl.to(
          card.id,
          { x: () => card.endX, rotate: () => card.rotate * 2, ease: "none" },
          0,
        );
      }
    });
  }

  const player = document.querySelector("#meuLottie");
  if (player) {
    ScrollTrigger.create({
      trigger: ".card-fucionalidade",
      start: "top 40%",
      end: "top top",
      onEnter: () => player.play(),
      onEnterBack: () => player.play(),
      onLeaveBack: () => player.stop(),
    });
  }

  document
    .querySelectorAll(".cards-perguntas h3")
    .forEach((h) =>
      h.addEventListener("click", () =>
        h.parentElement.classList.toggle("ocultar"),
      ),
    );
  document.querySelectorAll(".faq-header").forEach((h) =>
    h.addEventListener("click", () => {
      const item = h.parentElement;
      document
        .querySelectorAll(".faq-item")
        .forEach((o) => o !== item && o.classList.remove("aberto"));
      item.classList.toggle("aberto");
    }),
  );
}

// --- MÓDULO 5: EFEITOS DE SCROLL ---
function runEfeitosScroll() {
  document
    .querySelectorAll(".scroll-rigth, .scroll-bottom, .scroll-scala")
    .forEach((el) => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        toggleClass: "scroll-ativo",
        once: true,
      });
    });

  if (document.querySelector(".container-texto-trajetoria")) {
    gsap.to(".texto-trajetoria", {
      top: "50%",
      scrollTrigger: {
        trigger: ".container-texto-trajetoria",
        start: "top 70%",
        end: "bottom top",
        scrub: 1,
      },
    });
  }
}

// =========================================================
// CONTROLE DE CICLO DE VIDA (SWUP)
// =========================================================

// 1. CARREGAMENTO INICIAL
if (
  document.readyState === "complete" ||
  document.readyState === "interactive"
) {
  init();
} else {
  document.addEventListener("DOMContentLoaded", init);
}

// 2. LIMPEZA ANTES DE SAIR DA PÁGINA
swup.hooks.on("visit:start", () => {
  ScrollTrigger.killAll(); // Remove todos os gatilhos antigos
});

// 3. REINICIALIZAÇÃO QUANDO A PÁGINA TROCA
swup.hooks.on("content:replace", () => {
  window.scrollTo(0, 0);
  init(); // Roda toda a lógica novamente para o novo HTML
});
