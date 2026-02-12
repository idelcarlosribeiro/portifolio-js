gsap.registerPlugin(ScrollTrigger);

//introdução
document.addEventListener("DOMContentLoaded", () => {
  // 1. Configurações Iniciais
  gsap.registerPlugin(SplitText, CustomEase, ScrollTrigger);
  CustomEase.create("hop", ".8, 0, .3, 1");

  const body = document.body;
  const introducaoElement = document.querySelector(".introducao");

  // 2. Verificação: Já viu nesta sessão? É um Refresh (F5)?
  const jaViuIntro = sessionStorage.getItem("introExecutada");
  const navEntries = performance.getEntriesByType("navigation");
  const isReload = navEntries.length > 0 && navEntries[0].type === "reload";

  // --- FUNÇÃO AUXILIAR DE SPLIT ---
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
          const originalText = char.textContent;
          char.innerHTML = `<span>${originalText}</span>`;
          if (addFirstChar && index === 0) char.classList.add("first-char");
        });
      }
    });
  };

  // --- LÓGICA DE DECISÃO ---

  if (jaViuIntro && !isReload) {
    // >>> CASO: VOLTANDO DE OUTRA PÁGINA (Pula a intro) <<<
    console.log("⏩ Navegação interna detectada: Ocultando introdução.");

    if (introducaoElement) introducaoElement.style.display = "none";
    body.classList.remove("lock-scroll");

    // Força o estado final do seu conteúdo principal
    gsap.set(".testt", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    });

    iniciarAnimacoesTexto();
    ScrollTrigger.refresh();
  } else {
    // >>> CASO: PRIMEIRA VEZ OU F5 (Roda a intro) <<<
    console.log("🎬 Primeira visita ou Refresh: Iniciando animação.");

    // Marca que já foi executada
    sessionStorage.setItem("introExecutada", "true");

    // Torna a intro visível para a animação começar
    if (introducaoElement) {
      introducaoElement.classList.add("executar-animacao");
    }

    // Prepara os textos
    splitTextElements(".intro-title h1", "words, chars", true);
    splitTextElements(".outro-title h1");
    splitTextElements(".tag p", "words");
    splitTextElements(".card h1", "words, chars", true);

    const isMobile = window.innerWidth < 1000;
    const tags = gsap.utils.toArray(".tag");

    // Criação da Timeline Principal
    const tl = gsap.timeline({
      defaults: { ease: "hop" },
      onStart: () => body.classList.add("lock-scroll"),
    });

    // Configuração inicial de estados
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

    // Sequência da sua animação original
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
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 1,
        },
        6,
      );
  }
});

// Sua função de animações internas (não alterada)
function iniciarAnimacoesTexto() {
  const elementosParaAnimar = document.querySelectorAll(".split-animar");

  elementosParaAnimar.forEach((el) => {
    const meuSplit = new SplitText(el, { type: "chars, words" });
    gsap.set(el, { opacity: 1, visibility: "visible" });

    gsap.from(meuSplit.chars, {
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
      onComplete: () => meuSplit.revert(),
    });
  });

  document.fonts.ready.then(() => {
    if (document.querySelector(".animate-me")) {
      let split = SplitText.create(".animate-me", {
        type: "words",
        aria: "hidden",
      });
      gsap.from(split.words, {
        opacity: 0,
        duration: 0.8,
        ease: "sine.out",
        stagger: 0.1,
      });
    }
  });

  gsap.from(".texto-webflow", { opacity: 0, x: 100, duration: 1 });
}
//Fim introdução




/*Header */

//letras fim banner

//Navegção
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(CustomEase, SplitText);

  // Ease personalizado
  CustomEase.create("hop", ".87, 0, .13, 1");

  // Inicializa o Lenis
  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // Seleção de Elementos
  const container = document.querySelector(".container");
  const menuToggleBtn = document.querySelector(".menu-toggle-btn");
  const menuOverlay = document.querySelector(".menu-overlay");
  const menuOverlayContainer = document.querySelector(".menu-overlay-content");
  const menuMediaWrapper = document.querySelector(".menu-media-warapper");
  const copyContainers = document.querySelectorAll(".menu-col");
  const menuToggleLabel = document.querySelector(".menu-toggle-label p");
  const hamburgerIcon = document.querySelector(".menu-hamburger-icon");

  let isMenuOpen = false;
  let isAnimating = false;
  let splitTextByContainer = [];

  // --- PREPARAÇÃO DO TEXTO (SPLIT) ---
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

  // --- FUNÇÃO PARA FECHAR O MENU ---
  const fecharMenu = () => {
    if (isAnimating || !isMenuOpen) return;

    isAnimating = true;
    hamburgerIcon.classList.remove("active");

    const tl = gsap.timeline();

    tl.to(container, {
      opacity: 1,
      duration: 0.9,
      ease: "hop",
    })
      .to(
        menuOverlay,
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
          duration: 1,
          ease: "hop",
        },
        "<",
      )
      .to(
        menuOverlayContainer,
        {
          yPercent: 0,
          duration: 1,
          ease: "hop",
        },
        "<",
      )
      .to(
        menuToggleLabel,
        {
          y: "0%",
          duration: 1,
          ease: "hop",
        },
        "<",
      )
      .to(
        copyContainers,
        {
          opacity: 0.25,
          duration: 1,
          ease: "hop",
        },
        "<",
      );

    tl.call(() => {
      // Resetar os textos para a posição inicial (subir)
      splitTextByContainer.forEach((containerSplits) => {
        const copyLines = containerSplits.flatMap((split) => split.lines);
        gsap.set(copyLines, { y: "-110%" });
      });

      gsap.set(copyContainers, { opacity: 1 });
      gsap.set(menuMediaWrapper, { opacity: 0 });

      isAnimating = false;
      isMenuOpen = false;
      lenis.start(); // Reativa o scroll
    });
  };

  // --- FUNÇÃO PARA ABRIR O MENU ---
  const abrirMenu = () => {
    if (isAnimating || isMenuOpen) return;

    isAnimating = true;
    lenis.stop(); // Trava o scroll

    const tl = gsap.timeline();

    tl.to(menuToggleLabel, {
      y: "-110%",
      duration: 1,
      ease: "hop",
    })
      .to(
        container,
        {
          opacity: 0,
          duration: 0.1,
          ease: "hop",
        },
        "<",
      )
      .to(
        menuOverlay,
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 1,
          ease: "hop",
        },
        "<",
      )
      .to(
        menuOverlayContainer,
        {
          yPercent: 0,
          duration: 1,
          ease: "hop",
        },
        "<",
      )
      .to(
        menuMediaWrapper,
        {
          opacity: 1,
          duration: 0.75,
          ease: "power2.out",
        },
        "<",
      );

    // Animação das linhas de texto entrando
    splitTextByContainer.forEach((containerSplits) => {
      const copyLines = containerSplits.flatMap((split) => split.lines);
      tl.to(
        copyLines,
        {
          y: "0%",
          duration: 2,
          ease: "hop",
          stagger: -0.075,
        },
        -0.15,
      );
    });

    hamburgerIcon.classList.add("active");

    tl.call(() => {
      isAnimating = false;
      isMenuOpen = true;
    });
  };

  // --- LISTENERS (EVENTOS) ---

  // Botão Hamburguer
  menuToggleBtn.addEventListener("click", () => {
    if (isMenuOpen) {
      fecharMenu();
    } else {
      abrirMenu();
    }
  });

  // Clicar nas colunas (menu-col) para fechar
  copyContainers.forEach((col) => {
    // Adiciona o evento de clique na coluna inteira
    col.addEventListener("click", (e) => {
      // Opcional: Se houver links reais, o navegador mudará de página.
      // A animação de fechamento rodará enquanto a nova página carrega.
      fecharMenu();
    });
  });
});
//Fim navegação
/*Fim header */

/*conhecimento */
document.addEventListener("DOMContentLoaded", () => {
  const abas = document.querySelectorAll(".item-menu");
  const conteudos = document.querySelectorAll(".descricao-conteudo");

  function gerenciarAbas(event) {
    // 1. Limpar (Remove 'ativo' e 'visivel' de TUDO)
    abas.forEach((aba) => aba.classList.remove("ativo"));
    conteudos.forEach((conteudo) => conteudo.classList.remove("visivel"));

    // O item clicado (this)
    const abaClicada = event.currentTarget;

    // 2. Ativar o item clicado (Adiciona 'ativo' à aba)
    abaClicada.classList.add("ativo");

    // 3. Mostrar o conteúdo correspondente
    const idConteudoAlvo = abaClicada.dataset.alvo; // Pega o valor do data-alvo
    const conteudoAlvo = document.getElementById(idConteudoAlvo);

    if (conteudoAlvo) {
      conteudoAlvo.classList.add("visivel");
    }
  }

  // Adicionar o ouvinte de evento de clique a cada item
  abas.forEach((aba) => {
    aba.addEventListener("click", gerenciarAbas);
  });
});
//Fim Conhecimento


//Fucionalidade
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger);

  const cards = [
    { id: "#card-1", endX: -2000, rotate: 45 },
    { id: "#card-2", endX: -1000, rotate: -30 },
    { id: "#card-3", endX: -2000, rotate: 25 },
    { id: "#card-4", endX: -1000, rotate: -30 },
  ];

  // Criamos uma única timeline para sincronizar tudo
  const mainTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".wrapper-404",
      start: "top top",
      // Usar função garante que o GSAP recalcule o valor no refresh
      end: () => `+=${window.innerHeight * 6}`,
      scrub: 1,
      pin: true,
      invalidateOnRefresh: true, // ESSENCIAL: limpa o cache de pixels ao mudar de tela
    },
  });

  // Animação do container principal
  mainTl.to(
    ".wrapper-404",
    {
      x: () => `-${260}vw`,
      ease: "none", // suavidade
    },
    0
  );

  // Animação dos cards sincronizada na mesma timeline
  cards.forEach((card) => {
    if (document.querySelector(card.id)) {
      mainTl.to(
        card.id,
        {
          x: () => card.endX,
          rotate: () => card.rotate * 2,
          ease: "none",
        },
        0
      ); // O '0' faz todos começarem juntos
    }
  });

  // --- MONITOR/FULLSCREEN ---

  // Detecta quando o estado do Full Screen muda
  document.addEventListener("fullscreenchange", () => {
    ScrollTrigger.refresh();
  });

  // Detecta mudança de monitor/resolução que o resize comum as vezes ignora
  window.matchMedia("(min-resolution: 1dppx)").addListener(() => {
    ScrollTrigger.refresh();
  });
});

//Fim Fucionalidade




/*lotie grafifo */
const player = document.querySelector("#meuLottie");

ScrollTrigger.create({
  trigger: ".card-fucionalidade",
  start: "top 40%",
  end: "top top", // Termina quando o fundo da div sobe além de 20% da tela
  onEnter: () => player.play(), // Ao entrar vindo de baixo
  onEnterBack: () => player.play(), // Ao entrar vindo de cima
  onLeaveBack: () => player.stop(), // Ao sair por baixo (reseta)
  // markers: true // Descomente para ver as linhas de teste
});
/*fim lottei grafico */
//Fim fucionalidade



/*cardes perguntas */
// Seleciona todos os títulos das perguntas
const titulosPerguntas = document.querySelectorAll(".cards-perguntas h3");

titulosPerguntas.forEach((titulo) => {
  titulo.addEventListener("click", () => {
    // Encontra o card pai (cards-perguntas)
    const cardPai = titulo.parentElement;

    // Alterna (toggle) a classe .ocultar no card pai
    cardPai.classList.toggle("ocultar");
  });
});
/*Fim cards perguntas */
const faqs = document.querySelectorAll(".faq-header");

faqs.forEach((header) => {
  header.addEventListener("click", () => {
    const item = header.parentElement;

    // Fecha outros itens se quiser um efeito sanfona (opcional)
    document.querySelectorAll(".faq-item").forEach((outro) => {
      if (outro !== item) outro.classList.remove("aberto");
    });

    item.classList.toggle("aberto");
  });
});
/*Fim cardes perguntas */

/*efeito scroll */
// 1. Corrigido o erro de digitação "rigth" para "right"
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


// Não precisa de forEach se for usar stagger


gsap.to(".texto-trajetoria", {
  top: "50%",
  scrollTrigger: {
    trigger: ".container-texto-trajetoria",
    start: "top 70%", // Começa a animação
    end: "bottom top", // Termina a animação (ajuste conforme necessário)
    scrub: 1, // 1 cria um leve atraso suave, true faz ser instantâneo
  },
});
/*Fim efeito scroll */


