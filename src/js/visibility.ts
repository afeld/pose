import ListenerController from "./listener_controller";
import Video from "./video";
import Canvas from "./canvas";
import Effect from "./effects/effect";

/**
 * avoid being creepy by only watching+listening when the window is visible
 */
const onVisibilityChange = (
  video: Video,
  canvas: Canvas,
  listenerController: ListenerController
) => {
  if (document.hidden) {
    video.turnOffWebcam();
    listenerController.stop();
  } else {
    // try to match output resolution
    video.setUpWebcam(canvas.width(), canvas.height());

    listenerController.startIfAllowed();
  }
};

/**
 * only use the webcam when the window is visible
 */
export const handleVisibilityChanges = (
  video: Video,
  canvas: Canvas,
  effects: Effect[]
) => {
  const listenerController = new ListenerController(effects);

  onVisibilityChange(video, canvas, listenerController);
  document.addEventListener(
    "visibilitychange",
    () => onVisibilityChange(video, canvas, listenerController),
    false
  );
};
