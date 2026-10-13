const libraryTourVideo = document.querySelector("#library-tour-video");
const libraryTourLaunch = document.querySelector("#library-tour-launch");

libraryTourLaunch.addEventListener("click", () => {
  libraryTourLaunch.hidden = true;
  libraryTourVideo.play().catch(() => {
    // Native controls remain available if playback needs another user action.
    libraryTourVideo.focus();
  });
});
