import * as dat from "dat.gui";
import actions, { primaryCommand } from "./actions";

export const config = { fullscreen: false, speechDetection: true };

export const gui = new dat.GUI();
gui.useLocalStorage = true;
// console.log(gui.getSaveObject());

export const fullscreenController = gui.add(config, "fullscreen");
export const speechDetectionController = gui.add(config, "speechDetection");

const commandsGui = gui.addFolder("Voice commands");
const commandList = commandsGui.domElement.childNodes[0] as HTMLUListElement;

// add the list of commands
for (const action of actions) {
  const command = primaryCommand(action);
  if (!command) {
    continue;
  }

  const commandEl = document.createElement("li");
  commandEl.innerText = `${action.description}: ${command} | ${action.keycode}`;
  commandList.appendChild(commandEl);
}

// hide by default
gui.hide();
