// restart animation when tab becomes visible
(() => {
  const img = document.getElementsByTagName("img")[0] as HTMLImageElement;

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      img.classList.remove("visible");
    } else {
      img.classList.add("visible");
    }
  });

  img.classList.add("visible");
})();
