import { describe, test, expect } from "@jest/globals";
import { getCommand } from "./util";

describe("getting command", () => {
  test("single word", () => {
    const alt: SpeechRecognitionAlternative = {
      confidence: 1,
      transcript: "hello",
    };
    const result: SpeechRecognitionResult = {
      isFinal: true,
      0: alt,
      length: 1,
      item: (_index: number) => alt,
      [Symbol.iterator]: function* () {
        yield alt;
      },
    };
    const results: SpeechRecognitionResultList = {
      0: result,
      length: 1,
      item: (_index: number) => result,
      [Symbol.iterator]: function* () {
        yield result;
      },
    };

    const command = getCommand(results);
    expect(command).toEqual("hello");
  });
});
