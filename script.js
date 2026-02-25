// 1. Importe o Swup e o Head Plugin
import Swup from "https://unpkg.com/swup@4?module";
import SwupHeadPlugin from "https://unpkg.com/@swup/head-plugin@2?module";

// Variável global para o Lenis
let lenis;

// --- CONFIGURAÇÃO DO LENIS (O "motor" do scroll suave) ---
function setupLenis() {
  if (lenis) {
    lenis.destroy();
  }

  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  lenis.on("scroll", ScrollTrigger.update);

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
}

// 2. Configure o Swup com o plugin
const swup = new Swup({
  containers: ["#swup"],
  cache: false,
  plugins: [
    new SwupHeadPlugin({
      persistTags: (tag) =>
        tag.rel === "stylesheet" && tag.href.includes("style-global.css"),
    }),
  ],
});

/**
 * FUNÇÃO MESTRE: Inicializa todo o site.
 * Roda no carregamento inicial e a cada troca de página do Swup.
 */
function init() {
  console.log("🚀 Inicializando scripts...");

  // 1. REGISTRO DE PLUGINS
  gsap.registerPlugin(SplitText, CustomEase, ScrollTrigger);

  // Eases customizados
  CustomEase.create(
    "hop",
    "M0,0 C0.355,0.022 0.448,0.079 0.5,0.5 0.542,0.846 0.615,1 1,1",
  );
  CustomEase.create("menuHop", "M0,0 C0.1,0 0.2,1 1,1");

  // 2. INICIALIZAR LENIS
  setupLenis();

  // 3. EXECUÇÃO DOS MÓDULOS
  runIntroducao(); // A intro decide se roda a intro ou se chama o texto direto
  runNavegacao();
  runConhecimento();
  runFuncionalidades();
  runEfeitosScroll();
  runFormulario();

  // 4. ATUALIZAÇÃO FINAL
  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 100);
}

// --- MÓDULO 1: INTRODUÇÃO (SUA VERSÃO ORIGINAL APLICADA) ---
function runIntroducao() {
  const introducaoElement = document.querySelector(".introducao");

  // Se não tem introdução nesta página, roda a animação de texto imediatamente
  if (!introducaoElement) {
    console.log("⏩ Página sem introdução. Iniciando animações de texto.");
    iniciarAnimacoesTexto();
    return;
  }

  const body = document.body;
  const jaViuIntro =
    sessionStorage.getItem("introExecutada") || window.introConcluida;
  const navEntries = performance.getEntriesByType("navigation");
  const isReload = navEntries.length > 0 && navEntries[0].type === "reload";

  // Lógica de Bloqueio: Se já viu e não é F5, pula a intro
  if (jaViuIntro && !isReload) {
    console.log("⏩ Navegação interna detectada: Introdução suprimida.");
    introducaoElement.style.display = "none";
    body.classList.remove("lock-scroll");

    gsap.set(".testt", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    });

    iniciarAnimacoesTexto();
    return;
  }

  // Se chegou aqui, é a primeira vez ou F5
  console.log("🎬 Iniciando animação de introdução...");
  sessionStorage.setItem("introExecutada", "true");
  window.introConcluida = true;

  introducaoElement.classList.add("executar-animacao");

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

  const isMobile = window.innerWidth < 1000;
  const tags = gsap.utils.toArray(".tag");

  const tl = gsap.timeline({
    defaults: { ease: "hop" },
    onStart: () => body.classList.add("lock-scroll"),
  });

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
          // 1. Aplica os cortes instantaneamente
          gsap.set(".preloader", {
            clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)",
          });
          gsap.set(".split-overlay", {
            clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)",
          });

          // 2. Aguarda o tempo desejado (ex: 1 segundo) antes de disparar o resto
          gsap.delayedCall(0.7, () => {
            body.classList.remove("lock-scroll");
            iniciarAnimacoesTexto(); // DISPARO PERFEITO COM ATRASO
            ScrollTrigger.refresh();
          });
        },
      },
      4.5,
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
    
}

// --- MÓDULO DE ANIMAÇÕES DE TEXTO (SUA VERSÃO ORIGINAL) ---
function iniciarAnimacoesTexto() {
  const elementos = document.querySelectorAll(".split-animar");
  elementos.forEach((el) => {
    const split = new SplitText(el, { type: "chars, words" });
    gsap.set(el, { opacity: 1, visibility: "visible" });

    gsap.from(split.chars, {
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        once: true,
      },
      duration: 1,
      y: 100,
      opacity: 0,
      stagger: 0.05,
      ease: "expo.out",
      onComplete: () => {
        split.revert();
      },
    });
  });

  if (document.querySelector(".animate-me")) {
    let split = new SplitText(".animate-me", { type: "words" });
    gsap.from(split.words, {
      opacity: 0,
      duration: 0.5,
      ease: "sine.out",
      stagger: 0.1,
    });
  }

  
}

// --- MÓDULO 2: NAVEGAÇÃO ---
function runNavegacao() {
  const menuToggleBtn = document.querySelector(".menu-toggle-btn");
  if (!menuToggleBtn) return;

  const container = document.querySelector(".container");
  const menuOverlay = document.querySelector(".menu-overlay");
  const menuToggleLabel = document.querySelector(".menu-toggle-label p");
  const hamburgerIcon = document.querySelector(".menu-hamburger-icon");
  const copyContainers = document.querySelectorAll(".menu-col");

  let isMenuOpen = false;
  let isAnimating = false;
  let splitTextByContainer = [];

  copyContainers.forEach((col) => {
    const textElements = col.querySelectorAll("a, p");
    let containerSplits = [];
    textElements.forEach((element) => {
      const split = new SplitText(element, {
        type: "lines",
        linesClass: "line",
      });
      containerSplits.push(split);
      gsap.set(split.lines, { y: "-110%" });
    });
    splitTextByContainer.push(containerSplits);
  });

  const abrirMenu = () => {
    if (isAnimating || isMenuOpen) return;
    isAnimating = true;
    if (lenis) lenis.stop();

    const tl = gsap.timeline();

    // CORREÇÃO: Reseta a opacidade do container de volta a 1 antes de abrir
    gsap.set(copyContainers, { opacity: 1 });

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
      // Opacidade fica 0.25 aqui no fechamento (já corrigido na hora de abrir logo acima)
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

  document.querySelectorAll(".faq-header").forEach((h) =>
    h.addEventListener("click", () => {
      const item = h.parentElement;
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

// --- MÓDULO 6: FORMULÁRIO ---
function runFormulario() {
  const form = document.getElementById("meuFormulario");
  const inputTelefone = document.getElementById("telefone");

  if (!inputTelefone || !form) return;

  inputTelefone.addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
    value = value.replace(/(\d)(\d{4})$/, "$1-$2");
    e.target.value = value;
  });
}

// =========================================================
// CONTROLE DE CICLO DE VIDA (SWUP)
// =========================================================

if (
  document.readyState === "complete" ||
  document.readyState === "interactive"
) {
  init();
} else {
  document.addEventListener("DOMContentLoaded", init);
}

swup.hooks.on("visit:start", () => {
  if (lenis) lenis.stop();
  ScrollTrigger.getAll().forEach((t) => t.kill());
});

swup.hooks.on("content:replace", () => {
  window.scrollTo(0, 0);
  if (lenis) lenis.scrollTo(0, { immediate: true });
  init();
});
