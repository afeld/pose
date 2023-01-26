import { allCommands } from "./actions";
import Listener from "./listener";

const commands = allCommands();
const listener = new Listener(commands);
listener.onCommand((command) => console.log(command));
listener.start();
