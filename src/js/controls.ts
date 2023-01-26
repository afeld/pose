import * as dat from "dat.gui";
import actions, { primaryCommand } from "./actions";

export const config = { speechDetection: true };

export const gui = new dat.GUI();
gui.useLocalStorage = true;
// console.log(gui.getSaveObject());

export const speechDetectionController = gui.add(config, "speechDetection");

const commandsGui = gui.addFolder("Voice commands");
const commandList = commandsGui.domElement.childNodes[0] as HTMLUListElement;

const instructionsEl = document.createElement("li");
instructionsEl.innerHTML =
  "<em>The keyboard shortcut is the first letter.</em>";
commandList.appendChild(instructionsEl);

// add the list of commands
for (const action of actions) {
  const command = primaryCommand(action);
  if (!command) {
    continue;
  }

  const commandEl = document.createElement("li");
  commandEl.innerText = command;
  commandList.appendChild(commandEl);
}
