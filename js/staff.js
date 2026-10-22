/* Public staff information is always visible. Motion uses fractional transforms,
   avoiding rounded scrollLeft updates and per-frame card reordering. */
const staffMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const FLOW_PX_PER_SECOND = 18;
function staffElement(tag, className, text) {
  const node = document.createElement(tag);
  node.className = className;
  if (text) node.textContent = text;
  return node;
}
function staffAvatar(member) {
  const avatar = staffElement('span', 'staff-avatar');
  const initials = member.initials || [member.firstName?.[0], member.lastName?.[0]].filter(Boolean).join('');
  avatar.textContent = initials;
  if (member.image) {
    const image = new Image();
    image.alt = `Portrait of ${displayName(member)}`;
    image.loading = 'lazy';
    image.addEventListener('error', () => { avatar.textContent = initials; });
    image.src = member.image;
    avatar.replaceChildren(image);
  }
  return avatar;
}
function createStaffCard(member, featured = false) {
  const card = staffElement('article', `staff-card${featured ? ' staff-card-featured' : ''}`);
  card.append(staffAvatar(member), staffElement('h4', 'staff-name', displayName(member)), staffElement('p', 'staff-position', member.position));
  if (member.department) card.append(staffElement('p', 'staff-department', member.department));
  if (member.description) card.append(staffElement('p', 'staff-description', member.description));
  if (member.email) card.append(staffElement('p', 'staff-email', member.email));
  return card;
}
const orderedStaff = groupedStaff(staffMembers).flatMap(group => group.people);
const chief = orderedStaff.find(member => member.position === 'Chief Librarian');
if (chief) document.querySelector('#staff-featured').append(createStaffCard(chief, true));
const staffCarousels = [];
for (const [selector, people] of [
  ['#library-team-track', orderedStaff.filter(member => member !== chief && member.position !== 'Student Assistant')],
  ['#student-assistants-track', orderedStaff.filter(member => member.position === 'Student Assistant')],
]) {
  const viewport = document.querySelector(selector);
  const rail = staffElement('div', 'staff-rail');
  const group = staffElement('div', 'staff-group');
  people.forEach(member => group.append(createStaffCard(member)));
  const copy = group.cloneNode(true);
  copy.setAttribute('aria-hidden', 'true');
  rail.append(group, copy);
  viewport.replaceChildren(rail);
  const state = { viewport, rail, group, offset: 0, width: 0, visible: true, dragging: false, resume: 0 };
  const measure = () => { state.width = group.getBoundingClientRect().width; };
  new ResizeObserver(measure).observe(group);
  const move = distance => {
    if (!state.width) return;
    state.offset = ((state.offset + distance) % state.width + state.width) % state.width;
    rail.style.transform = `translate3d(-${state.offset}px,0,0)`;
  };
  let pointerX = 0;
  viewport.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    state.dragging = true;
    pointerX = event.clientX;
    viewport.setPointerCapture(event.pointerId);
  });
  viewport.addEventListener('pointermove', event => {
    if (!state.dragging) return;
    move(pointerX - event.clientX);
    pointerX = event.clientX;
  });
  const release = () => { state.dragging = false; state.resume = performance.now() + 1800; };
  viewport.addEventListener('pointerup', release);
  viewport.addEventListener('pointercancel', release);
  viewport.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    move(event.key === 'ArrowRight' ? 180 : -180);
    state.resume = performance.now() + 1800;
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { state.visible = entries[0].isIntersecting; }).observe(viewport);
  }
  state.move = move;
  staffCarousels.push(state);
}
let lastStaffFrame = 0;
function animateStaff(time) {
  const elapsed = lastStaffFrame ? Math.min(time - lastStaffFrame, 40) : 0;
  lastStaffFrame = time;
  if (!document.hidden && !staffMotion.matches) {
    staffCarousels.forEach(state => {
      if (state.visible && !state.dragging && time >= state.resume) state.move(FLOW_PX_PER_SECOND * elapsed / 1000);
    });
  }
  requestAnimationFrame(animateStaff);
}
requestAnimationFrame(animateStaff);
