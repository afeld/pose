import { allCommands } from "./actions";
import Listener from "./listener";

const run = async () => {
  const commands = allCommands();
  const listener = new Listener(commands);
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
