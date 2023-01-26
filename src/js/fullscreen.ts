import { fullscreenController } from "./controls";
import Canvas from "./canvas";

// https://fettblog.eu/typescript-typing-catch-clauses/
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onFullscreenError = (error: any) => {
  if (
    error instanceof TypeError &&
    error.message === "Permissions check failed"
  ) {
    // there seems to be a bug in Chrome where it wants you to check for fullscreen permissions, but doing so isn't supported since it isn't part of this list (as of 1/26/23):
    // https://chromium.googlesource.com/chromium/src/+/refs/heads/main/third_party/blink/renderer/modules/permissions/permission_descriptor.idl
    // therefore, we'll just ignore it
  } else {
    throw error;
  }
};

const onFullscreenChange = async (wantsFullscreen: boolean, canvas: Canvas) => {
  if (wantsFullscreen) {
    try {
      await canvas.el.requestFullscreen();
    } catch (error) {
      onFullscreenError(error);
    }
  }
};

export const setupFullscreen = (canvas: Canvas) => {
  fullscreenController.onChange((wantsFullscreen) =>
    onFullscreenChange(wantsFullscreen, canvas)
  );
  document.addEventListener("fullscreenchange", () =>
    fullscreenController.setValue(!!document.fullscreenElement)
  );
};
