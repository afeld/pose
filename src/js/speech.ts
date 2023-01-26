import Listener from "./listener";

const run = async () => {
  const listener = new Listener();
  listener.onCommand((result) => window.parent.postMessage(result, "*"));

  window.addEventListener("message", (event) => {
    switch (event.data) {
      case "start":
        listener.start();
        break;
      case "stop":
        listener.stop();
        break;
      default:
        console.error("Unknown message", event.data);
    }
  });
};

run();
