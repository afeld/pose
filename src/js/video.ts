// restart video when tab becomes visible
const video = document.getElementsByTagName("video")[0] as HTMLVideoElement;
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    video.currentTime = 0;
    video.play();
  }
});
