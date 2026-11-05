const root = document.documentElement;
const themeButton = document.querySelector("#theme-toggle");

function setTheme(theme) {
  root.dataset.theme = theme;

  const isDark = theme === "dark";
  themeButton.textContent = isDark ? "切换日间模式" : "切换夜间模式";
  themeButton.setAttribute("aria-pressed", String(isDark));
}

setTheme(localStorage.getItem("theme") || "light");

themeButton.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem("theme", nextTheme);
  setTheme(nextTheme);
});

const startElement = document.querySelector("#start-date");
const [year, month, day] = startElement.dateTime.split("-").map(Number);
const startDate = new Date(year, month - 1, day);
const today = new Date();

startDate.setHours(0, 0, 0, 0);
today.setHours(0, 0, 0, 0);

const days = Math.floor((today - startDate) / 86400000) + 1;
document.querySelector("#days").textContent = Math.max(days, 0);

const note = document.querySelector("#love-note");
const noteButton = document.querySelector("#note-toggle");

noteButton.addEventListener("click", () => {
  note.hidden = !note.hidden;
  noteButton.textContent = note.hidden ? "打开悄悄话" : "收起悄悄话";
});