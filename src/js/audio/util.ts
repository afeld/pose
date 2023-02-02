export const getCommands = (
  recognitionResults: SpeechRecognitionResultList
) => {
  // since `continuous = true`, there may be multiple
  // https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognitionResultList
  const lastResult = recognitionResults[recognitionResults.length - 1];
  // since `maxAlternatives = 1`, we only need the first result
  const lastCommand = lastResult[0].transcript;
  return lastCommand.toLowerCase().trim().split(/\s+/);
};
