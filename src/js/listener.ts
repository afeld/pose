import { io, Socket } from "socket.io-client";

export const EVENT_NAME = "command";

export default class Listener {
  socket: Socket;
  autoRestart = true;

  constructor() {
    this.socket = io("ws://localhost:3000");
  }

  // register event handler
  async onCommand(callback: (command: string) => void) {
    this.socket.on(EVENT_NAME, (msg: string) => {
      console.log("message: " + msg);
      callback(msg);
    });
  }

  start() {
    this.autoRestart = true;
    // TODO
  }

  stop() {
    this.autoRestart = false;
    // TODO
  }
}
