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

const actions: Action[] = [
  {
    description: "Reset effects",
    keycode: "KeyR",
    commands: ["reset", "clear", "start over", "restart"],
    // TODO detach handlers?
    callback: (effects: Effect[]) => effects.splice(0),
  },
  {
    description: "Shadow",
    keycode: "KeyS",
    commands: [
      "start shadow",
      "shadow",
      "shout out",
      "shut up",
      "add shadow",
      "at shadow",
    ],
    callback: (effects: Effect[]) => Shadow.addTo(effects),
  },
  {
    description: "Start cannon",
    keycode: "KeyC",
    commands: [
      "start cannon",
      "start canon",
      "cannon",
      "canon",
      "add cannon",
      "add canon",
      "at cannon",
      "at canon",
    ],
    callback: (effects: Effect[]) => Cannon.addTo(effects),
  },
  {
    description: "Freeze",
    keycode: "KeyF",
    commands: ["freeze", "frieze", "fries", "priest", "prince"],
    callback: (effects: Effect[]) => Freeze.addTo(effects),
  },
];

export const allCommands = () =>
  actions.map((action) => action.commands).flat();

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
