import { Keypoint } from "@tensorflow-models/pose-detection";

/**
 * uses the Pythagorean theorem to calculate the distance between keypoints in 2D, or 3D (if available)
 */
const hypotenuse = (a: Keypoint, b: Keypoint) => {
  let sides = Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2);
  if (a.z && b.z) {
    // 3D
    sides += Math.pow(a.z - b.z, 2);
  }
  return Math.sqrt(sides);
};

/**
 * @returns the shoulder width, expected to be in the 100-1000 range
 */
export const getShoulderWidth = (keypoints: Keypoint[]) => {
  const leftShoulder = keypoints.find((kp) => kp.name === "left_shoulder");
  const rightShoulder = keypoints.find((kp) => kp.name === "right_shoulder");
  if (leftShoulder && rightShoulder) {
    return hypotenuse(leftShoulder, rightShoulder);
  } else {
    return null;
  }
};

// https://stats.stackexchange.com/a/281164
const scale = (
  value: number,
  r_min: number,
  r_max: number,
  t_min: number,
  t_max: number
) => {
  return ((value - r_min) * (t_max - t_min)) / (r_max - r_min) + t_min;
};

/**
 * scale the line width to give appearance of depth
 */
export const calculateLineWidth = (keypoints: Keypoint[]) => {
  const shoulderWidth = getShoulderWidth(keypoints);

  // somewhat arbitrary values

  if (!shoulderWidth) {
    return 6;
  }

  const LINE_WIDTH_MIN = 1;
  const LINE_WIDTH_MAX = 15;
  const SHOULDER_WIDTH_MIN = 50;
  const SHOULDER_WIDTH_MAX = 200;

  return scale(
    shoulderWidth,
    SHOULDER_WIDTH_MIN,
    SHOULDER_WIDTH_MAX,
    LINE_WIDTH_MIN,
    LINE_WIDTH_MAX
  );
};
