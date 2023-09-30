// restart animation when tab becomes visible
// https://css-tricks.com/restart-css-animation/
(() => {
  const img = document.getElementsByTagName("img")[0] as HTMLImageElement;

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      img.remove();
    } else {
      document.body.prepend(img);
    }
  });
})();
