import { compact } from "lodash";

const separateCommands = (transcript: string) => {
  // sometimes see numbers show up as digits; separate them since we can assume the commands are only single numbers/digits
  const commands = transcript.toLowerCase().split(/\s+|(\d)(\d)/);
  return compact(commands);
};

export const getCommands = (result: SpeechRecognitionResultList) => {
  // Since `continuous = true`, past results will be included. Just use the most recent one.
  // https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognitionResultList
  const lastResult = result[result.length - 1];
  // since `maxAlternatives = 1`, we only need the first result
  const lastTranscript = lastResult[0].transcript;
  return separateCommands(lastTranscript);
};
