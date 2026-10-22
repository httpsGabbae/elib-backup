const sectionLinks = [...document.querySelectorAll(".primary-nav .nav-link[href^='#']")];
const header = document.querySelector(".site-header");
const trackedSections = sectionLinks.map((link) => ({
  link,
  section: link.hash === "#home" ? document.querySelector(".hero") : document.querySelector(link.hash),
}));
let navUpdatePending = false;

function updateActiveSection() {
  navUpdatePending = false;
  const marker = header.getBoundingClientRect().height + Math.min(180, window.innerHeight * 0.28);
  let active = trackedSections[0];
  for (const item of trackedSections) {
    if (item.section?.getBoundingClientRect().top <= marker) active = item;
  }
  for (const item of trackedSections) {
    const selected = item === active;
    item.link.classList.toggle("is-active", selected);
    if (selected) item.link.setAttribute("aria-current", "location");
    else item.link.removeAttribute("aria-current");
  }
}

function scheduleActiveSectionUpdate() {
  if (navUpdatePending) return;
  navUpdatePending = true;
  requestAnimationFrame(updateActiveSection);
}

window.addEventListener("scroll", scheduleActiveSectionUpdate, { passive: true });
window.addEventListener("resize", scheduleActiveSectionUpdate);
window.addEventListener("load", scheduleActiveSectionUpdate);
scheduleActiveSectionUpdate();
