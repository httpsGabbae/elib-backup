const faqReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

document.querySelectorAll(".faq-grid details").forEach((details) => {
  const summary = details.querySelector("summary");
  const answer = details.querySelector(".faq-answer");
  let targetOpen = details.open;
  let animation = null;

  summary.addEventListener("click", (event) => {
    event.preventDefault();
    const startHeight = details.open ? answer.getBoundingClientRect().height : 0;
    const previousAnimation = animation;
    animation = null;
    previousAnimation?.cancel();
    targetOpen = !targetOpen;

    if (faqReducedMotion.matches || typeof answer.animate !== "function") {
      details.open = targetOpen;
      details.classList.remove("is-closing");
      answer.style.height = "";
      return;
    }

    details.open = true;
    details.classList.toggle("is-closing", !targetOpen);
    answer.style.height = `${startHeight}px`;
    const endHeight = targetOpen ? answer.scrollHeight : 0;
    const current = answer.animate(
      [{ height: `${startHeight}px` }, { height: `${endHeight}px` }],
      { duration: 240, easing: "ease-in-out" },
    );
    animation = current;
    current.onfinish = () => {
      if (animation !== current) return;
      details.open = targetOpen;
      details.classList.remove("is-closing");
      answer.style.height = "";
      animation = null;
    };
    current.oncancel = () => {
      if (animation !== current) return;
      answer.style.height = "";
      animation = null;
    };
  });
});
