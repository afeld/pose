// define the prefixed objects
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API#chrome_support
//
// upstream contribution:
// https://github.com/DefinitelyTyped/DefinitelyTyped/pull/58434

// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/01906126b2ced50d3119dc09aa64fbe5f4bb9ff2/types/dom-speech-recognition/index.d.ts#L67
declare var webkitSpeechRecognition: {
  prototype: SpeechRecognition;
  new (): SpeechRecognition;
};

// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/01906126b2ced50d3119dc09aa64fbe5f4bb9ff2/types/dom-speech-recognition/index.d.ts#L134
declare var webkitSpeechGrammarList: {
  prototype: SpeechGrammarList;
  new (): SpeechGrammarList;
};
