import { Keypoint } from "@tensorflow-models/pose-detection";
import { min, max } from "lodash";

interface BoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
}

export const getBoundingBox = (keypoints: Keypoint[]): BoundingBox => {
  const xS = keypoints.map((keypoint) => keypoint.x);
  const yS = keypoints.map((keypoint) => keypoint.y);
  const minX = min(xS) as number;
  const minY = min(yS) as number;
  const maxX = max(xS) as number;
  const maxY = max(yS) as number;

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
  };
};

/**
 * gives some padding around the sides and top to avoid cutting off the hands and head
 */
export const getAdjustedBoundingBox = (keypoints: Keypoint[]): BoundingBox => {
  const bb = getBoundingBox(keypoints);

  const xAdjust = bb.width * 0.2;
  const adjustedMinX = bb.minX - xAdjust;
  const adjustedMaxX = bb.maxX + xAdjust;

  const adjustedMinY = bb.minY - bb.height * 0.1;

  return {
    minX: adjustedMinX,
    minY: adjustedMinY,
    maxX: adjustedMaxX,
    maxY: bb.maxY,
    width: adjustedMaxX - adjustedMinX,
    height: bb.maxY - adjustedMinY,
  };
};
