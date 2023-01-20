import Cannon from "./effects/cannon";
import Effect from "./effects/effect";
import Freeze from "./effects/freeze";
import Shadow from "./effects/shadow";

interface Action {
  description: string;
  keycode: string;
  // list of variants
  commands: string[];
  callback: (effects: Effect[]) => void;
}

// commands need to be part of the 18w vocabulary:
// https://github.com/tensorflow/tfjs-models/tree/master/speech-commands#online-streaming-recognition
const actions: Action[] = [
  {
    description: "Reset effects",
    keycode: "KeyR",
    commands: ["zero", "stop"],
    // TODO detach handlers?
    callback: (effects: Effect[]) => effects.splice(0),
  },
  {
    description: "Shadow",
    keycode: "KeyS",
    commands: ["two"],
    callback: (effects: Effect[]) => Shadow.addTo(effects),
  },
  {
    description: "Start cannon",
    keycode: "KeyC",
    commands: ["three"],
    callback: (effects: Effect[]) => Cannon.addTo(effects),
  },
  {
    description: "Freeze",
    keycode: "KeyF",
    commands: ["one"],
    callback: (effects: Effect[]) => Freeze.addTo(effects),
  },
  {
    description: "Show/hide controls",
    keycode: "KeyH",
    commands: [],
    // no-op; handled by dat.gui directly
    callback: (_effects: Effect[]) => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  },
];

export const actionForCommand = (command: string) =>
  actions.find((action) => action.commands.includes(command));

export const actionForKeyCode = (keycode: string) =>
  actions.find((action) => action.keycode === keycode);

export const generateActionHelp = (table: HTMLTableSectionElement) => {
  actions.forEach((action) => {
    const row = document.createElement("tr");
    const key = action.keycode.replace("Key", "").toLowerCase();
    row.innerHTML = `
      <td>${action.description}</td>
      <td>"${action.commands[0]}"</td>
      <td><code>${key}</code></td>`;
    table.appendChild(row);
  });
};

export default actions;
