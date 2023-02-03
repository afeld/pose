import { Keypoint } from "@tensorflow-models/pose-detection";
import { mean } from "lodash";

// https://google.github.io/mediapipe/solutions/pose.html#pose-landmark-model-blazepose-ghum-3d
const useForDepth = (keypoint: Keypoint) =>
  keypoint.z && keypoint.name && /_(hip|shoulder)$/.test(keypoint.name);

/**
 * far from the camera
 */
const DEPTH_MIN = 0.05;
/**
 * close to the camera
 */
const DEPTH_MAX = 0.8;

/**
 * @returns the average keypoint depth, expected to be in the range defined by DEPTH_MIN and DEPTH_MAX
 */
export const getAverageDepth = (keypoints: Keypoint[]) => {
  const keypointsToUse = keypoints.filter(useForDepth);
  // the mean() type signature is wrong
  const avg = mean(keypointsToUse.map((kp) => kp.z)) as number | null;
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
  console.log(depth);

  // somewhat arbitrary values

  if (!depth) {
    return 6;
  }

  const LINE_WIDTH_MIN = 3;
  const LINE_WIDTH_MAX = 150;

  const width = scale(
    depth,
    DEPTH_MIN,
    DEPTH_MAX,
    LINE_WIDTH_MIN,
    LINE_WIDTH_MAX
  );
  // don't go below the minimum line width
  return Math.max(width, LINE_WIDTH_MIN);
};
