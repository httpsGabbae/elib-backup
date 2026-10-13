const themeToggle = document.querySelector("#theme-toggle");
const themeIcon = themeToggle.querySelector(".theme-icon");
const themeColor = document.querySelector('meta[name="theme-color"]');

function applyTheme(theme, save = false) {
  const next = theme === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = next;
  themeToggle.setAttribute("aria-label", `Switch to ${next === "dark" ? "light" : "dark"} mode`);
  themeToggle.setAttribute("aria-pressed", String(next === "dark"));
  themeToggle.title = `Switch to ${next === "dark" ? "light" : "dark"} mode`;
  themeIcon.textContent = next === "dark" ? "☀" : "☾";
  themeColor.content = next === "dark" ? "#0B1420" : "#F7F9FC";
  if (save) {
    try { localStorage.setItem("lcc-theme", next); } catch { /* Storage may be unavailable. */ }
  }
}

applyTheme(document.documentElement.dataset.theme);
themeToggle.addEventListener("click", () => {
  applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark", true);
});

const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
systemTheme.addEventListener?.("change", (event) => {
  let saved = null;
  try { saved = localStorage.getItem("lcc-theme"); } catch { /* Storage may be unavailable. */ }
  if (!saved) applyTheme(event.matches ? "dark" : "light");
});
