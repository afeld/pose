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
      "shadow",
      "start shadow",
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
      "cannon",
      "start cannon",
      "start canon",
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
    commands: [
      "freeze",
      "free",
      "fries",
      "frieze",
      "priest",
      "prince",
      "trees",
    ],
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

export const allCommands = () =>
  actions.map((action) => action.commands).flat();

export const actionForCommand = (command: string) =>
  actions.find((action) => action.commands.includes(command));

export const actionForKeyCode = (keycode: string) =>
  actions.find((action) => action.keycode === keycode);

export default actions;
