"use strict";

////////////////////////////////* Swup page navigation *//////////////////////////////////////////////////////////////////////////////////////*

const swup = new Swup();

function initPageScripts() {
  updateActiveNavLink();
  initDarkToggleText();
  initLogoEasterEgg();
  initAboutCarousel();
  initMenuModal();
  initGallery();

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
}

document.addEventListener("DOMContentLoaded", initPageScripts);

swup.hooks.on("page:view", initPageScripts);

/* Change beginning body hero animation classes */

/* document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    document.body.classList.remove("loading");
    document.body.classList.add("loaded");
  }, 2000);
}); */

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
      hamburgerBtn.classList.add("active");
      navBar.classList.add("hamburger-btn__open");
    });
  }

  setNavAttributes();
});

navBar.addEventListener("transitionend", (e) => {
  if (e.propertyName !== "transform") return;

  if (!navBar.classList.contains("hamburger-btn__open")) {
    navBar.style.display = "none";
  }

  isAnimating = false;
});

document.addEventListener("click", (e) => {
  if (
    !navBar.classList.contains("hamburger-btn__open") ||
    e.target === navBar ||
    e.target === hamburgerBtn ||
    e.target === navBarList
  )
    return;

  if (isAnimating) return;

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
    preloadLink.href = "/assets/images/day/garden-day-1.webp";
    document.head.appendChild(preloadLink);
  } else if (theme === "dark" && bodyEl.classList.contains("home")) {
    enableDarkMode();
    preloadLink.href = "/assets/images/night/garden-night-1.webp";
    document.head.appendChild(preloadLink);
  }
}

detectColorScheme();

function switchTheme(newTheme) {
  newTheme === "dark" ? enableDarkMode() : disableDarkMode();
}

darkModeButton.addEventListener("click", () => {
  const isPressed = darkModeButton.getAttribute("aria-pressed") === "true";
  darkModeButton.setAttribute("aria-pressed", String(!isPressed));

  const currentTheme = localStorage.getItem("theme") || "light";
  const newTheme = currentTheme === "light" ? "dark" : "light";

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
    textBox.style.display = "none";
    return;
  }
  textBox.style.display = "block";

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

///////////////////////////////////////////////////////* Main section background image transitions *////////////////////////////////////////////////////////*

let bgInterval = null;
let bgObserver = null;

function initHomeBackground() {
  const home = document.querySelector("body.home");
  if (!home) return;

  const dayImages = [
    "/assets/images/day/garden-day-1.webp", 
    "/assets/images/day/garden-day-2.webp",
    "/assets/images/day/garden-day-3.webp",
    "/assets/images/day/garden-day-4.webp",
    "/assets/images/day/garden-day-5.webp",
    "/assets/images/day/garden-day-6.webp",
    "/assets/images/day/garden-day-7.webp",
    "/assets/images/day/garden-day-8.webp",
    "/assets/images/day/garden-day-9.webp",
    "/assets/images/day/garden-day-10.webp",
    "/assets/images/day/garden-day-11.webp",
    "/assets/images/day/garden-day-12.webp",
    "/assets/images/day/garden-day-13.webp",
    "/assets/images/day/garden-day-14.webp",
    "/assets/images/day/garden-day-15.webp",
    "/assets/images/day/garden-day-16.webp",
    "/assets/images/day/garden-day-17.webp",
  ];

  const nightImages = [
    "/assets/images/night/garden-night-1.webp",
    "/assets/images/night/garden-night-2.webp",
    "/assets/images/night/garden-night-3.webp",
    "/assets/images/night/garden-night-4.webp",
    "/assets/images/night/garden-night-5.webp",
    "/assets/images/night/garden-night-6.webp",
    "/assets/images/night/garden-night-7.webp",
    "/assets/images/night/garden-night-8.webp",
    "/assets/images/night/garden-night-9.webp",
    "/assets/images/night/garden-night-10.webp",
    "/assets/images/night/garden-night-11.webp",
    "/assets/images/night/garden-night-12.webp",
    "/assets/images/night/garden-night-13.webp",
    "/assets/images/night/garden-night-14.webp",
    "/assets/images/night/garden-night-15.webp",
    "/assets/images/night/garden-night-16.webp",
    "/assets/images/night/garden-night-17.webp",
  ];

  let currentIndex = 0;
  const intervalTime = 6000;

  let theme =
    localStorage.getItem("theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light");

  let currentSet = theme === "dark" ? nightImages : dayImages;
  let toggle = false;

  function showImage(index) {
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

  if (bgInterval) clearInterval(bgInterval);
  bgInterval = setInterval(nextImage, intervalTime);

  if (bgObserver) bgObserver.disconnect();
  bgObserver = new MutationObserver(() => {
    if (document.documentElement.classList.contains("dark-mode")) {
      currentSet = nightImages;
    } else {
      currentSet = dayImages;
    }
    currentIndex = 0;
    showImage(currentIndex);

    clearInterval(bgInterval);
    bgInterval = setInterval(nextImage, intervalTime);
  });

  bgObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
}

///////////////////////////////////////////////////////* About section carousel function *//////////////////////////////////////////////////////////////*

function initAboutCarousel() {
  const track = document.querySelector(".about-image-track");
  const container = document.querySelector(".about-image-block");

  if (!track || !container || typeof gsap === "undefined") return;

  function getScrollDistance() {
    return track.scrollHeight - container.clientHeight;
  }

  function createCarouselTimeline() {
    const scrollDistance = getScrollDistance();
    const speed = 30; //
    const duration = scrollDistance / speed;
    const pauseDuration = 1;

    const tl = gsap.timeline({ repeat: -1 });

    tl.to(track, {
      y: -scrollDistance,
      duration,
      ease: "M0,0 C0.95,0.05 0.25,1 1,1",
    })
      .to({}, { duration: pauseDuration })
      .to(track, { y: 0, duration, ease: "power1.in" })
      .to({}, { duration: pauseDuration });

    return tl;
  }

  let carousel = createCarouselTimeline();
  carousel.pause();
  setTimeout(() => carousel.play(), 5000);

  function togglePause() {
    carousel.paused() ? carousel.play() : carousel.pause();
  }

  container.addEventListener("click", togglePause);

  document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      e.preventDefault();
      togglePause();
    }
  });

  window.addEventListener("resize", () => {
    if (carousel) carousel.kill();
    carousel = createCarouselTimeline();
  });
}

/////////////////////////////////////////////////////* Menu section modal image logic *//////////////////////////////////////////////////////////////////////*

function initMenuModal() {
  const menuData = {
    en: [
      "/assets/images/menu/menu-front.webp",
      "/assets/images/menu/menu-back.webp",
    ],
    pt: ["menus/portuguese-front.jpg", "menus/portuguese-back.jpg"],
    de: ["menus/german-front.jpg", "menus/german-back.jpg"],
    fr: ["menus/french-front.jpg", "menus/french-back.jpg"],
    dr: ["menus/french-front.jpg", "menus/french-back.jpg"],
    bw: ["menus/french-front.jpg", "menus/french-back.jpg"],
  };

  const buttons = document.querySelectorAll(".menu-buttons button");
  const modal = document.getElementById("menuModal");
  const modalContent = document.querySelector(".modal-content");
  const closeBtn = document.getElementById("closeModal");
  const frontImg = document.getElementById("menu-front");
  const backImg = document.getElementById("menu-back");

  if (!buttons.length || !modal || !frontImg || !backImg) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.dataset.lang;
      const [front, back] = menuData[lang];
      frontImg.src = front;
      backImg.src = back;
      modal.classList.add("show");
    });
  });

  modalContent?.addEventListener("click", () => {
    modal.classList.remove("show");
  });

  closeBtn?.addEventListener("click", () => {
    modal.classList.remove("show");
  });

  modal?.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("show");
    }
  });
}

////////////////////////////////////////////////////* Gallery section album books *//////////////////////////////////////////////////////////////////////*

function initGallery() {
  const galleryRoot = document.querySelector(".gallery-page");
  if (
    !galleryRoot ||
    typeof gsap === "undefined" ||
    typeof GLightbox === "undefined"
  )
    return;

    galleryRoot.querySelectorAll("a.glightbox").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
  });

  window.lightbox = GLightbox({
    selector: ".glightbox",
    loop: true,
    zoomable: false,
    keyboardNavigation: true,
  });

  const albumImages = galleryRoot.querySelectorAll(".album-grid img");
  albumImages.forEach((img) => img.setAttribute("loading", "lazy"));

  const books = galleryRoot.querySelectorAll(".gallery-book-svg-box__wrapper");
  const wrappers = galleryRoot.querySelectorAll(".album-wrapper");
  const backButtons = galleryRoot.querySelectorAll(".album-grid__btn");
  const bookTimelines = [];
  let animationOnGoing = false;

  books.forEach((wrapper) => {
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
    const album = wrapper.querySelector(".album-grid");
    const images = album.querySelectorAll("img");

    wrappers.forEach((w) => w.classList.add("hidden"));
    wrapper.classList.remove("hidden");

    const tl = gsap.timeline({ onComplete: () => (animationOnGoing = false) });

    // Animate clicked book
    tl.to(books[index], {
      duration: 1.5,
      scale: 4,
      rotation: -20,
      opacity: 0,
      transformOrigin: "50% 50%",
      ease: "power2.inOut",
      delay: 0.5,
    });

    // Animate other book flying away
    books.forEach((book, i) => {
      if (i !== index) {
        tl.to(
          book,
          {
            duration: 1.5,
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

    // Fade in album
    tl.fromTo(
      album,
      { opacity: 0, y: 20 },
      {
        duration: 1,
        opacity: 1,
        y: 0,
        ease: "elastic.out",
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
        duration: 1,
        stagger: 0.2,
        ease: "steps.out",
        delay: 2,
      }
    );

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
    if (tl) {
      const images = openWrapper.querySelectorAll("img");

      // Fade out images
      gsap.to(images, {
        opacity: 0,
        duration: 0.4,
        y: 20,
        ease: "power1.in",
      });

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
