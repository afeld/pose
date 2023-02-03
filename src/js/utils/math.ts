import { Keypoint } from "@tensorflow-models/pose-detection";
import { mean } from "lodash";

/**
 * @returns the average keypoint depth, expected to be in the 0.05 (far from camera) to 1.2 (close to camera) range
 */
export const getAverageDepth = (keypoints: Keypoint[]) => {
  // the mean() type signature is wrong
  const avg = mean(keypoints.filter((kp) => kp.z).map((kp) => kp.z)) as
    | number
    | null;
  if (!avg) {
    return null;
  }

  // console.log(avg);
  return Math.abs(avg);
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
  const depth = getAverageDepth(keypoints);

  // somewhat arbitrary values

  if (!depth) {
    return 6;
  }

  const DEPTH_MIN = 0.05;
  const DEPTH_MAX = 1.2;
  const LINE_WIDTH_MIN = 1;
  const LINE_WIDTH_MAX = 100;

  return scale(depth, DEPTH_MIN, DEPTH_MAX, LINE_WIDTH_MIN, LINE_WIDTH_MAX);
};
