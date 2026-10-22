/*
 * Resource destinations and access details live here for easy maintenance.
 * These school-provided shared credentials are displayed in the resource modal.
 * They are publicly visible to anyone who can load this client-side file.
 */
const sharedAccess = {
  libros: { username: "", password: "lcc1947" },
  gale: { username: "phlipacc", password: "lcclrc2024" },
  ig: { username: "lccsub", password: "lccsub" },
  tritech: { username: "lcclibrary47@gmail.com", password: "8f0d76" },
};

const resources = [
  {
    id: "libros",
    name: "LIBROS-OPAC",
    type: "Library Catalog",
    description:
      "Find books and reference materials in the LCC collection.",
    websiteInfo:
      "Search LCC's catalog by title, author, subject, or keyword to find library materials.",
    bestFor: "Finding books, references, and other LCC library materials.",
    introduction:
      "LIBROS-OPAC is the online public access catalog of the Lipa City Colleges library collection. It helps students, faculty, and staff discover materials available through the Learning Resource Center.",
    whatYouCanFind:
      "Search books and references by title, author, subject, or keyword, and check the collection before visiting the library.",
    accessInfo:
      "Use your own Student Number or Employee Number as the School ID. The example below shows the expected format; enter your actual number on the LIBROS website.",
    url: "https://lcc-silvercrest.com/libcoll/",
    logo: "logos/lcc_logo.png",
    logoAlt: "Lipa City Colleges emblem",
    mark: "L",
    markClass: "",
  },
  {
    id: "gale",
    name: "GALE",
    type: "Research Database",
    description:
      "Get credible sources for papers, projects, and research.",
    websiteInfo:
      "Explore academic articles, journals, magazines, newspapers, and reference sources.",
    bestFor: "Research papers, literature reviews, and credible citations.",
    introduction:
      "GALE is an academic research platform for finding reliable information across many subjects. Available content depends on LCC's subscription.",
    whatYouCanFind:
      "Explore journal articles, magazines, newspapers, reference works, and other sources for essays, presentations, and research.",
    accessInfo:
      "Use the LCC account details below if the Gale website asks you to sign in.",
    url: "https://link.gale.com/apps/menu?u=phlipacc",
    logo: "logos/Gale_logo.svg",
    logoAlt: "Gale logo",
    logoWide: true,
    mark: "g",
    markClass: "logo-gale",
  },
  {
    id: "ig",
    name: "IG PUBLISHING",
    type: "Digital Publications",
    description:
      "Discover digital books and publications for your courses.",
    websiteInfo:
      "Read available eBooks, academic publications, and subject references online.",
    bestFor: "Course reading, eBooks, and additional study materials.",
    introduction:
      "IG Publishing provides digital academic books, publications, and electronic reference materials available through the library.",
    whatYouCanFind:
      "Browse eBooks and subject references for course reading, topic review, and additional study beyond the print collection.",
    accessInfo:
      "Sign in to the iG Library portal using the shared account details below.",
    url: "https://portal.igpublish.com/",
    logo: "logos/IG_Libaray.svg",
    logoAlt: "iG Library logo",
    logoWide: true,
    mark: "iG",
    markClass: "logo-ig",
  },
  {
    id: "tritech",
    name: "TRITECH",
    type: "E-Book Platform",
    description: "Find additional digital reading for coursework and study.",
    websiteInfo:
      "Browse digital books and learning resources available through the library.",
    bestFor: "Supplementary references and independent study.",
    introduction:
      "TRITECH provides electronic books and digital learning resources made available through the library.",
    whatYouCanFind:
      "Explore additional digital reading for assignments, coursework, research, and independent study.",
    accessInfo:
      "Sign in to Tritech using the shared account details below.",
    url: "https://tdmebooks.com/",
    logo: "logos/logo_img.png",
    logoAlt: "Tritech Digital Media logo",
    mark: "T",
    markClass: "logo-tritech",
  },
];

const grid = document.querySelector("#resource-grid");
const dialog = document.querySelector("#resource-dialog");
const dialogHeading = document.querySelector("#dialog-heading-slot");
const dialogContent = document.querySelector("#dialog-content");
const toast = document.querySelector("#toast");
let lastTrigger = null;
let toastTimer;
let resourcePreviewTimer;
let resourcePreviewTrigger = null;

function element(tag, className, textValue) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (textValue !== undefined) node.textContent = textValue;
  return node;
}

function makeLogo(resource) {
  const box = element("div", resource.logoWide ? "logo-box logo-wide" : "logo-box");
  if (resource.logo) {
    const image = element("img");
    image.src = resource.logo;
    image.alt = resource.logoAlt || `${resource.name} logo`;
    image.loading = "lazy";
    box.append(image);
  } else {
    box.setAttribute("aria-hidden", "true");
    box.append(element("span", resource.markClass, resource.mark));
  }
  return box;
}

const resourcePreview = element("div", "resource-hover-preview");
resourcePreview.id = "resource-hover-preview";
resourcePreview.setAttribute("role", "tooltip");
resourcePreview.hidden = true;
document.body.append(resourcePreview);

function hideResourcePreview() {
  clearTimeout(resourcePreviewTimer);
  resourcePreviewTimer = null;
  resourcePreviewTrigger?.removeAttribute("aria-describedby");
  resourcePreviewTrigger = null;
  resourcePreview.hidden = true;
}

function positionResourcePreview(trigger) {
  const rect = trigger.getBoundingClientRect();
  const width = resourcePreview.offsetWidth;
  const height = resourcePreview.offsetHeight;
  const left = window.innerWidth - rect.right >= width + 24
    ? rect.right + 14
    : rect.left - width - 14;
  resourcePreview.style.left = `${Math.max(12, Math.min(left, window.innerWidth - width - 12))}px`;
  resourcePreview.style.top = `${Math.max(12, Math.min(rect.top, window.innerHeight - height - 12))}px`;
}

function showResourcePreview(resource, trigger) {
  if (!trigger.isConnected || dialog.open ||
      (!trigger.matches(":hover") && !trigger.matches(":focus-visible"))) return;

  resourcePreview.replaceChildren();
  resourcePreview.append(
    element("strong", "resource-preview-name", resource.name),
    element("span", "resource-preview-type", resource.type),
    element("p", "resource-preview-info", resource.accessInfo),
  );

  const credentials = sharedAccess[resource.id];
  const details = element("dl", "resource-preview-details");
  if (resource.id === "libros") {
    details.append(element("dt", "", "School ID example"), element("dd", "", "25-0000"));
  }
  if (credentials?.username) {
    details.append(element("dt", "", "Username"), element("dd", "", credentials.username));
  }
  if (credentials?.password) {
    details.append(element("dt", "", "Password"), element("dd", "", "••••••••"));
  }
  if (details.childElementCount) resourcePreview.append(details);
  resourcePreview.append(element("p", "resource-preview-hint", "Click to reveal access details and open the provider."));
  resourcePreview.hidden = false;
  resourcePreviewTrigger = trigger;
  trigger.setAttribute("aria-describedby", resourcePreview.id);
  positionResourcePreview(trigger);
}

function scheduleResourcePreview(resource, trigger, delay = 250) {
  hideResourcePreview();
  resourcePreviewTrigger = trigger;
  resourcePreviewTimer = setTimeout(() => showResourcePreview(resource, trigger), delay);
}

function renderCards() {
  const fragment = document.createDocumentFragment();
  resources.forEach((resource) => {
    const card = element("article", "resource-card");
    const button = element("button", "card-button");
    button.type = "button";
    button.setAttribute("aria-label", `View ${resource.name} access details`);
    const websiteInfo = element("div", "website-info");
    websiteInfo.append(
      element("span", "website-info-label", "About this website"),
      element("p", "", resource.websiteInfo),
    );
    const bestFor = element("p", "website-best-for");
    bestFor.append(element("strong", "", "Best for: "), resource.bestFor);
    websiteInfo.append(bestFor);
    button.append(
      makeLogo(resource),
      element("h3", "resource-name", resource.name),
      element("p", "resource-type", resource.type),
      element("p", "resource-description", resource.description),
      websiteInfo,
    );
    const cta = element("span", "card-cta");
    cta.append(
      element("span", "", "Explore Resource"),
      element("span", "", "↗"),
    );
    button.append(cta);
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      card.addEventListener("mouseenter", () => scheduleResourcePreview(resource, button));
      card.addEventListener("mouseleave", hideResourcePreview);
    }
    button.addEventListener("focus", () => {
      if (button.matches(":focus-visible")) scheduleResourcePreview(resource, button, 0);
    });
    button.addEventListener("blur", hideResourcePreview);
    button.addEventListener("click", () => {
      hideResourcePreview();
      openResource(resource, button);
    });
    card.append(button);
    fragment.append(card);
  });
  grid.append(fragment);
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

async function copyValue(value) {
  try {
    await navigator.clipboard.writeText(value);
    showToast("Copied to clipboard");
  } catch {
    showToast("Copy unavailable. Please select and copy the text.");
  }
}

function addCredentialRow(parent, label, value, isPassword) {
  if (!value) return;
  const row = element("div", "credential-row");
  row.append(element("label", "", `${label}:`));
  const shown = element(
    "span",
    "credential-value",
    isPassword ? "••••••••" : value,
  );
  row.append(shown);
  if (isPassword) {
    const reveal = element("button", "mini-button", "Show");
    reveal.type = "button";
    reveal.setAttribute("aria-label", "Show password");
    reveal.addEventListener("click", () => {
      const visible = reveal.textContent === "Show";
      shown.textContent = visible ? value : "••••••••";
      reveal.textContent = visible ? "Hide" : "Show";
      reveal.setAttribute(
        "aria-label",
        visible ? "Hide password" : "Show password",
      );
    });
    row.append(reveal);
  }
  const copy = element("button", "mini-button", "Copy");
  copy.type = "button";
  copy.setAttribute("aria-label", `Copy ${label.toLowerCase()}`);
  copy.addEventListener("click", () => copyValue(value));
  row.append(copy);
  parent.append(row);
}

function openResource(resource, trigger) {
  lastTrigger = trigger || document.activeElement;
  dialogHeading.replaceChildren();
  dialogContent.replaceChildren();
  const heading = element("div", "dialog-heading");
  const titleGroup = element("div");
  titleGroup.append(element("div", "dialog-eyebrow", resource.type));
  const title = element("h2", "", resource.name);
  title.id = "dialog-title";
  titleGroup.append(title);
  heading.append(titleGroup);
  dialogHeading.append(heading);
  dialogContent.append(element("p", "dialog-description", resource.description));

  const guide = element("div", "dialog-resource-guide");
  [
    ["What is this resource?", resource.introduction],
    ["What can you find here?", resource.whatYouCanFind],
    ["Best used for", resource.bestFor],
  ].forEach(([label, value]) => {
    guide.append(element("h3", "", label), element("p", "", value));
  });
  dialogContent.append(guide);

  const info = element("div", "dialog-info");
  info.append(
    element("h3", "", "How to access"),
    element("p", "", resource.accessInfo),
  );
  if (resource.id === "libros") {
    const example = element("div", "credential-list");
    const row = element("div", "credential-row");
    const label = element("label", "", "School ID:");
    label.htmlFor = "school-id-example";
    const input = element("input", "credential-value credential-placeholder");
    input.id = "school-id-example";
    input.type = "text";
    input.placeholder = "25-0000";
    input.readOnly = true;
    input.setAttribute("aria-describedby", "school-id-help");
    row.append(label, input);
    example.append(row);
    const help = element("p", "credential-help", "Example only. Use your own Student or Employee Number on the LIBROS website.");
    help.id = "school-id-help";
    example.append(help);
    info.append(example);
  }
  const credentials = sharedAccess[resource.id];
  if (credentials && (credentials.username || credentials.password)) {
    const list = element("div", "credential-list");
    addCredentialRow(list, "Username", credentials.username, false);
    addCredentialRow(list, "Password", credentials.password, true);
    info.append(list);
  }
  dialogContent.append(info);

  if (resource.destinationNote)
    dialogContent.append(
      element("p", "dialog-unavailable", resource.destinationNote),
    );
  const visit = element("a", "dialog-visit");
  visit.href = resource.url;
  visit.target = "_blank";
  visit.rel = "noopener noreferrer";
  visit.textContent = `Visit ${resource.name} website`;
  dialogContent.append(visit);
  dialog.showModal();
  dialogContent.scrollTop = 0;
  document.body.style.overflow = "hidden";
}

document
  .querySelector(".dialog-close")
  .addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});
dialog.addEventListener("close", () => {
  document.body.style.overflow = "";
  lastTrigger?.focus();
});

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".primary-nav");
function closeMenu() {
  nav.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
}
menuToggle.addEventListener("click", () => {
  const open = !nav.classList.contains("is-open");
  nav.classList.toggle("is-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute(
    "aria-label",
    open ? "Close navigation" : "Open navigation",
  );
});
nav
  .querySelectorAll("a")
  .forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

document.querySelectorAll("[data-resource-link]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const resource = resources.find(
      (item) => item.id === link.dataset.resourceLink,
    );
    if (resource) openResource(resource, link);
  });
});

document.querySelector("#year").textContent = new Date().getFullYear();
window.addEventListener("resize", hideResourcePreview);
window.addEventListener("scroll", hideResourcePreview, { passive: true });
renderCards();
