import { Color } from "@tensorflow-models/pose-detection/dist/shared/calculators/interfaces/common_interfaces";

export const BLACK: Color = { r: 0, g: 0, b: 0, a: 255 };
export const CLEAR: Color = { r: 0, g: 0, b: 0, a: 0 };

// https://coolors.co/f9c80e-f86624-ea3546-662e9b-43bccd
const COLORS: Color[] = [
  { r: 249, g: 200, b: 14, a: 255 }, // yellow
  { r: 248, g: 102, b: 36, a: 255 }, // orange
  { r: 234, g: 53, b: 70, a: 255 }, // pink
  { r: 102, g: 46, b: 155, a: 255 }, // purple
  { r: 67, g: 188, b: 205, a: 255 }, // blue
];

let counter = 0;

/**
 * cycles through the colors
 */
export const getNext = () => {
  const colorIndex = counter % (COLORS.length - 1);
  counter += 1;
  return COLORS[colorIndex];
};

export const toString = (color: Color) =>
  `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
