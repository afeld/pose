import Cannon from "./effects/cannon";
import Effect from "./effects/effect";
import Freeze from "./effects/freeze";
import Live from "./effects/live";

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
    description: "Start live display",
    keycode: "KeyL",
    commands: ["go live", "live"],
    callback: (effects: Effect[]) => {
      const live = new Live();
      effects.push(live);
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
  {
    description: "Freeze",
    keycode: "KeyF",
    // handle variants
    commands: ["freeze", "frieze"],
    callback: (effects: Effect[]) => {
      const freeze = new Freeze();
      effects.push(freeze);
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
