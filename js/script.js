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
  let theme = "light";
  const preloadLink = document.createElement("link");
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

  if (theme === "light") {
    disableDarkMode();
    preloadLink.href = "/assets/images/garden-day.jpg";
  } else {
    enableDarkMode();
    preloadLink.href = "/assets/images/garden-night.webp";
  }

  document.head.appendChild(preloadLink);
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

const track = document.querySelector('.about-image-track');

track.addEventListener('click', () => {
  track.classList.toggle('paused');
});