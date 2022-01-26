import Cannon from "./effects/cannon";
import Effect from "./effects/effect";

const actions = [
  {
    description: "Reset effects",
    keycode: "KeyR",
    commands: ["reset"],
    callback: (effects: Effect[]) => {
      effects.splice(0);
      // TODO detach handlers?
    },
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
    callback: (effects: Effect[]) => {
      Cannon.addTo(effects);
    },
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
