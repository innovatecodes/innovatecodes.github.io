"use strict";

class Media {
  constructor(value) {
    this._max = `(max-width: ${value})`;
    this._media = window.matchMedia(this._max);
  }
  get mediaGet() {
    return this._media;
  }
}

(function () {
  const elements = document.querySelectorAll("[data-animate]");
  const animateClass = "animate";

  function animateElementsFn() {
    const windowTop = window.pageYOffset + (window.innerHeight * 3) / 4;
    elements.forEach(function (element) {
      if (windowTop > element.offsetTop) {
        element.classList.add(animateClass);
      } else {
        element.classList.remove(animateClass);
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    animateElementsFn();
  });

  if (elements.length) {
    addEventListener("scroll", () => {
      animateElementsFn();
    });
  }
})();

function smoothScrollFn() {
  document.querySelector(".arrow").addEventListener("click", function () {
    const htmlEl = document.querySelector("html");
    const topEl = htmlEl.offsetTop;
    window.scrollTo({ top: topEl, behavior: "smooth" });
  });
}

smoothScrollFn();

function mainNavigationFn() {
  function Menu() {
    this._toggleEl = document.querySelector(".toggle");
    this._nav = document.querySelector("nav");
    this._open = "Abrir menu";
    this._close = "Fechar menu";
    this._expanded = "aria-expanded";
    this._pressed = "aria-pressed";
    this._ariaLabel = "aria-label";
    this._false = false;
    this._true = true;
    this.addAttributesFn = () => {
      this._toggleEl.setAttribute(this._expanded, this._true);
      this._toggleEl.setAttribute(this._pressed, this._true);
      this._toggleEl.setAttribute(this._ariaLabel, this._close);
    };
    this.removeAttributesFn = () => {
      this._toggleEl.setAttribute(this._expanded, this._false);
      this._toggleEl.setAttribute(this._pressed, this._false);
      this._toggleEl.setAttribute(this._ariaLabel, this._open);
    };
  }

  const toggleEl = new Menu();
  const nav = new Menu();
  const setAttributesFn = new Menu();
  const removeAttributesFn = new Menu();
  toggleEl._toggleEl;
  nav._nav;
  const active = "active",
    move = "move",
    fade = "fade",
    overlay = "overlay";

  function addFn() {
    nav._nav.classList.add(active);
    toggleEl._toggleEl.classList.add(move);
    nav._nav.classList.add(fade);
    document.getElementById(overlay).classList.add(overlay);
  }

  function removeFn() {
    nav._nav.classList.remove(active);
    toggleEl._toggleEl.classList.remove(move);
    nav._nav.classList.remove(fade);
    document.getElementById(overlay).classList.remove(overlay);
  }

  function toggleMenuFn(event) {
    if (event.type === "touchstart") {
      event.preventDefault(event);
    }

    if (!Boolean(nav._nav.className)) {
      addFn();
      setAttributesFn.addAttributesFn();
    } else {
      removeFn();
      removeAttributesFn.removeAttributesFn();
    }
  }

  document.querySelector(".toggle").addEventListener("click", toggleMenuFn);
  document
    .querySelector(".toggle")
    .addEventListener("touchstart", toggleMenuFn);

  document.addEventListener("click", function (event) {
    if (
      !document.getElementById("menu").contains(event.target) &&
      !toggleEl._toggleEl.contains(event.target) &&
      nav._nav.classList.contains(active)
    ) {
      removeFn();
      removeAttributesFn.removeAttributesFn();
    }
  });

  window.addEventListener("scroll", function (event) {
    if (!document.getElementById("menu").contains(event.target)) {
      removeFn();
      removeAttributesFn.removeAttributesFn();
    }
  });

  document
    .getElementById("menu")
    .addEventListener("touchmove", function (event) {
      event.preventDefault();
    });
}

mainNavigationFn();

function typeTextFn() {
  const h1El = document.querySelector("h1");

  function digitando(element) {
    const array = element.innerHTML.split("");
    element.innerHTML = "";

    array.forEach((letter, i) => {
      setTimeout(() => {
        element.innerHTML += letter;
      }, 100 * i);
    });
  }

  digitando(h1El);
}

typeTextFn();

function currentYearFn() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentYearEl = document.getElementById("current-year");

  const timeEl = document.querySelector("time");
  timeEl.dateTime = 2022;
  timeEl.textContent = 2022;

  function year() {
    return (currentYearEl.innerHTML = currentYear);
  }

  window.addEventListener("load", (event) => {
    year();
  });
}

currentYearFn();

function themeFn() {
  const inputEl = document.querySelector("nav label");
  const root = document.querySelector(":root");
  const darkTheme = "dark-theme",
    control = "control";

  if (sessionStorage.getItem("mode") === "dark") {
    darkThemeFn();
  } else {
    mainThemeFn();
  }

  function darkThemeFn() {
    root.classList.add(darkTheme);
    inputEl.checked = true;
    inputEl.classList.add(control);
    sessionStorage.setItem("mode", "dark");
  }

  function mainThemeFn() {
    root.classList.remove(darkTheme);
    inputEl.checked = false;
    inputEl.classList.remove(control);
    sessionStorage.setItem("mode", "light");
  }

  inputEl.addEventListener("change", function (event) {
    if (event.target.checked) {
      darkThemeFn();
    } else {
      mainThemeFn();
    }
  });

  inputEl.addEventListener("keydown", function (event) {
    if (!event.target.checked) {
      darkThemeFn();
    } else {
      mainThemeFn();
    }
  });
}

themeFn();

function questionsFn() {
  const dl = document.querySelectorAll("dl");
  const angle = "angle";
  const answer = "answer";

  dl.forEach((item) => {
    item.addEventListener("click", (event) => {
      learnMoreFn(event);
    });

    item.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        learnMoreFn(event);
      } else {
        return;
      }
    });
  });

  function learnMoreFn(event) {
    if (!event.currentTarget.classList.contains(angle, answer)) {
      let i = 0;
      while (i < document.querySelectorAll("dl").length) {
        if (
          document.querySelectorAll("dl")[i].classList.contains(angle, answer)
        ) {
          document.querySelectorAll("dl")[i].classList.remove(angle, answer);
        }
        i++;
      }
      event.currentTarget.classList.add(angle, answer);
    } else {
      event.currentTarget.classList.remove(angle, answer);
    }
  }
}

questionsFn();

function removeElementFn() {
  window.addEventListener("scroll", () => {
    const span = document.getElementById("message-sent");
    if (!span) {
      return;
    } else {
      span.remove();
    }
  });
}

removeElementFn();

(function () {
  const max = new Media("991.98px");
  const textArea = document.querySelector("textarea");
  const row = textArea.getAttribute("rows");

  if (max.mediaGet.matches) {
    textArea.setAttribute("rows", +row - 3);
  }
})();

(function () {
  const max = new Media("767.98px");
  if (max.mediaGet.matches) {
    document.querySelector("hr").classList.add("showLine");
  }
})();

(function () {
  window.addEventListener("scroll", () => {
    const contactEl = document.querySelector(".contact");
    const angleUp = document.querySelector(".arrow");
    const windowTop = window.pageYOffset;
    if (windowTop >= contactEl.getBoundingClientRect().bottom) {
      angleUp.classList.add("angle-up");
    } else {
      angleUp.classList.remove("angle-up");
    }
  });
})();
