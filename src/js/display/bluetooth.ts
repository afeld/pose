import { isDefaultDeviceBluetooth } from "../audio/bluetooth";
import Canvas from "../display/canvas";
import * as colors from "../utils/colors";

let showBluetoothWarning = false;

export const updateBluetoothStatus = async () => {
  const isBluetooth = await isDefaultDeviceBluetooth(navigator.mediaDevices);
  showBluetoothWarning = !isBluetooth;
};

const baseColor = colors.RED;
const redMax = colors.toRGBA(Object.assign({}, baseColor, { a: 0.5 }));
const redMin = colors.toRGBA(Object.assign({}, baseColor, { a: 0 }));
const pctOfHeight = 0.08;

/**
 * if a warning should be shown, draws an indicator on the screen
 */
export const drawNoBluetoothWarning = (canvas: Canvas) => {
  if (showBluetoothWarning) {
    const ctx = canvas.context;

    // bottom

    const rect1YStart = canvas.height() * (1 - pctOfHeight);

    const gradient1 = ctx.createLinearGradient(
      0,
      canvas.height(),
      0,
      rect1YStart
    );
    gradient1.addColorStop(0, redMax);
    gradient1.addColorStop(1, redMin);
    ctx.fillStyle = gradient1;

    ctx.fillRect(0, rect1YStart, canvas.width(), canvas.height());

    // top

    const rect2YStop = canvas.height() * pctOfHeight;

    const gradient2 = ctx.createLinearGradient(0, 0, 0, rect2YStop);
    gradient2.addColorStop(0, redMax);
    gradient2.addColorStop(1, redMin);
    ctx.fillStyle = gradient2;

    ctx.fillRect(0, 0, canvas.width(), rect2YStop);
  }
};
