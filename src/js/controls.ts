import * as dat from "dat.gui";

export const config = { speechDetection: true };

export const gui = new dat.GUI();
gui.useLocalStorage = true;
// console.log(gui.getSaveObject());

export const speechDetectionController = gui.add(config, "speechDetection");
