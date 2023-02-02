import { describe, test, expect } from "@jest/globals";
import { getCommand } from "./util";

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

class MockSpeechRecognitionResult extends SpeechList<SpeechRecognitionAlternative> {
  isFinal: boolean;

  constructor(items: SpeechRecognitionAlternative[], isFinal: boolean) {
    super(items);
    this.isFinal = isFinal;
  }
}

class MockSpeechRecognitionResultList extends SpeechList<SpeechRecognitionResult> {}

describe("getting command", () => {
  test("single word", () => {
    const result = new MockSpeechRecognitionResult(
      [
        {
          confidence: 1,
          transcript: "hello",
        },
      ],
      true
    );
    const results = new MockSpeechRecognitionResultList([result]);

    const command = getCommand(results);
    expect(command).toEqual("hello");
  });
});
