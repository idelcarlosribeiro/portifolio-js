document.addEventListener("DOMContentLoaded", () => {
  // 1. REGISTRO DE PLUGINS E CONFIGURAÇÃO INICIAL
  gsap.registerPlugin(SplitText, CustomEase, ScrollTrigger);
  CustomEase.create("hop", ".8, 0, .3, 1");

  const body = document.body;
  const mm = gsap.matchMedia();

  // --- FUNÇÕES AUXILIARES ---
  const splitTextElements = (
    selector,
    type = "words, chars",
    addFirstChar = false
  ) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element) => {
      const split = new SplitText(element, {
        type,
        wordsClass: "word",
        charsClass: "char",
      });
      if (type.includes("chars")) {
        split.chars.forEach((char, i) => {
          char.innerHTML = `<span>${char.textContent}</span>`;
          if (addFirstChar && i === 0) char.classList.add("first-char");
        });
      }
    });
  };

  // Inicializa textos (comum a todos os dispositivos)
  splitTextElements(".intro-title h1", "words, chars", true);
  splitTextElements(".outro-title h1");
  splitTextElements(".tag p", "words");
  splitTextElements(".card h1", "words, chars", true);

  // --- BLOCO RESPONSIVO (MATCHMEDIA) ---
  mm.add(
    {
      isDesktop: "(min-width: 1000px)",
      isMobile: "(max-width: 999px)",
    },
    (context) => {
      let { isDesktop, isMobile } = context.conditions;

      // 2. CONTROLE DE SCROLL SUAVE (LENIS)
      // Otimização: Lenis apenas no Desktop para economizar bateria/CPU no mobile
      const lenis = isDesktop ? new Lenis() : null;
      if (lenis) {
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
      }

      // 3. TIMELINE DO PRELOADER (INTRODUÇÃO)
      const tl = gsap.timeline({
        defaults: { ease: "hop" },
        onStart: () => body.classList.add("lock-scroll"),
      });

      const tags = gsap.utils.toArray(".tag");

      // Estados Iniciais Adaptáveis
      gsap.set(
        [
          ".split-overlay .intro-title .first-char span",
          ".split-overlay .outro-title .char span",
        ],
        { y: "0%" }
      );
      gsap.set(".split-overlay .intro-title .first-char", {
        x: () => (isMobile ? "-10vw" : "18rem"),
        y: () => (isMobile ? "-10vw" : "-2.75rem"),
        scale: 0.75,
        fontWeight: "900",
      });
      gsap.set(".split-overlay .outro-title .char", {
        x: () => (isMobile ? "-5vw" : "-8rem"),
        fontSize: () => (isMobile ? "11vw" : "10vw"),
        fontWeight: "500",
      });

      // Sequência da Animação
      tags.forEach((tag, index) => {
        tl.to(
          tag.querySelectorAll("p .word"),
          { y: "0%", duration: 0.75 },
          0.5 + index * 0.1
        );
      });

      tl.to(
        ".preloader .intro-title .char span",
        { y: "0%", stagger: 0.05 },
        0.5
      )
        .to(
          ".preloader .intro-title .char:not(.first-char) span",
          { y: "100%", duration: 0.75, stagger: 0.05 },
          2
        )
        .to(
          ".preloader .outro-title .char span",
          { y: "0%", duration: 0.75, stagger: 0.075 },
          2.5
        )
        .to(
          ".preloader .intro-title .first-char",
          { x: () => (isMobile ? "25.5vw" : "22.25vw"), duration: 1 },
          3.5
        )
        .to(
          ".preloader .outro-title .char",
          { x: () => (isMobile ? "-9vw" : "-8rem"), duration: 1 },
          3.5
        )
        .to(
          ".preloader .intro-title .first-char",
          {
            x: () => (isMobile ? "320%" : "11.60vw"),
            y: () => (isMobile ? "-2.50vw" : "-1.80vw"),
            scale: 0.75,
            duration: 0.75,
          },
          4.5
        )
        .to(
          ".preloader .outro-title .char",
          {
            x: () => (isMobile ? "-5vw" : "-8rem"),
            fontSize: () => (isMobile ? "11vw" : "10vw"),
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
          4.5
        )
        .to(
          ".tstt",
          {
            clipPath: "polygon(0% 48%, 100% 48%, 100% 52%, 0% 52%)",
            duration: 1,
          },
          5
        );

      tags.forEach((tag, index) => {
        tl.to(
          tag.querySelectorAll("p .word"),
          { y: "100%", duration: 0.75 },
          5.5 + index * 0.1
        );
      });

      tl.to(
        [".preloader", ".split-overlay"],
        { y: (i) => (i === 0 ? "-50%" : "50%"), duration: 1 },
        6
      )
        .to(
          ".introducao",
          {
            display: "none",
            onComplete: () => {
              body.classList.remove("lock-scroll");
              iniciarAnimacoesTexto();
              ScrollTrigger.refresh();
            },
          },
          6
        )
        .to(
          ".testt",
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            duration: 1,
          },
          6
        );

      // 4. SCROLL HORIZONTAL (WRAPPER-404)
      const cardsConfig = [
        { id: "#card-1", endX: -2000, rotate: 45 },
        { id: "#card-2", endX: -1000, rotate: -30 },
        { id: "#card-3", endX: -2000, rotate: 25 },
        { id: "#card-4", endX: -1000, rotate: -30 },
      ];

      const horizontalTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".wrapper-404",
          start: "top top",
          end: () => `+=${window.innerHeight * (isMobile ? 4 : 6)}`,
          scrub: isMobile ? 0.5 : 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      });

      horizontalTl.to(
        ".wrapper-404",
        {
          x: () => (isMobile ? "-350vw" : "-260vw"),
          ease: "none",
        },
        0
      );

      cardsConfig.forEach((card) => {
        if (document.querySelector(card.id)) {
          horizontalTl.to(
            card.id,
            {
              x: () => (isMobile ? card.endX / 2 : card.endX),
              rotate: () => card.rotate * 2,
              ease: "none",
            },
            0
          );
        }
      });

      // 5. MENU OVERLAY (NAVEGAÇÃO)
      const menuBtn = document.querySelector(".menu-toggle-btn");
      const containerSite = document.querySelector(".container");
      const menuOverlay = document.querySelector(".menu-overlay");
      let isMenuOpen = false;

      const toggleMenu = () => {
        if (isMenuOpen) {
          if (lenis) lenis.start();
          gsap.to(menuOverlay, {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
            duration: 1,
            ease: "hop",
          });
          gsap.to(containerSite, { opacity: 1, duration: 1 });
        } else {
          if (lenis) lenis.stop();
          gsap.to(menuOverlay, {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            duration: 1,
            ease: "hop",
          });
          gsap.to(containerSite, { opacity: 0, duration: 0.5 });
        }
        isMenuOpen = !isMenuOpen;
      };

      menuBtn.addEventListener("click", toggleMenu);

      // Limpeza ao redimensionar
      return () => {
        if (lenis) lenis.destroy();
        menuBtn.removeEventListener("click", toggleMenu);
      };
    }
  );
});

// 6. ANIMAÇÕES DE TEXTO E SCROLL (ESTADO PÓS-INTRO)
function iniciarAnimacoesTexto() {
  // Animação de entrada genérica (Scroll-Ativo)
  gsap.utils.toArray(".split-animar").forEach((el) => {
    const split = new SplitText(el, { type: "chars" });
    gsap.from(split.chars, {
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
      y: 50,
      opacity: 0,
      stagger: 0.03,
      duration: 0.8,
      ease: "power2.out",
      onComplete: () => split.revert(),
    });
  });

  // Cards de Modelos com Stagger (Mais leve que múltiplos triggers)
  gsap.to(".card-modelos", {
    height: () => (window.innerWidth < 1000 ? "60vw" : "30vw"),
    stagger: 0.2,
    scrollTrigger: {
      trigger: ".container-cardes-modelos",
      start: "top 80%",
      toggleActions: "play none none none",
    },
  });

  // Lottie Otimizado
  const player = document.querySelector("#meuLottie");
  if (player) {
    ScrollTrigger.create({
      trigger: ".card-fucionalidade",
      start: "top 40%",
      onEnter: () => player.play(),
      once: true, // Roda apenas uma vez para economizar CPU
    });
  }
}

// 7. CONTROLE DE ABAS (CONHECIMENTO)
const abas = document.querySelectorAll(".item-menu");
const conteudos = document.querySelectorAll(".descricao-conteudo");

abas.forEach((aba) => {
  aba.addEventListener("click", (e) => {
    abas.forEach((a) => a.classList.remove("ativo"));
    conteudos.forEach((c) => c.classList.remove("visivel"));
    e.currentTarget.classList.add("ativo");
    const alvo = document.getElementById(e.currentTarget.dataset.alvo);
    if (alvo) alvo.classList.add("visivel");
  });
});

// 8. FAQ/ACCORDION
const faqs = document.querySelectorAll(".faq-header");
faqs.forEach((header) => {
  header.addEventListener("click", () => {
    const item = header.parentElement;
    item.classList.toggle("aberto");
  });
});


const scrollElements = document.querySelectorAll(
  ".scroll-rigth, .scroll-bottom, .scroll-scala"
);

scrollElements.forEach((el) => {
  ScrollTrigger.create({
    trigger: el,
    endTrigger: "body",
    start: "top 85%",
    stagger: 1,
    end: "bottom top",
    toggleClass: "scroll-ativo",
    once: true,
  });
});