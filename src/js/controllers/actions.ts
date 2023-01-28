import Cannon from "../effects/cannon";
import Effect from "../effects/effect";
import Freeze from "../effects/freeze";
import Shadow from "../effects/shadow";

interface Action {
  description: string;
  keycode: string;
  // list of variants, with the first being the primary
  commands: string[];
  callback: (effects: Effect[]) => void;
}

const actions: Action[] = [
  // not bothering to include LiveVideo, since it's only meant to be used at the beginning
  {
    description: "Reset",
    keycode: "KeyR",
    commands: ["zero", "reset", "clear", "start over", "restart"],
    // TODO detach handlers?
    callback: (effects: Effect[]) => effects.splice(0),
  },
  {
    description: "Freeze",
    keycode: "KeyF",
    commands: [
      "one",
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
    description: "Shadow",
    keycode: "KeyS",
    commands: [
      "two",
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
    description: "Cannon",
    keycode: "KeyC",
    commands: [
      "three",
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
    description: "Show/hide controls",
    keycode: "KeyH",
    commands: [],
    // no-op; handled by dat.gui directly
    callback: (_effects: Effect[]) => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  },
];

export const allCommands = () =>
  actions.map((action) => action.commands).flat();

export const primaryCommand = (action: Action): string | undefined =>
  action.commands[0];

export const primaryCommands = () =>
  actions
    .map((action) => primaryCommand(action))
    .filter((command) => !!command) as string[];

export const secondaryCommands = () =>
  actions.map((action) => action.commands.slice(1)).flat();

export const actionForCommand = (command: string) =>
  actions.find((action) => action.commands.includes(command));

export const actionForKeyCode = (keycode: string) =>
  actions.find((action) => action.keycode === keycode);

export default actions;
