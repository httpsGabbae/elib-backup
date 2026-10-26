/* js/app.js */
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
    description: "Find books and reference materials in the LCC collection.",
    websiteInfo:
      "Discover books, references, and research materials in the LCC library collection.",
    bestFor: "Finding library materials for assignments and research.",
    introduction:
      "LIBROS-OPAC is the online catalog of the Lipa City Colleges library collection, helping students discover materials for their studies and research.",
    whatYouCanFind:
      "Books, e-books, journals, and theses that can support coursework, provide background on a topic, or offer references for a school project.",
    accessInfo:
      "Enter your own Student or Employee Number on LIBROS with the password below. The School ID here is an example.",
    url: "https://lcc-silvercrest.com/libcoll/",
    logo: "images/lcc_logo.png",
    logoAlt: "Lipa City Colleges emblem",
    mark: "L",
    markClass: "",
  },
  {
    id: "gale",
    name: "GALE",
    type: "Research Database",
    description: "Get credible sources for papers, projects, and research.",
    websiteInfo:
      "Explore academic articles, journals, and reference sources across a wide range of subjects.",
    bestFor: "Research papers, literature reviews, and credible citations.",
    introduction:
      "GALE is an academic research platform that helps students find reliable information for papers, projects, and other school requirements.",
    whatYouCanFind:
      "Journal articles, magazines, news, and reference materials that offer different perspectives and supporting evidence for academic work.",
    accessInfo:
      "Lipa City Colleges is preselected. Enter the password if prompted, then choose a database. The username is included in the link.",
    url: "https://link.gale.com/apps/menu?u=phlipacc",
    logo: "images/Gale_logo.svg",
    logoAlt: "Gale logo",
    logoWide: true,
    mark: "g",
    markClass: "logo-gale",
  },
  {
    id: "ig",
    name: "IG PUBLISHING",
    type: "Digital Publications",
    description: "Discover digital books and publications for your courses.",
    websiteInfo:
      "Explore academic e-books and publications to support course reading and independent study.",
    bestFor: "Course reading, eBooks, and additional study materials.",
    introduction:
      "IG Publishing is a digital book platform that gives students another way to explore course topics and build their understanding beyond classroom discussions.",
    whatYouCanFind:
      "Academic e-books, subject references, and publications for reviewing lessons, exploring new topics, and finding additional reading materials.",
    accessInfo:
      "Browse first, then select Sign In for the account below. Review the provider's terms; full reading depends on LCC's subscription.",
    url: "https://portal.igpublish.com/",
    logo: "images/IG_Libaray.svg",
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
      "Discover digital books and supplementary references for coursework and everyday learning.",
    bestFor: "Supplementary reading, course references, and independent study.",
    introduction:
      "TRITECH is an e-book platform where students can explore additional learning materials to support assignments, coursework, and independent study.",
    whatYouCanFind:
      "Digital books and subject-based references that can help explain a lesson, broaden an idea, or provide another source for academic work.",
    accessInfo:
      "Browse freely. Select Sign in to read, use the library account below, and complete the CAPTCHA. Reading depends on LCC's subscription.",
    url: "https://tdmebooks.com/",
    logo: "images/logo_img.png",
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
  const box = element(
    "div",
    resource.logoWide ? "logo-box logo-wide" : "logo-box",
  );
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
  const left =
    window.innerWidth - rect.right >= width + 24
      ? rect.right + 14
      : rect.left - width - 14;
  resourcePreview.style.left = `${Math.max(12, Math.min(left, window.innerWidth - width - 12))}px`;
  resourcePreview.style.top = `${Math.max(12, Math.min(rect.top, window.innerHeight - height - 12))}px`;
}

function showResourcePreview(resource, trigger) {
  if (
    !trigger.isConnected ||
    dialog.open ||
    (!trigger.matches(":hover") && !trigger.matches(":focus-visible"))
  )
    return;

  resourcePreview.replaceChildren();
  resourcePreview.append(
    element("strong", "resource-preview-name", resource.name),
    element("span", "resource-preview-type", resource.type),
    element("p", "resource-preview-info", resource.accessInfo),
  );

  const credentials = sharedAccess[resource.id];
  const details = element("dl", "resource-preview-details");
  if (resource.id === "libros") {
    details.append(
      element("dt", "", "School ID example"),
      element("dd", "", "25-0000"),
    );
  }
  if (credentials?.username) {
    details.append(
      element("dt", "", "Username"),
      element("dd", "", credentials.username),
    );
  }
  if (credentials?.password) {
    details.append(
      element("dt", "", "Password"),
      element("dd", "", "••••••••"),
    );
  }
  if (details.childElementCount) resourcePreview.append(details);
  resourcePreview.append(
    element(
      "p",
      "resource-preview-hint",
      "Click to reveal access details and open the provider.",
    ),
  );
  resourcePreview.hidden = false;
  resourcePreviewTrigger = trigger;
  trigger.setAttribute("aria-describedby", resourcePreview.id);
  positionResourcePreview(trigger);
}

function scheduleResourcePreview(resource, trigger, delay = 250) {
  hideResourcePreview();
  resourcePreviewTrigger = trigger;
  resourcePreviewTimer = setTimeout(
    () => showResourcePreview(resource, trigger),
    delay,
  );
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
      websiteInfo,
    );
    const cta = element("span", "card-cta");
    cta.append(
      element("span", "", "Explore Resource"),
      element("span", "", "↗"),
    );
    button.append(cta);
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      card.addEventListener("mouseenter", () =>
        scheduleResourcePreview(resource, button),
      );
      card.addEventListener("mouseleave", hideResourcePreview);
    }
    button.addEventListener("focus", () => {
      if (button.matches(":focus-visible"))
        scheduleResourcePreview(resource, button, 0);
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
    const help = element(
      "p",
      "credential-help",
      "Example only. Use your own Student or Employee Number on the LIBROS website.",
    );
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
  visit.append(element("span", "", `Open ${resource.name}`));
  const externalIcon = element("span", "dialog-visit-icon", "↗");
  externalIcon.setAttribute("aria-hidden", "true");
  visit.append(externalIcon);
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
    if (document.body.dataset.view === "gallery") {
      location.hash = "#resources";
      return;
    }
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

/* js/staff-data.js */
/* Staff names, roles, and portraits: https://sites.google.com/view/lcc-library/library-staff */
/* Local portraits downloaded from the named files in https://drive.google.com/drive/folders/1CTDjH0UNaYl5g8jKoQUheyqnRpJBVzTQ */
const staffMembers = [
  {
    id: "marebel-de-la-cruz",
    namePrefix: "Dr.",
    firstName: "Marebel",
    lastName: "De la Cruz",
    position: "Chief Librarian",
    image: "images/staff-marebel-de-la-cruz.jpg",
    department: "Learning Resource Center",
    description:
      "Oversees the administration, services, collections, and operations of the Learning Resource Center.",
  },
  {
    id: "hannah-mendonez",
    namePrefix: "Ms.",
    firstName: "Hannah",
    lastName: "Mendonez",
    nameSuffix: "RL",
    position: "College Librarian",
    image: "images/staff-hannah-mendonez.jpg",
    department: "Learning Resource Center",
    description:
      "Supports college students and faculty in accessing library collections, research materials, and information services.",
  },
  {
    id: "jacquelyn-capuno",
    namePrefix: "Ms.",
    firstName: "Jacquelyn",
    lastName: "Capuno",
    nameSuffix: "RL, MLIS",
    position: "Basic Education Librarian",
    image: "images/staff-jacquelyn-capuno.jpg",
    department: "Learning Resource Center",
    description:
      "Provides library and information services for Basic Education students and faculty.",
  },
  {
    id: "jan-maica-daguismol",
    namePrefix: "Ms.",
    firstName: "Jan Maica",
    lastName: "Daguismol",
    position: "Library Clerk - College (Circulation Section)",
    image: "images/staff-jan-maica-daguismol.jpg",
    department: "Learning Resource Center",
    description:
      "Assists with borrowing, returning, and the circulation of library materials.",
  },
  {
    id: "buena-lou-plandez",
    namePrefix: "Ms.",
    firstName: "Buena Lou",
    middleInitial: "M.",
    lastName: "Plandez",
    position: "Library Clerk - Basic Education",
    image: "images/staff-buena-lou-plandez.jpg",
    department: "Learning Resource Center",
    description:
      "Assists with day-to-day library services and materials for Basic Education.",
  },
  {
    id: "kyla-ann-fababaer",
    namePrefix: "Ms.",
    firstName: "Kyla Ann",
    middleInitial: "L.",
    lastName: "Fababaer",
    position: "Library Clerk - College (Graduate School Library)",
    image: "images/staff-kyla-ann-fababaer.jpg",
    department: "Learning Resource Center",
    description:
      "Supports library services and access to resources for graduate-level users.",
  },
  {
    id: "camille-codillo",
    namePrefix: "Ms.",
    firstName: "Camille",
    lastName: "Codillo",
    position: "Library Clerk - Basic Education",
    image: "images/staff-camille-codillo.jpg",
    department: "Learning Resource Center",
    description:
      "Assists with day-to-day library services and materials for Basic Education.",
  },
  {
    id: "nelinda-alinsunurin",
    namePrefix: "Ms.",
    firstName: "Nelinda",
    middleInitial: "A.",
    lastName: "Alinsunurin",
    position: "Library Clerk - Basic Education",
    image: "images/staff-nelinda-alinsunurin.jpg",
    department: "Learning Resource Center",
    description:
      "Assists with day-to-day library services and materials for Basic Education.",
  },
  {
    id: "king-ahron-orense",
    firstName: "King Ahron",
    lastName: "Orense",
    position: "Student Assistant",
    department: "Learning Resource Center",
    displayOrder: 1,
    description:
      "Supports routine Learning Resource Center services and library operations under staff supervision.",
  },
  {
    id: "renier-joseph-lopez",
    firstName: "Renier Joseph",
    lastName: "Lopez",
    position: "Student Assistant",
    department: "Learning Resource Center",
    displayOrder: 2,
    description:
      "Supports routine Learning Resource Center services and library operations under staff supervision.",
  },
  {
    id: "mclaren-mercado",
    firstName: "McLaren",
    lastName: "Mercado",
    position: "Student Assistant",
    department: "Learning Resource Center",
    displayOrder: 3,
    description:
      "Supports routine Learning Resource Center services and library operations under staff supervision.",
  },
  {
    id: "john-royett-gonzales",
    firstName: "John Royett",
    lastName: "Gonzales",
    position: "Student Assistant",
    department: "Learning Resource Center",
    displayOrder: 4,
    description:
      "Supports routine Learning Resource Center services and library operations under staff supervision.",
  },
  {
    id: "lei-martin-dimaandal",
    firstName: "Lei Martin",
    lastName: "Dimaandal",
    position: "Student Assistant",
    department: "Learning Resource Center",
    displayOrder: 5,
    description:
      "Supports routine Learning Resource Center services and library operations under staff supervision.",
  },
  {
    id: "gizelle-hernandez",
    firstName: "Gizelle",
    lastName: "Hernandez",
    position: "Student Assistant",
    department: "Learning Resource Center",
    displayOrder: 6,
    description:
      "Supports routine Learning Resource Center services and library operations under staff supervision.",
  },
  {
    id: "mary-grace-rayoso",
    firstName: "Mary Grace",
    lastName: "Rayoso",
    position: "Student Assistant",
    department: "Learning Resource Center",
    displayOrder: 7,
    description:
      "Supports routine Learning Resource Center services and library operations under staff supervision.",
  },
  {
    id: "allyssa-mae-bunag",
    firstName: "Allyssa Mae",
    lastName: "Bunag",
    position: "Student Assistant",
    department: "Learning Resource Center",
    displayOrder: 8,
    description:
      "Supports routine Learning Resource Center services and library operations under staff supervision.",
  },
  {
    id: "sarah-kate-orit",
    firstName: "Sarah Kate",
    lastName: "Orit",
    position: "Student Assistant",
    department: "Learning Resource Center",
    displayOrder: 9,
    description:
      "Supports routine Learning Resource Center services and library operations under staff supervision.",
  },
  {
    id: "nicole-sandoval",
    firstName: "Nicole",
    lastName: "Sandoval",
    position: "Student Assistant",
    department: "Learning Resource Center",
    displayOrder: 10,
    description:
      "Supports routine Learning Resource Center services and library operations under staff supervision.",
  },
];

const rolePriority = [
  "Chief Librarian",
  "Head Librarian",
  "Senior Librarian",
  "College Librarian",
  "Basic Education Librarian",
  "Librarian",
  "Library Clerk - College (Circulation Section)",
  "Library Clerk - College (Graduate School Library)",
  "Library Clerk - Basic Education",
  "Library Assistant",
  "Student Assistant",
  "Other Staff",
];
const roleHeadings = {
  "Senior Librarian": "Senior Librarians",
  Librarian: "Librarians",
  "Library Clerk - College (Circulation Section)":
    "College Library · Circulation",
  "Library Clerk - College (Graduate School Library)":
    "College Library · Graduate School",
  "Library Clerk - Basic Education": "Basic Education Library Clerks",
  "Library Assistant": "Library Assistants",
  "Student Assistant": "Student Assistants",
};

function displayName(member) {
  const name =
    member.fullName ||
    [member.firstName, member.middleInitial, member.lastName]
      .filter(Boolean)
      .join(" ");
  const withPrefix =
    [member.namePrefix, name].filter(Boolean).join(" ") || "Staff member";
  return member.nameSuffix ? `${withPrefix}, ${member.nameSuffix}` : withPrefix;
}

function groupedStaff(members) {
  const groups = new Map();
  members.forEach((member) => {
    const role = (member.position || "Other Staff").trim() || "Other Staff";
    if (!groups.has(role)) groups.set(role, []);
    groups.get(role).push(member);
  });
  return [...groups]
    .sort(([a], [b]) => {
      const ai = rolePriority.indexOf(a);
      const bi = rolePriority.indexOf(b);
      return (
        (ai < 0 ? rolePriority.length : ai) -
          (bi < 0 ? rolePriority.length : bi) || a.localeCompare(b)
      );
    })
    .map(([role, people]) => ({
      role,
      heading: roleHeadings[role] || role,
      people: people.sort((a, b) => {
        const aOrder = Number.isFinite(a.displayOrder)
          ? a.displayOrder
          : Infinity;
        const bOrder = Number.isFinite(b.displayOrder)
          ? b.displayOrder
          : Infinity;
        return (
          aOrder - bOrder ||
          (a.lastName || "").localeCompare(b.lastName || "") ||
          (a.firstName || "").localeCompare(b.firstName || "")
        );
      }),
    }));
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { staffMembers, displayName, groupedStaff };
}

/* js/staff.js */
/* Public staff information is always visible. Motion uses fractional transforms,
   avoiding rounded scrollLeft updates and per-frame card reordering. */
const staffMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const FLOW_PX_PER_SECOND = 18;
function staffElement(tag, className, text) {
  const node = document.createElement(tag);
  node.className = className;
  if (text) node.textContent = text;
  return node;
}
function staffAvatar(member) {
  const avatar = staffElement("span", "staff-avatar");
  const initials =
    member.initials ||
    [member.firstName?.[0], member.lastName?.[0]].filter(Boolean).join("");
  avatar.textContent = initials;
  if (member.image) {
    const image = new Image();
    image.alt = `Portrait of ${displayName(member)}`;
    image.loading = "lazy";
    image.addEventListener("error", () => {
      avatar.textContent = initials;
    });
    image.src = member.image;
    avatar.replaceChildren(image);
  }
  return avatar;
}
function createStaffCard(member) {
  const card = staffElement("article", "staff-card staff-card-featured");
  card.append(
    staffAvatar(member),
    staffElement("h4", "staff-name", displayName(member)),
    staffElement("p", "staff-position", member.position),
  );
  if (member.department)
    card.append(staffElement("p", "staff-department", member.department));
  if (member.description)
    card.append(staffElement("p", "staff-description", member.description));
  if (member.email) card.append(staffElement("p", "staff-email", member.email));
  return card;
}
const orderedStaff = groupedStaff(staffMembers).flatMap(
  (group) => group.people,
);
const chief = orderedStaff.find(
  (member) => member.position === "Chief Librarian",
);
if (chief)
  document.querySelector("#staff-featured").append(createStaffCard(chief));
const staffCarousels = [];
for (const [selector, people] of [
  [
    "#library-team-track",
    orderedStaff.filter(
      (member) => member !== chief && member.position !== "Student Assistant",
    ),
  ],
  [
    "#student-assistants-track",
    orderedStaff.filter((member) => member.position === "Student Assistant"),
  ],
]) {
  const viewport = document.querySelector(selector);
  const rail = staffElement("div", "staff-rail");
  const group = staffElement("div", "staff-group");
  people.forEach((member) => group.append(createStaffCard(member)));
  const copy = group.cloneNode(true);
  copy.setAttribute("aria-hidden", "true");
  rail.append(group, copy);
  viewport.replaceChildren(rail);
  const state = {
    viewport,
    rail,
    group,
    offset: 0,
    width: 0,
    visible: true,
    dragging: false,
    resume: 0,
  };
  const measure = () => {
    state.width = group.getBoundingClientRect().width;
  };
  new ResizeObserver(measure).observe(group);
  const move = (distance) => {
    if (!state.width) return;
    state.offset =
      (((state.offset + distance) % state.width) + state.width) % state.width;
    rail.style.transform = `translate3d(-${state.offset}px,0,0)`;
  };
  let pointerX = 0;
  viewport.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    state.dragging = true;
    pointerX = event.clientX;
    viewport.setPointerCapture(event.pointerId);
  });
  viewport.addEventListener("pointermove", (event) => {
    if (!state.dragging) return;
    move(pointerX - event.clientX);
    pointerX = event.clientX;
  });
  const release = () => {
    state.dragging = false;
    state.resume = performance.now() + 1800;
  };
  viewport.addEventListener("pointerup", release);
  viewport.addEventListener("pointercancel", release);
  viewport.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    move(event.key === "ArrowRight" ? 180 : -180);
    state.resume = performance.now() + 1800;
  });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((entries) => {
      state.visible = entries[0].isIntersecting;
    }).observe(viewport);
  }
  state.move = move;
  staffCarousels.push(state);
}
let lastStaffFrame = 0;
function animateStaff(time) {
  const elapsed = lastStaffFrame ? Math.min(time - lastStaffFrame, 40) : 0;
  lastStaffFrame = time;
  if (!document.hidden && !staffMotion.matches) {
    staffCarousels.forEach((state) => {
      if (state.visible && !state.dragging && time >= state.resume)
        state.move((FLOW_PX_PER_SECOND * elapsed) / 1000);
    });
  }
  requestAnimationFrame(animateStaff);
}
requestAnimationFrame(animateStaff);

/* js/hero.js */
const heroTrack = document.querySelector(".hero-slider-track");
const heroSlides = [...heroTrack.querySelectorAll('.hero-slide')];
const heroPhotoCount = heroSlides.filter(slide => slide.getAttribute('aria-hidden') !== 'true').length;
const heroStep = 100 / heroSlides.length;
heroTrack.style.width = String(heroSlides.length * 100) + '%';
heroSlides.forEach(slide => { slide.style.flex = '0 0 ' + heroStep + '%'; });
const heroMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let heroPosition = 0;
let heroTimer;
function scheduleHero() {
  clearInterval(heroTimer);
  if (
    heroMotion.matches ||
    document.hidden ||
    document.body.dataset.view === "gallery"
  )
    return;
  heroTimer = setInterval(() => {
    heroPosition = heroPosition >= heroPhotoCount ? 1 : heroPosition + 1;
    heroTrack.style.transform = `translateX(-${heroPosition * heroStep}%)`;
  }, 6000);
}
heroTrack.addEventListener("transitionend", (event) => {
  if (event.propertyName !== "transform" || heroPosition !== heroPhotoCount) return;
  heroTrack.style.transition = "none";
  heroTrack.style.transform = "translateX(0)";
  heroPosition = 0;
  void heroTrack.offsetWidth;
  heroTrack.style.transition = "";
});
heroMotion.addEventListener("change", scheduleHero);
document.addEventListener("visibilitychange", scheduleHero);
scheduleHero();

/* js/nav.js */
const sectionLinks = [
  ...document.querySelectorAll(
    ".primary-nav .nav-link[href^='#']:not([href='#gallery-page'])",
  ),
];
const header = document.querySelector(".site-header");
const trackedSections = sectionLinks.map((link) => ({
  link,
  section:
    link.hash === "#home"
      ? document.querySelector(".hero")
      : document.querySelector(link.hash),
}));
let navUpdatePending = false;

function updateActiveSection() {
  navUpdatePending = false;
  if (document.body.dataset.view === "gallery") {
    document.querySelectorAll(".primary-nav .nav-link").forEach((link) => {
      const selected = link.hash === "#gallery-page";
      link.classList.toggle("is-active", selected);
      if (selected) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    return;
  }
  document
    .querySelector('.primary-nav [href="#gallery-page"]')
    ?.classList.remove("is-active");
  document
    .querySelector('.primary-nav [href="#gallery-page"]')
    ?.removeAttribute("aria-current");
  const marker =
    header.getBoundingClientRect().height +
    Math.min(180, window.innerHeight * 0.28);
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

window.addEventListener("scroll", scheduleActiveSectionUpdate, {
  passive: true,
});
window.addEventListener("resize", scheduleActiveSectionUpdate);
window.addEventListener("load", scheduleActiveSectionUpdate);
scheduleActiveSectionUpdate();

/* Switch between the original homepage and full gallery without a second HTML file. */
const homeView = document.querySelector("#home-view");
const galleryView = document.querySelector("#gallery-view");
function applyPageRoute() {
  const galleryOpen = location.hash === "#gallery-page";
  const previousView = document.body.dataset.view;
  const nextView = galleryOpen ? "gallery" : "home";
  homeView.hidden = galleryOpen;
  galleryView.hidden = !galleryOpen;
  document.body.dataset.view = nextView;
  document.title = galleryOpen
    ? "Library Gallery | LCC Gateway"
    : "LCC Library Gateway";
  const skipLink = document.querySelector(".skip-link");
  skipLink.href = galleryOpen ? "#gallery-page" : "#resources";
  skipLink.textContent = galleryOpen ? "Skip to gallery" : "Skip to resources";
  hideResourcePreview();
  if (dialog.open) dialog.close();
  closeMenu();
  if (previousView !== nextView) scheduleHero();
  scheduleActiveSectionUpdate();
  if (galleryOpen) {
    window.scrollTo(0, 0);
  } else if (previousView === "gallery") {
    const target = document.getElementById(location.hash.slice(1));
    if (!location.hash || location.hash === "#home") window.scrollTo(0, 0);
    else target?.scrollIntoView({ block: "start" });
  }
}
window.addEventListener("hashchange", applyPageRoute);
window.addEventListener("pageshow", applyPageRoute);
applyPageRoute();
