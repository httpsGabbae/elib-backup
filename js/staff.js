/* Staff cards and profiles render from the single staffMembers dataset. */
const staffFeatured = document.querySelector("#staff-featured");
const staffTracks = {
  team: document.querySelector("#library-team-track"),
  assistants: document.querySelector("#student-assistants-track"),
};
const staffDialog = document.querySelector("#staff-dialog");
const staffDialogContent = document.querySelector("#staff-dialog-content");
const FLOW_PX_PER_SECOND = 55;
const MANUAL_PAUSE_MS = 1800;
const lastManualScroll = new WeakMap();
const pointerStarts = new WeakMap();
const visibleTracks = new WeakSet();
let staffTrigger = null;
let previewTimer = null;
let previewTrigger = null;
let previewAnchor = null;

function staffElement(tag, className, content) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (content !== undefined) node.textContent = content;
  return node;
}

function staffAvatar(member, large = false) {
  const avatar = staffElement("span", `staff-avatar${large ? " staff-avatar-large" : ""}`);
  const initials = member.initials || [member.firstName?.[0], member.lastName?.[0]].filter(Boolean).join("").toUpperCase() || "LCC";
  if (member.image) {
    const photo = staffElement("img");
    photo.alt = `Portrait of ${displayName(member)}`;
    photo.loading = "lazy";
    photo.addEventListener("error", () => avatar.replaceChildren(staffElement("span", "", initials)), { once: true });
    photo.src = member.image;
    avatar.append(photo);
  } else {
    avatar.append(staffElement("span", "", initials));
  }
  return avatar;
}

const staffPreview = staffElement("div", "staff-hover-preview");
staffPreview.id = "staff-hover-preview";
staffPreview.setAttribute("role", "tooltip");
staffPreview.hidden = true;
document.body.append(staffPreview);

function hideStaffPreview() {
  clearTimeout(previewTimer);
  previewTimer = null;
  previewTrigger?.removeAttribute("aria-describedby");
  previewTrigger = null;
  previewAnchor = null;
  staffPreview.hidden = true;
}

function positionStaffPreview(anchor) {
  const rect = anchor.getBoundingClientRect();
  const width = staffPreview.offsetWidth;
  const height = staffPreview.offsetHeight;
  const left = window.innerWidth - rect.right >= width + 24 ? rect.right + 14 : rect.left - width - 14;
  staffPreview.style.left = `${Math.max(12, Math.min(left, window.innerWidth - width - 12))}px`;
  staffPreview.style.top = `${Math.max(12, Math.min(rect.top, window.innerHeight - height - 12))}px`;
}

function showStaffPreview(member, button, anchor) {
  if (!button.isConnected || staffDialog.open) return;
  staffPreview.replaceChildren();
  const heading = staffElement("div", "staff-preview-heading");
  const title = staffElement("div");
  title.append(staffElement("strong", "", displayName(member)), staffElement("span", "staff-preview-position", member.position || "Library staff"));
  heading.append(staffAvatar(member), title);
  staffPreview.append(heading);
  if (member.department) staffPreview.append(staffElement("p", "staff-preview-department", member.department));
  if (member.email) staffPreview.append(staffElement("p", "staff-preview-email", member.email));
  staffPreview.hidden = false;
  previewAnchor = anchor;
  button.setAttribute("aria-describedby", staffPreview.id);
  positionStaffPreview(anchor);
}

function scheduleStaffPreview(member, button, anchor, delay = 250) {
  hideStaffPreview();
  previewTrigger = button;
  previewTimer = setTimeout(() => showStaffPreview(member, button, anchor), delay);
}

function createStaffCard(member, type = "regular") {
  const button = staffElement("button", `staff-card staff-card-${type}`);
  button.type = "button";
  button.setAttribute("aria-label", `View profile for ${displayName(member)}, ${member.position || "Library staff"}`);
  const avatar = staffAvatar(member);
  button.append(avatar, staffElement("span", "staff-name", displayName(member)), staffElement("span", "staff-position", member.position || "Library staff"));
  if (type === "featured" && member.department) button.append(staffElement("span", "staff-department", member.department));
  if (window.matchMedia("(hover: hover)").matches) {
    avatar.addEventListener("mouseenter", () => scheduleStaffPreview(member, button, avatar));
    avatar.addEventListener("mouseleave", hideStaffPreview);
  }
  button.addEventListener("focus", () => {
    if (button.matches(":focus-visible")) scheduleStaffPreview(member, button, avatar, 0);
  });
  button.addEventListener("blur", hideStaffPreview);
  button.addEventListener("click", () => { hideStaffPreview(); openStaffProfile(member, button); });
  return button;
}

function updateCarouselButtons(track) {
  const carousel = track.closest(".staff-carousel");
  const previous = carousel.querySelector('[data-direction="previous"]');
  const next = carousel.querySelector('[data-direction="next"]');
  const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
  previous.disabled = maxScroll <= 1;
  next.disabled = maxScroll <= 1;
}

function cardStepFor(track) {
  const card = track.querySelector(".staff-card");
  if (!card) return 0;
  const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
  return card.getBoundingClientRect().width + gap;
}

function scrollStaff(track, direction) {
  const cardStep = cardStepFor(track);
  if (!cardStep) return;
  track.classList.remove("is-interacting");
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
  const maxScroll = track.scrollWidth - track.clientWidth;
  if (direction === "next" && track.scrollLeft + cardStep > maxScroll + 1) {
    const current = track.scrollLeft;
    track.append(track.firstElementChild);
    track.scrollLeft = current - cardStep;
  }
  if (direction === "previous" && track.scrollLeft < cardStep - 1) {
    const current = track.scrollLeft;
    track.prepend(track.lastElementChild);
    track.scrollLeft = current + cardStep;
  }
  track.classList.add("is-interacting");
  track.scrollBy({ left: (direction === "next" ? 1 : -1) * cardStep, behavior: motion });
}

function canFlow(track) {
  if (document.hidden || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if ("IntersectionObserver" in window && !visibleTracks.has(track)) return false;
  if (Date.now() - (lastManualScroll.get(track) || 0) < MANUAL_PAUSE_MS) return false;
  const cardStep = cardStepFor(track);
  return cardStep > 0 && track.scrollWidth - track.clientWidth >= cardStep - 1;
}

function flowStaff(track, distance) {
  const cardStep = cardStepFor(track);
  let next = track.scrollLeft + distance;
  while (next >= cardStep) {
    track.append(track.firstElementChild);
    next -= cardStep;
  }
  track.scrollLeft = next;
}

function renderStaff() {
  const groups = groupedStaff(staffMembers);
  const ordered = groups.flatMap((group) => group.people);
  const chief = ordered.find((member) => member.position === "Chief Librarian");
  const assistants = ordered.filter((member) => member.position === "Student Assistant");
  const team = ordered.filter((member) => member !== chief && member.position !== "Student Assistant");

  staffFeatured.replaceChildren();
  staffTracks.team.replaceChildren();
  staffTracks.assistants.replaceChildren();
  if (chief) staffFeatured.append(createStaffCard(chief, "featured"));
  staffFeatured.hidden = !chief;
  team.forEach((member) => staffTracks.team.append(createStaffCard(member)));
  assistants.forEach((member) => staffTracks.assistants.append(createStaffCard(member, "assistant")));
  for (const track of Object.values(staffTracks)) {
    track.closest(".staff-carousel").hidden = !track.childElementCount;
    updateCarouselButtons(track);
  }
}

function openStaffProfile(member, trigger) {
  hideStaffPreview();
  staffTrigger = trigger;
  staffDialogContent.replaceChildren();
  const heading = staffElement("div", "staff-profile-heading");
  const titleGroup = staffElement("div");
  const title = staffElement("h2", "", displayName(member));
  title.id = "staff-dialog-title";
  titleGroup.append(title, staffElement("p", "staff-profile-position", member.position || "Library staff"));
  heading.append(staffAvatar(member, true), titleGroup);
  staffDialogContent.append(heading);
  const details = staffElement("div", "staff-profile-details");
  if (member.department) details.append(staffElement("span", "staff-profile-label", "Department / unit"), staffElement("p", "", member.department));
  if (member.namePrefix || member.nameSuffix) {
    const extensions = [member.namePrefix, member.nameSuffix].filter(Boolean).join(" · ");
    details.append(staffElement("span", "staff-profile-label", "Title / credentials"), staffElement("p", "", extensions));
  }
  if (member.description) details.append(staffElement("span", "staff-profile-label", "Role"), staffElement("p", "", member.description));
  if (member.email) {
    const link = staffElement("a", "staff-profile-email", member.email);
    link.href = `mailto:${member.email}`;
    details.append(staffElement("span", "staff-profile-label", "Institutional email"), link);
  }
  if (details.childElementCount) staffDialogContent.append(details);
  staffDialog.showModal();
  document.body.style.overflow = "hidden";
}

document.querySelectorAll("[data-carousel]").forEach((button) => {
  const track = staffTracks[button.dataset.carousel];
  button.addEventListener("click", () => {
    lastManualScroll.set(track, Date.now());
    scrollStaff(track, button.dataset.direction);
  });
});
Object.values(staffTracks).forEach((track) => {
  track.addEventListener("pointerdown", (event) => {
    pointerStarts.set(track, { id: event.pointerId, x: event.clientX, moved: false });
  }, { passive: true });
  track.addEventListener("pointermove", (event) => {
    const gesture = pointerStarts.get(track);
    if (!gesture || gesture.id !== event.pointerId) return;
    if (Math.abs(event.clientX - gesture.x) > 8) gesture.moved = true;
    if (gesture.moved) lastManualScroll.set(track, Date.now());
  }, { passive: true });
  for (const eventName of ["pointerup", "pointercancel"]) {
    track.addEventListener(eventName, (event) => {
      const gesture = pointerStarts.get(track);
      if (gesture?.id !== event.pointerId) return;
      if (gesture.moved) {
        lastManualScroll.set(track, Date.now());
        track.classList.add("is-interacting");
      }
      pointerStarts.delete(track);
    }, { passive: true });
  }
  for (const eventName of ["wheel", "keydown"]) {
    track.addEventListener(eventName, () => {
      lastManualScroll.set(track, Date.now());
      track.classList.add("is-interacting");
    }, { passive: true });
  }
});
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const track = entry.target.querySelector(".staff-track");
      if (entry.isIntersecting) visibleTracks.add(track);
      else visibleTracks.delete(track);
    });
  }, { threshold: 0.15 });
  Object.values(staffTracks).forEach((track) => observer.observe(track.closest(".staff-carousel")));
}
document.querySelector(".staff-dialog-close").addEventListener("click", () => staffDialog.close());
staffDialog.addEventListener("click", (event) => { if (event.target === staffDialog) staffDialog.close(); });
staffDialog.addEventListener("close", () => { document.body.style.overflow = ""; staffTrigger?.focus({ preventScroll: true }); });
if ("ResizeObserver" in window) {
  const observer = new ResizeObserver(() => Object.values(staffTracks).forEach(updateCarouselButtons));
  Object.values(staffTracks).forEach((track) => observer.observe(track));
} else {
  window.addEventListener("resize", () => Object.values(staffTracks).forEach(updateCarouselButtons));
}
window.addEventListener("resize", hideStaffPreview);
renderStaff();
let lastFrame = 0;
function animateStaff(time) {
  const elapsed = lastFrame ? Math.min(time - lastFrame, 50) : 0;
  lastFrame = time;
  for (const track of Object.values(staffTracks)) {
    const flowing = canFlow(track);
    if (flowing) {
      track.classList.remove("is-interacting");
      flowStaff(track, FLOW_PX_PER_SECOND * elapsed / 1000);
    } else if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      track.classList.add("is-interacting");
    } else if (Date.now() - (lastManualScroll.get(track) || 0) >= MANUAL_PAUSE_MS) {
      track.classList.remove("is-interacting");
    }
  }
  if (previewAnchor && !staffPreview.hidden) {
    if (!previewAnchor.isConnected || (!previewAnchor.matches(":hover") && !previewTrigger?.matches(":focus-visible"))) hideStaffPreview();
    else positionStaffPreview(previewAnchor);
  }
  requestAnimationFrame(animateStaff);
}
requestAnimationFrame(animateStaff);
