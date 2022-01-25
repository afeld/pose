import Cannon from "./effects/cannon";
import Effect from "./effects/effect";

const actions = [
  {
    keycode: "KeyC",
    // handle variants
    commands: [
      "cannon",
      "canon",
      "start cannon",
      "start canon",
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

export default actions;
