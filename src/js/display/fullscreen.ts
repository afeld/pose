import { config, fullscreenController } from "../controllers/controls";
import Canvas from "./canvas";

const onFullscreenChange = async (canvas: Canvas) => {
  if (config.fullscreen) {
    await canvas.el.requestFullscreen();
  }
};

export const setupFullscreen = (canvas: Canvas) => {
  // need to subscribe to the element instead of the Controller due to
  // https://javascript.plainenglish.io/user-gesture-restricted-web-apis-d794454453f7
  fullscreenController.domElement.addEventListener("change", () =>
    onFullscreenChange(canvas)
  );

  document.addEventListener("fullscreenchange", () =>
    fullscreenController.setValue(!!document.fullscreenElement)
  );
};
