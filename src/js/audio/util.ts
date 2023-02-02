export const getCommands = (result: SpeechRecognitionResultList) => {
  // Since `continuous = true`, past results will be included. Just use the most recent one.
  // https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognitionResultList
  const lastResult = result[result.length - 1];
  // since `maxAlternatives = 1`, we only need the first result
  const lastCommand = lastResult[0].transcript;
  return lastCommand.toLowerCase().trim().split(/\s+/);
};
