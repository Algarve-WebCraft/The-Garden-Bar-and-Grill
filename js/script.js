"use strict";

/* Swup page navigation */

/* const swup = new Swup();

swup.hooks.on("page:view", () => {
  updateActiveNavLink();
  initGlide();
  initPerformanceObservers();
  initServicesHeadingObserver();
}); */

/* Change beginning body hero animation classes */

/* document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    document.body.classList.remove("loading");
    document.body.classList.add("loaded");
  }, 2000);
}); */

/* Navigation links and hamburger menu */

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

/* Show the current page */

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

updateActiveNavLink();

/* Prevent navigation transitions happening on resize */

let resizeTimeout;

window.addEventListener("resize", () => {
  navBar.classList.add("no-transition");

  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    navBar.classList.remove("no-transition");
  }, 1);
});

/* Footer copyright-year update */

/* const currentYear = new Date().getFullYear();
const copyrightSymbol = "\u00A9";

document.getElementById(
  "year"
).innerHTML = `<strong>${copyrightSymbol} Copyright ${currentYear}</strong>`; */

/* Dark-mode change */

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

  /* Logic for setting html pre-load <link> for background images depending on the theme */
  if (theme === "light" && bodyEl.classList.contains("home")) {
    disableDarkMode();
    preloadLink.href = "/assets/images/garden-day.jpg";
    document.head.appendChild(preloadLink);
  } else if (theme === "dark" && bodyEl.classList.contains("home")) {
    enableDarkMode();
    preloadLink.href = "/assets/images/garden-night.webp";
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

/* About section carousel pause function */

const track = document.querySelector(".about-image-track");

track?.addEventListener("click", () => {
  track.classList.toggle("paused");
});

document.addEventListener("keydown", (e) => {
  if (track && e.key === " ") {
    track.classList.toggle("paused");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  if (track) {
    track.click();

    setTimeout(() => {
      track.click();
    }, 4000);
  }
});

/* Menu section modal image logic */

const menuData = {
  en: ["/assets/images/menu-front.webp", "/assets/images/menu-back.webp"],
  pt: ["menus/portuguese-front.jpg", "menus/portuguese-back.jpg"],
  de: ["menus/german-front.jpg", "menus/german-back.jpg"],
  fr: ["menus/french-front.jpg", "menus/french-back.jpg"],
  dr: ["menus/french-front.jpg", "menus/french-back.jpg"],
  bw: ["menus/french-front.jpg", "menus/french-back.jpg"],
};

const buttons = document.querySelectorAll(".menu-buttons button");
const modal = document.getElementById("menuModal");
const closeBtn = document.getElementById("closeModal");
const frontImg = document.getElementById("menu-front");
const backImg = document.getElementById("menu-back");

buttons?.forEach((btn) => {
  btn.addEventListener("click", () => {
    const lang = btn.dataset.lang;
    const [front, back] = menuData[lang];
    frontImg.src = front;
    backImg.src = back;
    modal.classList.add("show");
  });
});

closeBtn?.addEventListener("click", () => {
  modal.classList.remove("show");
});

modal?.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("show");
  }
});

/* Gallery section album books */

const books = document.querySelectorAll(".gallery-book-svg");
const albums = document.querySelectorAll(".album-grid");
const backButtons = document.querySelectorAll(".album-grid__btn");
const bookContainer = document.querySelector(".gallery-book-svg-box");

let activeAlbum = null;
let activeBook = null;

books.forEach((book, index) => {
  const album = document.querySelector(`.album-grid--${index + 1}`);

  book.addEventListener("click", () => {
    activeAlbum = album;
    activeBook = book;

    book.classList.add("fade-out-selected");

    books.forEach((otherBook, i) => {
      if (i !== index) {
        otherBook.classList.add("fade-out-other");
      }
    });

    setTimeout(() => {
      albums.forEach((a) => {
        a.classList.remove("show");
        a.classList.add("hidden");
      });

      album.classList.remove("hidden");
      album.classList.add("show");

      bookContainer.classList.add("hidden");
    }, 1500);
  });
});

backButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (!activeAlbum || !activeBook) return;

    activeAlbum.classList.remove("show");
    setTimeout(() => {
      activeAlbum.classList.add("hidden");
    }, 1500);

    activeBook.classList.remove("fade-out-selected");
    activeBook.classList.add("fade-in-selected");

    books.forEach((b) => {
      if (b !== activeBook) {
        b.classList.remove("fade-out-other");
        b.classList.add("fade-in-other");
      }
    });

    setTimeout(() => {
      bookContainer.classList.remove("hidden");

      books.forEach((b) => {
        b.classList.remove("fade-in-selected", "fade-in-other");
      });

      activeAlbum = null;
      activeBook = null;
    }, 1500); 
  });
});

/* Main page logo easter egg */

const logo = document.querySelector(".hero-main-logo");
const easterEgg = document.querySelector(".hero-main-logo__easter-egg");

logo?.addEventListener("click", () => {
  easterEgg.classList.add("easter-egg-active");

  setTimeout(() => {
    easterEgg.classList.remove("easter-egg-active");
  }, 4000);
});
