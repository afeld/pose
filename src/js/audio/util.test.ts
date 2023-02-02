import { describe, test, expect } from "@jest/globals";
import {
  MockSpeechRecognitionResult,
  MockSpeechRecognitionResultList,
} from "./mocks";
import { getCommands } from "./util";

describe("getCommands()", () => {
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

    const commands = getCommands(results);
    expect(commands).toEqual(["hello"]);
  });

  test("multiple words", () => {
    const result = new MockSpeechRecognitionResult(
      [
        {
          confidence: 1,
          transcript: "   hello world ",
        },
      ],
      true
    );
    const results = new MockSpeechRecognitionResultList([result]);

    const commands = getCommands(results);
    expect(commands).toEqual(["hello", "world"]);
  });
});
