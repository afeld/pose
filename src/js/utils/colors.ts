import { Color } from "@tensorflow-models/pose-detection/dist/shared/calculators/interfaces/common_interfaces";
import ColorScale from "color-scales";

export const BLACK: Color = { r: 0, g: 0, b: 0, a: 255 };
export const CLEAR: Color = { r: 0, g: 0, b: 0, a: 0 };
export const PURPLE: Color = { r: 73, g: 0, b: 142, a: 255 };

const toHexVal = (val: number) => {
  // https://css-tricks.com/converting-color-spaces-in-javascript/#aa-rgb-to-hex
  const hex = val.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
};

const toHex = (color: Color) => {
  return "#" + toHexVal(color.r) + toHexVal(color.g) + toHexVal(color.b);
};

// https://coolors.co/f86624-f14e35-ea3546-a83271-873086-662e9b
const NUM = 6;
const scale = new ColorScale(0, NUM - 1, [toHex(PURPLE), "#EA3546", "#FCC52F"]);

let counter = 0;

/**
 * cycles through the colors
 */
export const getNext = () => {
  const colorIndex = counter % (NUM - 1);

  const color = scale.getColor(colorIndex);
  // their alpha scale goes 0-1
  color.a = 255;

  counter += 1;
  return color;
};

export const toRGBA = (color: Color) =>
  `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
