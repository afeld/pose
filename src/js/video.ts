// restart video when tab becomes visible
const video = document.getElementsByTagName("video")[0] as
  | HTMLVideoElement
  | undefined;
const img = document.getElementsByTagName("img")[0] as
  | HTMLImageElement
  | undefined;

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    if (img) {
      img.classList.remove("visible");
    }
  } else {
    if (video) {
      video.play();
    }
    if (img) {
      img.classList.add("visible");
    }
  }
});

if (img) {
  img.classList.add("visible");
}
