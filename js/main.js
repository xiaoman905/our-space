document.documentElement.classList.remove("no-js");

const root = document.documentElement;
const themeButton = document.querySelector("#theme-toggle");
const themeMeta = document.querySelector('meta[name="theme-color"]');
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function setTheme(theme) {
  root.dataset.theme = theme;

  const isDark = theme === "dark";
  themeButton.textContent = isDark ? "☀" : "☾";
  themeButton.setAttribute("aria-label", isDark ? "切换到日间模式" : "切换到夜间模式");
  themeButton.setAttribute("aria-pressed", String(isDark));

  if (themeMeta) {
    themeMeta.setAttribute("content", isDark ? "#120f18" : "#fff8f5");
  }
}

let savedTheme = "dark";
try {
  savedTheme = localStorage.getItem("theme") || "dark";
} catch (error) {
  savedTheme = "dark";
}
setTheme(savedTheme);

themeButton.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  setTheme(nextTheme);
  try {
    localStorage.setItem("theme", nextTheme);
  } catch (error) {
    return;
  }
});

function animateNumber(element, target, duration = 1100) {
  if (!element) {
    return;
  }

  if (prefersReducedMotion || target === 0) {
    element.textContent = String(target);
    return;
  }

  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = String(Math.round(target * eased));

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}

const startElement = document.querySelector("#start-date");
let daysTogether = 0;

if (startElement) {
  const [year, month, day] = startElement.dateTime.split("-").map(Number);
  const startDate = new Date(year, month - 1, day);
  const today = new Date();

  startDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  daysTogether = Math.max(0, Math.floor((today - startDate) / 86400000) + 1);
}

animateNumber(document.querySelector("#days"), daysTogether);
animateNumber(document.querySelector("#days-copy"), daysTogether);

const knownDate = new Date(2016, 8, 1);
const todayForYears = new Date();
todayForYears.setHours(0, 0, 0, 0);
let yearsKnown = todayForYears.getFullYear() - knownDate.getFullYear();

if (todayForYears < new Date(todayForYears.getFullYear(), 8, 1)) {
  yearsKnown -= 1;
}

animateNumber(document.querySelector("#years-known"), Math.max(0, yearsKnown));

const stars = document.querySelector("#stars");
if (stars) {
  for (let index = 0; index < 70; index += 1) {
    const star = document.createElement("span");
    star.className = "star";
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.setProperty("--duration", `${2 + Math.random() * 4}s`);
    star.style.animationDelay = `${Math.random() * 4}s`;
    star.style.opacity = String(0.2 + Math.random() * 0.8);
    star.style.transform = `scale(${0.6 + Math.random() * 1.2})`;
    stars.appendChild(star);
  }
}

const hearts = document.querySelector("#floating-hearts");
if (hearts) {
  const symbols = ["♥", "♡", "✦"];
  for (let index = 0; index < 16; index += 1) {
    const heart = document.createElement("span");
    heart.className = "heart";
    heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.fontSize = `${10 + Math.random() * 16}px`;
    heart.style.setProperty("--duration", `${12 + Math.random() * 12}s`);
    heart.style.setProperty("--delay", `${Math.random() * -20}s`);
    heart.style.setProperty("--drift", `${-40 + Math.random() * 80}px`);
    hearts.appendChild(heart);
  }
}

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const progressBar = document.querySelector("#scroll-progress");
const backToTop = document.querySelector("#back-to-top");

function updateScrollUI() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;

  if (progressBar) {
    progressBar.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
  }

  if (backToTop) {
    backToTop.classList.toggle("is-visible", window.scrollY > 600);
  }
}

window.addEventListener("scroll", updateScrollUI, { passive: true });
window.addEventListener("resize", updateScrollUI);
updateScrollUI();

if (backToTop) {
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });
}

const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxClose = document.querySelector("#lightbox-close");

function closeLightbox() {
  if (!lightbox || !lightboxImage) {
    return;
  }

  lightbox.hidden = true;
  lightboxImage.src = "";
  document.body.classList.remove("no-scroll");
}

document.querySelectorAll(".photo-card").forEach((card) => {
  card.addEventListener("click", () => {
    const image = card.querySelector("img");
    if (!lightbox || !lightboxImage || !image) {
      return;
    }

    lightboxImage.src = card.dataset.full || image.src;
    lightboxImage.alt = image.alt;
    lightbox.hidden = false;
    document.body.classList.add("no-scroll");
  });
});

if (lightboxClose) {
  lightboxClose.addEventListener("click", closeLightbox);
}

if (lightbox) {
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox && !lightbox.hidden) {
    closeLightbox();
  }
});

const wishInputs = Array.from(document.querySelectorAll("[data-wish]"));
const wishCount = document.querySelector("#wish-count");
const wishProgressBar = document.querySelector("#wish-progress-bar");

let savedWishes = [];
try {
  const storedWishes = JSON.parse(localStorage.getItem("wishlist") || "[]");
  savedWishes = Array.isArray(storedWishes) ? storedWishes : [];
} catch (error) {
  savedWishes = [];
}

wishInputs.forEach((input) => {
  input.checked = savedWishes.includes(input.dataset.wish);
  input.addEventListener("change", updateWishes);
});

function updateWishes() {
  const completed = wishInputs.filter((input) => input.checked);
  const total = wishInputs.length;
  const ratio = total > 0 ? (completed.length / total) * 100 : 0;

  if (wishCount) {
    wishCount.textContent = String(completed.length);
  }

  if (wishProgressBar) {
    wishProgressBar.style.width = `${ratio}%`;
  }

  try {
    localStorage.setItem("wishlist", JSON.stringify(completed.map((input) => input.dataset.wish)));
  } catch (error) {
    return;
  }
}

updateWishes();

const notes = [
  "喜欢你，是我做过最不后悔的决定。",
  "世界很大，幸好我们兜兜转转还是遇见了。",
  "想把普通的日子，过成只属于我们的纪念日。",
  "以后每一次日落，都想和你一起看。",
  "你不用完美，你只要是你。",
  "我们的故事，未完待续。"
];

const randomNoteText = document.querySelector("#random-note-text");
const randomNoteButton = document.querySelector("#random-note-button");
let noteIndex = Math.floor(Math.random() * notes.length);

function showRandomNote() {
  if (randomNoteText) {
    randomNoteText.textContent = notes[noteIndex];
  }
}

showRandomNote();

if (randomNoteButton) {
  randomNoteButton.addEventListener("click", () => {
    let nextIndex = noteIndex;

    while (notes.length > 1 && nextIndex === noteIndex) {
      nextIndex = Math.floor(Math.random() * notes.length);
    }

    noteIndex = nextIndex;

    if (randomNoteText) {
      randomNoteText.classList.remove("fade-in");
      void randomNoteText.offsetWidth;
      randomNoteText.classList.add("fade-in");
    }

    showRandomNote();
  });
}

const note = document.querySelector("#love-note");
const noteButton = document.querySelector("#note-toggle");

if (noteButton && note) {
  noteButton.addEventListener("click", () => {
    const willOpen = note.hidden;
    note.hidden = !willOpen;
    noteButton.textContent = willOpen ? "收起这封信" : "打开这封信";
    noteButton.setAttribute("aria-expanded", String(willOpen));

    if (willOpen) {
      note.classList.remove("fade-in");
      void note.offsetWidth;
      note.classList.add("fade-in");
    }
  });
}