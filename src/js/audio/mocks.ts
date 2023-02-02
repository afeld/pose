// Web Speech API classes aren't available in Node, so create mocks

class SpeechList<Type> extends Array<Type> {
  item(index: number) {
    return this[index];
  }
}

export class MockSpeechRecognitionResult extends SpeechList<SpeechRecognitionAlternative> {
  isFinal: boolean;

  constructor(items: SpeechRecognitionAlternative[], isFinal: boolean) {
    super(...items);
    this.isFinal = isFinal;
  }
}

export class MockSpeechRecognitionResultList extends SpeechList<SpeechRecognitionResult> {}
