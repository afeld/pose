import { primaryCommands, secondaryCommands } from "../controllers/actions";

// https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API#chrome_support
const iSpeechGrammarList = window.SpeechGrammarList || webkitSpeechGrammarList;

/**
 * @returns a string in the JSGF format: https://www.w3.org/TR/jsgf/
 */
const createGrammar = (commands: string[]) => {
  const commandStr = commands.join(" | ");
  return `#JSGF V1.0; grammar commands; public <command> = ${commandStr} ;`;
};

export const createGrammarList = () => {
  const speechRecognitionList = new iSpeechGrammarList();

  // give precedence to primary commands, but support the secondary ones too

  const primaryGrammar = createGrammar(primaryCommands());
  speechRecognitionList.addFromString(primaryGrammar, 1);

  const secondaryGrammar = createGrammar(secondaryCommands());
  speechRecognitionList.addFromString(secondaryGrammar, 0.5);

  return speechRecognitionList;
};
