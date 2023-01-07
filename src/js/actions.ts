import Cannon from "./effects/cannon";
import Effect from "./effects/effect";
import Freeze from "./effects/freeze";
import Shadow from "./effects/shadow";

const actions = [
  {
    description: "Reset effects",
    keycode: "KeyR",
    commands: ["reset"],
    // TODO detach handlers?
    callback: (effects: Effect[]) => effects.splice(0),
  },
  {
    description: "Shadow",
    keycode: "KeyS",
    // handle variants
    commands: ["start shadow", "shadow", "add shadow", "at shadow"],
    callback: (effects: Effect[]) => Shadow.addTo(effects),
  },
  {
    description: "Start cannon",
    keycode: "KeyC",
    // handle variants
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
    // handle variants
    commands: ["freeze", "frieze", "fries"],
    callback: (effects: Effect[]) => Freeze.addTo(effects),
  },
];

export const allCommands = () =>
  actions.map((action) => action.commands).flat();

export const actionForCommand = (command: string) =>
  actions.find((action) => action.commands.includes(command));

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
