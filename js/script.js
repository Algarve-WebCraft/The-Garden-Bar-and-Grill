"use strict";

////////////////////////////////* Swup page navigation *//////////////////////////////////////////////////////////////////////////////////////*

const swup = new Swup({
  animationScope: "html",
  cache: true,
});

function initPageScripts() {
  updateActiveNavLink();
  initDarkToggleText();
  initLogoEasterEgg();
  secondaryPageSvgInit();
  initAboutCarousel();
  initMenu();
  createImageTags();
  initGallery();
  scrollToTop();

  setTimeout(() => {
    secondaryPageSvgInit(); // Re-run to make sure code prevents the side svg from animating in when coming from home page after the inital animation
  }, 1500);

  document.body.classList.remove("home", "secondary-pages");

  if (
    window.location.pathname === "/" ||
    window.location.pathname.endsWith("index.html")
  ) {
    document.body.classList.add("home");
    initHomeBackground();
  } else {
    document.body.classList.add("secondary-pages");

    if (bgInterval) clearInterval(bgInterval);
    if (bgObserver) bgObserver.disconnect();
  }

  // Re-run svgs to force repaint of box-shadows for mobile
  document.addEventListener("swup:animationInDone", () => {
    document.querySelectorAll(".gallery-book-svg").forEach((svg) => {
      svg.style.willChange = "transform";
      svg.style.transform = "translateZ(0)";
      setTimeout(() => {
        svg.style.transform = "";
        svg.style.willChange = "";
      }, 50);
    });
  });
}

document.addEventListener("DOMContentLoaded", initPageScripts);

swup.hooks.on("page:view", initPageScripts);

///////////////////////////////////////////////////////////* Home intro animations *//////////////////////////////////////////////////////////////////////////*

document.addEventListener("DOMContentLoaded", () => {
  /* return; */

  const body = document.querySelector("body");
  const home = document.querySelector("body.home");
  const isMotionReduced = matchMedia("(prefers-reduced-motion: reduce)");

  //Remove wait for transitions if not on the main page
  if (body.classList.contains("secondary-pages")) {
    document.body.classList.add("loaded");
    return;
  }

  requestAnimationFrame(() => {
    document.body.classList.add("bg-fade-in");
  });

  if (!home || isMotionReduced.matches) return;

  const tl = gsap.timeline({
    defaults: { ease: "power3.out" },
    delay: 0.75,
  });

  gsap.set(".split-overlay", { display: "block" });

  tl.to(
    ".split-overlay--center",
    {
      clipPath: "inset(0% 0% 0% 100%)",
      duration: 0.75,
      ease: "power1.out",
    },
    "-=0.3"
  )
    .to({}, { duration: 0.65 })
    .to(
      ".split-overlay--top",
      { yPercent: -100, duration: 4, ease: "power4.out" },
      "+=0"
    )
    .to(
      ".split-overlay--bottom",
      { yPercent: 100, duration: 4, ease: "power4.out" },
      "-=4"
    )
    .to(".split-overlay", {
      duration: 0.01,
      onComplete() {
        gsap.set(".split-overlay", { display: "none", clearProps: "all" });
      },
    })
    .from(
      "#hero-title",
      {
        y: 100,
        opacity: 0,
        duration: 1.5,
      },
      "-=2"
    )
    .fromTo(
      ".button-flex a",
      { opacity: 0, xPercent: -50 },
      {
        xPercent: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.3,
        ease: "power3.out",
        onComplete() {
          gsap.set(".button-flex a", { clearProps: "all" });
        },
      },
      "-=1.2"
    )
    .from(
      "#header",
      {
        opacity: 0,
        duration: 1.5,
      },
      "-=1"
    )
    .from(
      "#footer",
      {
        opacity: 0,
        x: -1000,
        duration: 1.25,
      },
      "-=0.8"
    )
    .from(
      ".hero-main-logo-container",
      {
        scale: 0.1,
        opacity: 0,
        duration: 0.75,
        onComplete() {
          // Change body classes so swup takes over animations for page changes
          document.body.classList.remove("loading");
          document.body.classList.remove("bg-fade-in");
          document.body.classList.add("loaded");
        },
      },
      "-=1"
    )
    .from(
      ".cmp-info-text--pg1",
      {
        scale: 0.1,
        opacity: 0,
        duration: 2,
      },
      "-=0"
    );
});

///////////////////////////////////////////////////////////* Home buttons shifting *//////////////////////////////////////////////////////////////////////////*
function swapButtons() {
  gsap.registerPlugin(Flip);

  const buttonBox = document.querySelector(".button-flex");

  buttonBox?.addEventListener("mouseenter", () =>
    buttonBox?.classList.add("no-animation")
  );

  buttonBox?.addEventListener("mouseleave", () =>
    buttonBox?.classList.remove("no-animation")
  );

  if (buttonBox?.classList.contains("no-animation")) return;

  const buttons = [...buttonBox?.querySelectorAll(".cmp-main-btn--pg1-s1")];

  const state = Flip.getState(buttons);

  const first = buttons[0];
  buttonBox?.appendChild(first);

  Flip.from(state, {
    duration: 0.4,
    ease: "power3.out",
    stagger: 0.25,
  }); /* The function is called in the 'initHomeBackground' below so the change matches the background images change */
}

///////////////////////////////////////////////////////* Main section background image transitions *////////////////////////////////////////////////////////*

let bgInterval = null;
let bgObserver = null;

function initHomeBackground() {
  const home = document.querySelector("body.home");
  if (!home) return;

  home.classList.remove("bg-fade-in", "with-transition"); // Class applied so opacity transition only happens on image change and not loading on or off page

  requestAnimationFrame(() => {
    home.classList.add("bg-fade-in");
  });

  const dayImagesLarge = [
    "/The-Garden-Bar-and-Grill/assets/images/day/garden-day-1.webp",
    "/The-Garden-Bar-and-Grill/assets/images/day/garden-day-2.webp",
    "/The-Garden-Bar-and-Grill/assets/images/day/garden-day-3.webp",
    "/The-Garden-Bar-and-Grill/assets/images/day/garden-day-4.webp",
    "/The-Garden-Bar-and-Grill/assets/images/day/garden-day-5.webp",
    "/The-Garden-Bar-and-Grill/assets/images/day/garden-day-6.webp",
    "/The-Garden-Bar-and-Grill/assets/images/day/garden-day-7.webp",
    "/The-Garden-Bar-and-Grill/assets/images/day/garden-day-8.webp",
    "/The-Garden-Bar-and-Grill/assets/images/day/garden-day-9.webp",
    "/The-Garden-Bar-and-Grill/assets/images/day/garden-day-10.webp",
    "/The-Garden-Bar-and-Grill/assets/images/day/garden-day-11.webp",
    "/The-Garden-Bar-and-Grill/assets/images/day/garden-day-12.webp",
    "/The-Garden-Bar-and-Grill/assets/images/day/garden-day-13.webp",
    "/The-Garden-Bar-and-Grill/assets/images/day/garden-day-14.webp",
    "/The-Garden-Bar-and-Grill/assets/images/day/garden-day-15.webp",
  ];

  const dayImagesMedium = [
    "/The-Garden-Bar-and-Grill/assets/images/day/garden-day-1-m.webp",
    "/The-Garden-Bar-and-Grill/assets/images/day/garden-day-2-m.webp",
    "/The-Garden-Bar-and-Grill/assets/images/day/garden-day-3-m.webp",
    "/The-Garden-Bar-and-Grill/assets/images/day/garden-day-4-m.webp",
    "/The-Garden-Bar-and-Grill/assets/images/day/garden-day-5-m.webp",
    "/The-Garden-Bar-and-Grill/assets/images/day/garden-day-6-m.webp",
    "/The-Garden-Bar-and-Grill/assets/images/day/garden-day-7-m.webp",
    "/The-Garden-Bar-and-Grill/assets/images/day/garden-day-8-m.webp",
    "/The-Garden-Bar-and-Grill/assets/images/day/garden-day-9-m.webp",
    "/The-Garden-Bar-and-Grill/assets/images/day/garden-day-10-m.webp",
    "/The-Garden-Bar-and-Grill/assets/images/day/garden-day-11-m.webp",
    "/The-Garden-Bar-and-Grill/assets/images/day/garden-day-12-m.webp",
    "/The-Garden-Bar-and-Grill/assets/images/day/garden-day-13-m.webp",
    "/The-Garden-Bar-and-Grill/assets/images/day/garden-day-14-m.webp",
    "/The-Garden-Bar-and-Grill/assets/images/day/garden-day-15-m.webp",
  ];

  const dayImagesSmall = [
    "/The-Garden-Bar-and-Grill/assets/images/day/garden-day-1-s.webp",
    "/The-Garden-Bar-and-Grill/assets/images/day/garden-day-2-s.webp",
    "/The-Garden-Bar-and-Grill/assets/images/day/garden-day-3-s.webp",
    "/The-Garden-Bar-and-Grill/assets/images/day/garden-day-4-s.webp",
    "/The-Garden-Bar-and-Grill/assets/images/day/garden-day-5-s.webp",
    "/The-Garden-Bar-and-Grill/assets/images/day/garden-day-6-s.webp",
    "/The-Garden-Bar-and-Grill/assets/images/day/garden-day-7-s.webp",
    "/The-Garden-Bar-and-Grill/assets/images/day/garden-day-8-s.webp",
    "/The-Garden-Bar-and-Grill/assets/images/day/garden-day-9-s.webp",
    "/The-Garden-Bar-and-Grill/assets/images/day/garden-day-10-s.webp",
    "/The-Garden-Bar-and-Grill/assets/images/day/garden-day-11-s.webp",
    "/The-Garden-Bar-and-Grill/assets/images/day/garden-day-12-s.webp",
    "/The-Garden-Bar-and-Grill/assets/images/day/garden-day-13-s.webp",
    "/The-Garden-Bar-and-Grill/assets/images/day/garden-day-14-s.webp",
    "/The-Garden-Bar-and-Grill/assets/images/day/garden-day-15-s.webp",
  ];

  const nightImagesLarge = [
    "/The-Garden-Bar-and-Grill/assets/images/night/garden-night-1.webp",
    "/The-Garden-Bar-and-Grill/assets/images/night/garden-night-2.webp",
    "/The-Garden-Bar-and-Grill/assets/images/night/garden-night-3.webp",
    "/The-Garden-Bar-and-Grill/assets/images/night/garden-night-4.webp",
    "/The-Garden-Bar-and-Grill/assets/images/night/garden-night-5.webp",
    "/The-Garden-Bar-and-Grill/assets/images/night/garden-night-6.webp",
    "/The-Garden-Bar-and-Grill/assets/images/night/garden-night-7.webp",
    "/The-Garden-Bar-and-Grill/assets/images/night/garden-night-8.webp",
    "/The-Garden-Bar-and-Grill/assets/images/night/garden-night-9.webp",
    "/The-Garden-Bar-and-Grill/assets/images/night/garden-night-10.webp",
    "/The-Garden-Bar-and-Grill/assets/images/night/garden-night-11.webp",
    "/The-Garden-Bar-and-Grill/assets/images/night/garden-night-12.webp",
    "/The-Garden-Bar-and-Grill/assets/images/night/garden-night-13.webp",
    "/The-Garden-Bar-and-Grill/assets/images/night/garden-night-14.webp",
    "/The-Garden-Bar-and-Grill/assets/images/night/garden-night-15.webp",
  ];

  const nightImagesMedium = [
    "/The-Garden-Bar-and-Grill/assets/images/night/garden-night-1-m.webp",
    "/The-Garden-Bar-and-Grill/assets/images/night/garden-night-2-m.webp",
    "/The-Garden-Bar-and-Grill/assets/images/night/garden-night-3-m.webp",
    "/The-Garden-Bar-and-Grill/assets/images/night/garden-night-4-m.webp",
    "/The-Garden-Bar-and-Grill/assets/images/night/garden-night-5-m.webp",
    "/The-Garden-Bar-and-Grill/assets/images/night/garden-night-6-m.webp",
    "/The-Garden-Bar-and-Grill/assets/images/night/garden-night-7-m.webp",
    "/The-Garden-Bar-and-Grill/assets/images/night/garden-night-8-m.webp",
    "/The-Garden-Bar-and-Grill/assets/images/night/garden-night-9-m.webp",
    "/The-Garden-Bar-and-Grill/assets/images/night/garden-night-10-m.webp",
    "/The-Garden-Bar-and-Grill/assets/images/night/garden-night-11-m.webp",
    "/The-Garden-Bar-and-Grill/assets/images/night/garden-night-12-m.webp",
    "/The-Garden-Bar-and-Grill/assets/images/night/garden-night-13-m.webp",
    "/The-Garden-Bar-and-Grill/assets/images/night/garden-night-14-m.webp",
    "/The-Garden-Bar-and-Grill/assets/images/night/garden-night-15-m.webp",
  ];

  const nightImagesSmall = [
    "/The-Garden-Bar-and-Grill/assets/images/night/garden-night-1-s.webp",
    "/The-Garden-Bar-and-Grill/assets/images/night/garden-night-2-s.webp",
    "/The-Garden-Bar-and-Grill/assets/images/night/garden-night-3-s.webp",
    "/The-Garden-Bar-and-Grill/assets/images/night/garden-night-4-s.webp",
    "/The-Garden-Bar-and-Grill/assets/images/night/garden-night-5-s.webp",
    "/The-Garden-Bar-and-Grill/assets/images/night/garden-night-6-s.webp",
    "/The-Garden-Bar-and-Grill/assets/images/night/garden-night-7-s.webp",
    "/The-Garden-Bar-and-Grill/assets/images/night/garden-night-8-s.webp",
    "/The-Garden-Bar-and-Grill/assets/images/night/garden-night-9-s.webp",
    "/The-Garden-Bar-and-Grill/assets/images/night/garden-night-10-s.webp",
    "/The-Garden-Bar-and-Grill/assets/images/night/garden-night-11-s.webp",
    "/The-Garden-Bar-and-Grill/assets/images/night/garden-night-12-s.webp",
    "/The-Garden-Bar-and-Grill/assets/images/night/garden-night-13-s.webp",
    "/The-Garden-Bar-and-Grill/assets/images/night/garden-night-14-s.webp",
    "/The-Garden-Bar-and-Grill/assets/images/night/garden-night-15-s.webp",
  ];

  let currentIndex = 0;
  let stopBackground = false;
  let toggle = false;
  const intervalTime = 7500;

  function stopImagesOnChange() {
    const navLinks = document.querySelectorAll("nav a");
    const pageLinks = document.querySelectorAll(".cmp-main-btn--pg1-s1");

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        stopBackground = true;
      });
    });

    pageLinks.forEach((link) => {
      link.addEventListener("click", () => {
        stopBackground = true;
      });
    });
  }

  stopImagesOnChange();

  let theme =
    localStorage.getItem("theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light");

  function checkScreenSize() {
    if (window.matchMedia("(max-width: 425px)").matches) return "small";
    else if (
      window.matchMedia("(min-width: 425px) and (max-width: 700px)").matches
    )
      return `medium`;
    else return "large";
  }

  function getCurrentSet() {
    if (checkScreenSize() === "small") {
      return theme === "light" ? dayImagesSmall : nightImagesSmall;
    } else if (checkScreenSize() === "medium") {
      return theme === "light" ? dayImagesMedium : nightImagesMedium;
    } else {
      return theme === "light" ? dayImagesLarge : nightImagesLarge;
    }
  }

  let currentSet = getCurrentSet();

  function showImage(index) {
    if (stopBackground) return;

    setTimeout(() => {
      swapButtons();
    }, 300); /* Switch the home buttons around with a small delay to match the images changing */

    const url = `url(${currentSet[index]})`;

    if (toggle) {
      home.style.setProperty("--bg-before", url);
      home.style.setProperty("--before-opacity", 1);
      home.style.setProperty("--after-opacity", 0);
    } else {
      home.style.setProperty("--bg-after", url);
      home.style.setProperty("--before-opacity", 0);
      home.style.setProperty("--after-opacity", 1);
    }

    toggle = !toggle;
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % currentSet.length;
    showImage(currentIndex);
  }

  showImage(currentIndex);

  setTimeout(() => {
    home.classList.add("with-transition");
  }, 2000);

  if (bgInterval) clearInterval(bgInterval);
  bgInterval = setInterval(nextImage, intervalTime);

  if (bgObserver) bgObserver.disconnect();
  bgObserver = new MutationObserver(() => {
    theme = document.documentElement.classList.contains("dark-mode")
      ? "dark"
      : "light";

    currentSet = getCurrentSet();
    currentIndex = 0;
    showImage(currentIndex);

    clearInterval(bgInterval);
    bgInterval = setInterval(nextImage, intervalTime);
  });

  bgObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });

  window.addEventListener("resize", () => {
    const newSet = getCurrentSet();
    if (newSet !== currentSet) {
      currentSet = newSet;
      currentIndex = 0;
      showImage(currentIndex);
    }
  });
}

///////////////////////////////////////////////////////* Secondary pages side-svg transitions */////////////////////////////////////////////////////////////*

function secondaryPageSvgInit() {
  const svgBox = document.querySelector(".side-svg-decor-box");
  const body = document.querySelector("body");

  if (body.classList.contains("secondary-pages"))
    svgBox?.classList.remove("transition-side-fade");
}

///////////////////////////////////////////////////////* About section carousel function *///////////////////////////////////////////////////////////////////*

function initAboutCarousel() {
  const track = document.querySelector(".about-image-track");
  const container = document.querySelector(".about-flex__carousel");

  if (!track || !container || typeof gsap === "undefined") return;

  for (let i = 1; i <= 20; i++) {
    const file = `${i}`;
    const alt = `Carousel image ${i} of 20.`;

    const a = document.createElement("a");
    a.className = "glightbox";
    a.dataset.gallery = "about-carousel";
    a.dataset.href = `assets/images/carousel/${file}.webp`;
    a.dataset.srcset = `assets/images/carousel/${file}-s.webp 600w, assets/images/carousel/${file}-l.webp 1920w`;
    a.dataset.sizes = "100vw";
    a.dataset.type = "image";

    const img = document.createElement("img");
    img.src = `assets/images/carousel/${file}.jpg`;
    img.width = 400;
    img.height = 300;
    img.decoding = "async";
    img.loading = "lazy";
    img.alt = alt;

    a.appendChild(img);
    track.appendChild(a);
  }

  window.lightbox = GLightbox({
    selector: ".glightbox",
    loop: false,
    zoomable: true,
    keyboardNavigation: true,
    touchNavigation: true,
    openEffect: "fade",
    closeEffect: "fade",
  });

  const scrollImages = container.querySelectorAll("img");

  function updateImageVisibility() {
    const containerRect = container.getBoundingClientRect();
    const visibilityThreshold = 0.4; // Change to set when the next image fades in

    scrollImages.forEach((img) => {
      const rect = img.getBoundingClientRect();
      const imgHeight = rect.height;

      const visibleHeight =
        Math.min(rect.bottom, containerRect.bottom) -
        Math.max(rect.top, containerRect.top);

      const visibilityRatio = visibleHeight / imgHeight;

      gsap.to(img, {
        opacity: visibilityRatio >= visibilityThreshold ? 1 : 0,
        duration: 0.6,
        ease: "power1.out",
      });
    });
  }

  updateImageVisibility();
  container.addEventListener("scroll", updateImageVisibility);

  container.style.webkitOverflowScrolling = "touch";
  container.style.overflowY = "auto";
}

/////////////////////////////////////////////////////* Menu section modal image logic *//////////////////////////////////////////////////////////////////////*

function initMenu() {
  document.querySelectorAll(".cmp-main-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const lang = button.dataset.lang;
      let images = [];

      switch (lang) {
        case "en":
          images = [
            {
              href: "/The-Garden-Bar-and-Grill/assets/images/menu/english-1.jpg",
              type: "image",
            },
            {
              href: "/The-Garden-Bar-and-Grill/assets/images/menu/english-2.jpg",
              type: "image",
            },
          ];
          break;
        case "pt":
          images = [
            { href: "assets/images/menu/portuguese-1.jpg", type: "image" },
            { href: "assets/images/menu/portuguese-2.jpg", type: "image" },
          ];
          break;
        case "de":
          images = [
            { href: "assets/images/menu/german-1.jpg", type: "image" },
            { href: "assets/images/menu/german-2.jpg", type: "image" },
          ];
          break;
        case "fr":
          images = [
            { href: "assets/images/menu/french-1.jpg", type: "image" },
            { href: "assets/images/menu/french-2.jpg", type: "image" },
          ];
          break;
        case "dr":
          images = [
            { href: "assets/images/menu/drinks-1.jpg", type: "image" },
            { href: "assets/images/menu/drinks-2.jpg", type: "image" },
          ];
          break;
        case "bw":
          images = [
            { href: "assets/images/menu/beer-wine-1.jpg", type: "image" },
            { href: "assets/images/menu/beer-wine-2.jpg", type: "image" },
          ];
          break;
      }

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (images.length > 0) {
        const menuLightbox = GLightbox({
          elements: images,
          loop: false,
          zoomable: false,
          keyboardNavigation: true,
          touchNavigation: true,
          openEffect: prefersReducedMotion ? "none" : "fade",
          closeEffect: prefersReducedMotion ? "none" : "fade",
        });

        menuLightbox.open();
      }
    });
  });
}

////////////////////////////////////////////////////* Gallery section album books *///////////////////////////////////////////////////////////////////////////*

function initGallery() {
  const galleryRoot = document.querySelector(".gallery-page");
  if (
    !galleryRoot ||
    typeof gsap === "undefined" ||
    typeof GLightbox === "undefined"
  )
    return;

  if (window.lightbox && typeof window.lightbox.destroy === "function") {
    window.lightbox.destroy();
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  window.lightbox = GLightbox({
    selector: ".glightbox",
    loop: false,
    zoomable: true,
    keyboardNavigation: true,
    touchNavigation: true,
    openEffect: prefersReducedMotion ? "none" : "fade",
    closeEffect: prefersReducedMotion ? "none" : "fade",
  });

  galleryRoot.querySelectorAll("a.glightbox").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
  });

  const albumImages = galleryRoot.querySelectorAll(".album-grid img");
  albumImages.forEach((img) => img.setAttribute("loading", "lazy"));

  const books = galleryRoot.querySelectorAll(".gallery-book-svg-box__wrapper");
  const wrappers = galleryRoot.querySelectorAll(".album-wrapper");
  const backButtons = galleryRoot.querySelectorAll(".album-grid__btn");
  const bookTimelines = [];
  let animationOnGoing = false;

  books.forEach((wrapper) => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(max-width: 62.5rem)").matches
    )
      return;

    wrapper.addEventListener("mouseenter", () => {
      if (animationOnGoing) return;

      gsap.fromTo(
        wrapper,
        { scaleX: 1, scaleY: 1 },
        {
          keyframes: [
            {
              scaleX: 1.25,
              scaleY: 0.85,
              duration: 0.25,
              ease: "power1.inOut",
            },
            {
              scaleX: 0.85,
              scaleY: 1.05,
              duration: 0.15,
              ease: "power1.inOut",
            },
            { scaleX: 1, scaleY: 1, duration: 0.2, ease: "power1.inOut" },
          ],
        }
      );
    });
  });

  function showAlbum(index) {
    animationOnGoing = true;

    const wrapper = wrappers[index];
    const booksBox = document.querySelector(".gallery-book-svg-box");
    const album = wrapper.querySelector(".album-grid");
    const images = album.querySelectorAll("img");

    wrappers.forEach((w) => w.classList.add("hidden"));
    wrapper.classList.remove("hidden");

    const tl = gsap.timeline({
      onComplete: () => {
        animationOnGoing = false;
        books.forEach((book) => (book.style.display = "none"));
      },
    });

    booksBox.classList.add("absolute-position");

    // Animate clicked book
    tl.to(books[index], {
      duration: 1,
      scale: 3,
      rotation: -20,
      opacity: 0,
      transformOrigin: "50% 50%",
      ease: "power2.inOut",
      delay: 0.2,
    });

    // Animate other book flying away
    books.forEach((book, i) => {
      if (i !== index) {
        tl.to(
          book,
          {
            duration: 1,
            opacity: 0,
            x: i % 2 === 0 ? -500 : 500,
            y: -200,
            rotation: i % 2 === 0 ? -45 : 45,
            scale: 0.1,
            ease: "power1.in",
          },
          0
        );
      }
    });

    album.style.pointerEvents = "none"; // Prevent opening image while animating

    // Fade in album
    tl.fromTo(
      album,
      { opacity: 0, y: 20 },
      {
        duration: 1,
        opacity: 1,
        y: 0,
        ease: "elastic.out",
        onComplete: () => {
          album.style.pointerEvents = "auto";
        },
      },
      "-=0.3"
    );

    // Animate images in
    gsap.fromTo(
      images,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: "steps.out",
        delay: 1.25,
      }
    );

    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 700);

    bookTimelines[index] = tl;
  }

  function hideAlbum() {
    animationOnGoing = true;

    const openWrapper = galleryRoot.querySelector(
      ".album-wrapper:not(.hidden)"
    );

    if (!openWrapper) return;

    const albumIndex = [...wrappers].indexOf(openWrapper);
    const tl = bookTimelines[albumIndex];
    const booksBox = document.querySelector(".gallery-book-svg-box");
    const album = document.querySelector(`.album-grid--${albumIndex + 1}`);

    album.style.pointerEvents = "none"; // Prevent opening image while animating

    setTimeout(() => {
      booksBox.classList.remove("absolute-position"); // Remove absolute class which was preventing books from taking up dom space
    }, 2000);

    if (tl) {
      const images = openWrapper.querySelectorAll("img");

      // Fade out images
      gsap.to(images, {
        opacity: 0,
        duration: 0.4,
        y: 20,
        ease: "power1.in",
      });

      books.forEach((book) => (book.style.display = "block"));

      // Reverse timeline and reset books
      tl.reverse().then(() => {
        openWrapper.classList.add("hidden");
        books.forEach((book) =>
          gsap.set(book, { clearProps: "all", opacity: 1, scale: 1 })
        );
        animationOnGoing = false;
      });
    }
  }

  // Bind events
  books.forEach((book, index) =>
    book.addEventListener("click", () => showAlbum(index))
  );
  backButtons.forEach((btn) => btn.addEventListener("click", hideAlbum));
}

// Loop to create the image tags within the HTML
function createImageTags() {
  function tags2012() {
    const container = document.querySelector(".album-grid--1");

    if (!container) return;

    for (let i = 1; i <= 328; i++) {
      const a = document.createElement("a");
      a.className = "glightbox";
      a.dataset.gallery = "album1";

      a.dataset.href = `assets/images/book-start/${i}.jpg`;
      a.dataset.srcset = `assets/images/book-start/${i}-s.webp 800w, assets/images/book-start/${i}-l.webp 1920w`;
      a.dataset.sizes = "100vw";
      a.dataset.type = "image";

      const img = document.createElement("img");
      img.src = `assets/images/book-start/${i}.jpg`;
      img.width = 400;
      img.height = 300;
      img.alt = `Image ${i}`;
      img.decoding = "async";
      img.loading = "lazy";

      a.appendChild(img);
      container.appendChild(a);
    }
  }

  function tags2016() {
    const container = document.querySelector(".album-grid--2");

    if (!container) return;

    for (let i = 1; i <= 365; i++) {
      if (i === 73) continue;

      const a = document.createElement("a");
      a.className = "glightbox";
      a.dataset.gallery = "album2";

      a.dataset.href = `assets/images/book-2016/${i}.jpg`;
      a.dataset.srcset = `assets/images/book-2016/${i}-s.webp 800w, assets/images/book-2016/${i}-l.webp 1920w`;
      a.dataset.sizes = "100vw";
      a.dataset.type = "image";

      const img = document.createElement("img");
      img.src = `assets/images/book-2016/${i}.jpg`;
      img.width = 400;
      img.height = 300;
      img.alt = `Image ${i}`;
      img.decoding = "async";
      img.loading = "lazy";

      a.appendChild(img);
      container.appendChild(a);
    }
  }

  function tagsBeer() {
    const container = document.querySelector(".album-grid--3");

    if (!container) return;

    for (let i = 1; i <= 23; i++) {
      const a = document.createElement("a");
      a.className = "glightbox";
      a.dataset.gallery = "album3";

      a.dataset.href = `assets/images/beer-fest/${i}.jpg`;
      a.dataset.srcset = `assets/images/beer-fest/${i}-s.webp 800w, assets/images/beer-fest/${i}-l.webp 1920w`;
      a.dataset.sizes = "100vw";
      a.dataset.type = "image";

      const img = document.createElement("img");
      img.src = `assets/images/beer-fest/${i}.jpg`;
      img.width = 400;
      img.height = 300;
      img.alt = `Image ${i}`;
      img.decoding = "async";
      img.loading = "lazy";

      a.appendChild(img);
      container.appendChild(a);
    }
  }

  tags2012();
  tags2016();
  tagsBeer();
}

function scrollToTop() {
  const button = document?.querySelector(".scrollToTopButton");

  if (!button) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 200) {
      button.style.display = "flex";
      button.style.opacity = "1";
    } else {
      button.style.opacity = "0";
    }
  });

  button?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/////////////////////////////////////////////////////////////* Main page logo easter egg *//////////////////////////////////////////////////////////////////////*

function initLogoEasterEgg() {
  const logo = document.querySelector(".hero-main-logo");
  const easterEgg = document.querySelector(".hero-main-logo__easter-egg");

  if (!logo || !easterEgg) return;

  logo.addEventListener("click", () => {
    easterEgg.classList.add("easter-egg-active");

    setTimeout(() => {
      easterEgg.classList.remove("easter-egg-active");
    }, 4000);
  });
}

////////////////////////////////* Navigation links and hamburger menu *//////////////////////////////////////////////////////////////////////*

const hamburgerBtn = document.querySelector(".hamburger-btn");
const navBar = document.querySelector(".nav-bar");
const navBarList = document.querySelector(".nav-bar ul");
const navBarLinks = document.querySelectorAll(".nav-bar a");

let isAnimating = false;

hamburgerBtn.addEventListener("click", () => {
  if (isAnimating) return;

  const isOpen = navBar.classList.contains("hamburger-btn__open");

  if (isOpen) {
    isAnimating = true;
    hamburgerBtn.classList.remove("active");
    navBar.classList.remove("hamburger-btn__open");
  } else {
    navBar.style.display = "block";
    requestAnimationFrame(() => {
      isAnimating = true;
      hamburgerBtn.classList.add("active");
      navBar.classList.add("hamburger-btn__open");
    });
  }

  setNavAttributes();

  setTimeout(() => {
    isAnimating = false;
  }, 400);
});

navBar.addEventListener("transitionend", (e) => {
  if (e.propertyName !== "transform") return;

  isAnimating = false;
});

document.addEventListener("click", (e) => {
  if (
    !navBar.classList.contains("hamburger-btn__open") ||
    isAnimating ||
    e.target === navBar ||
    e.target === hamburgerBtn ||
    e.target === navBarList
  )
    return;

  isAnimating = true;
  hamburgerBtn.classList.remove("active");
  navBar.classList.remove("hamburger-btn__open");

  setNavAttributes();
});

function setNavAttributes() {
  const navBarHasActiveClass = navBar.classList.contains("hamburger-btn__open");

  if (!navBarHasActiveClass && navBar.contains(document.activeElement)) {
    document.activeElement.blur();
  }

  navBar.setAttribute("aria-hidden", String(!navBarHasActiveClass));
  hamburgerBtn.setAttribute("aria-expanded", String(navBarHasActiveClass));

  navBarLinks.forEach((link) => {
    link.tabIndex = navBarHasActiveClass ? 0 : -1;
  });
}

/////////////////////////////////////* Show the current page *////////////////////////////////////////////////////////////////////////////////*

function updateActiveNavLink() {
  const navBarLinks = document.querySelectorAll(".nav-bar a");
  const currentPath = window.location.pathname;

  navBarLinks.forEach((link) => {
    const linkPath = new URL(link.href).pathname;

    if (linkPath === currentPath) {
      link.classList.add("active-link");

      requestAnimationFrame(() => {
        link.classList.add("animate-underline");
      });
    } else {
      link.classList.remove("active-link", "animate-underline");
    }
  });
}

/////////////////////////////////////* Prevent navigation transitions happening on resize *////////////////////////////////////////////////////////*

let resizeTimeout;

window.addEventListener("resize", () => {
  navBar.classList.add("no-transition");

  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    navBar.classList.remove("no-transition");
  }, 1);
});

///////////////////////////////////////////////////////* Dark-mode change *////////////////////////////////////////////////////////////////////////*

const darkModeButton = document.getElementById("dark-mode-toggle");

function enableDarkMode() {
  document.documentElement.classList.add("dark-mode");
  localStorage.setItem("theme", "dark");
}

function disableDarkMode() {
  document.documentElement.classList.remove("dark-mode");
  localStorage.setItem("theme", "light");
}

function detectColorScheme() {
  const preloadLink = document.createElement("link");
  const bodyEl = document.querySelector("body");
  let theme = "light";
  preloadLink.rel = "preload";
  preloadLink.as = "image";

  if (localStorage.getItem("theme")) {
    theme = localStorage.getItem("theme");
  } else if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    theme = "dark";
  }

  //Logic for setting html pre-load <link> for background images depending on the theme

  if (theme === "light" && bodyEl.classList.contains("home")) {
    disableDarkMode();
    preloadLink.href =
      "/The-Garden-Bar-and-Grill/assets/images/day/garden-day-1.webp";
    document.head.appendChild(preloadLink);
  } else if (theme === "dark" && bodyEl.classList.contains("home")) {
    enableDarkMode();
    preloadLink.href =
      "/The-Garden-Bar-and-Grill/assets/images/night/garden-night-1.webp";
    document.head.appendChild(preloadLink);
  }
}

detectColorScheme();

function switchTheme(newTheme) {
  newTheme === "dark" ? enableDarkMode() : disableDarkMode();
}

darkModeButton.addEventListener("click", () => {
  const home = document.querySelector("body.home");
  const isPressed = darkModeButton.getAttribute("aria-pressed") === "true";
  darkModeButton.setAttribute("aria-pressed", String(!isPressed));

  const currentTheme = localStorage.getItem("theme") || "light";
  const newTheme = currentTheme === "light" ? "dark" : "light";

  home?.classList.remove("with-transition");

  setTimeout(() => {
    home?.classList.add("with-transition"); // Remove transition class for a small delay as button is pressed to prevent background-image transition from happening
  }, 1000);

  if (!document.startViewTransition) {
    switchTheme(newTheme);
    return;
  }

  document.startViewTransition(() => {
    switchTheme(newTheme);
  });
});

///////////////////////////////////////////////////////* Dark toggle day/night text change *////////////////////////////////////////////////////////*

function initDarkToggleText() {
  const textBox = document.querySelector(".dark-toggle-text-box");
  if (!textBox) return;

  const isHome =
    window.location.pathname === "/" ||
    window.location.pathname.endsWith("index.html");

  if (!isHome) {
    textBox.style.opacity = "0";
    return;
  }
  textBox.style.opacity = "1";

  const day = textBox.querySelector(".dark-toggle-text__day");
  const night = textBox.querySelector(".dark-toggle-text__night");
  const span = textBox.querySelector("span");

  function updateMode() {
    const isDark = document.documentElement.classList.contains("dark-mode");
    span.style.transform = isDark ? "rotateY(360deg)" : "rotateY(0deg)";
    day.style.display = isDark ? "inline-block" : "none";
    night.style.display = isDark ? "none" : "inline-block";
  }

  updateMode();

  const observer = new MutationObserver(updateMode);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
}
