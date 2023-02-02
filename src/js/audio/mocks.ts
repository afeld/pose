// Web Speech API classes aren't available in Node, so create mocks

class SpeechList<Type> {
  [index: number]: Type;
  length: number;

  constructor(items: Type[]) {
    this.length = items.length;
    for (const [index, item] of items.entries()) {
      this[index] = item;
    }
  }

  item(index: number) {
    return this[index];
  }
}

export class MockSpeechRecognitionResult extends SpeechList<SpeechRecognitionAlternative> {
  isFinal: boolean;

  constructor(items: SpeechRecognitionAlternative[], isFinal: boolean) {
    super(items);
    this.isFinal = isFinal;
  }
}

export class MockSpeechRecognitionResultList extends SpeechList<SpeechRecognitionResult> {}
