import "@tensorflow/tfjs";
import { toBinaryMask } from "@tensorflow-models/pose-detection/dist/shared/calculators/render_util";

// https://github.com/tensorflow/tfjs-models/blob/master/body-segmentation/README.md#bodysegmentationtobinarymask
onmessage = async (event) => {
  const { segmentation, color, backgroundColor, drawContour } = event.data;
  return await toBinaryMask(segmentation, color, backgroundColor, drawContour);
};
