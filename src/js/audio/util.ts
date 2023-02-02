export const getCommand = (recognitionResults: SpeechRecognitionResultList) => {
  const lastResult = recognitionResults[recognitionResults.length - 1];
  const lastCommand = lastResult[0].transcript;
  return lastCommand.toLowerCase().trim();
};
