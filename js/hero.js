const heroTrack = document.querySelector('.hero-slider-track');
const heroMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let heroPosition = 0;
let heroTimer;
function scheduleHero() {
  clearInterval(heroTimer);
  if (heroMotion.matches || document.hidden) return;
  heroTimer = setInterval(() => {
    heroPosition = heroPosition >= 3 ? 1 : heroPosition + 1;
    heroTrack.style.transform = `translateX(-${heroPosition * 25}%)`;
  }, 6000);
}
heroTrack.addEventListener('transitionend', event => {
  if (event.propertyName !== 'transform' || heroPosition !== 3) return;
  heroTrack.style.transition = 'none';
  heroTrack.style.transform = 'translateX(0)';
  heroPosition = 0;
  void heroTrack.offsetWidth;
  heroTrack.style.transition = '';
});
heroMotion.addEventListener('change', scheduleHero);
document.addEventListener('visibilitychange', scheduleHero);
scheduleHero();
