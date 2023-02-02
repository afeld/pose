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

  test("multiple results should just give the last", () => {
    const result1 = new MockSpeechRecognitionResult(
      [
        {
          confidence: 1,
          transcript: "   hello world ",
        },
      ],
      true
    );
    const result2 = new MockSpeechRecognitionResult(
      [
        {
          confidence: 1,
          transcript: "see ya ",
        },
      ],
      true
    );
    const results = new MockSpeechRecognitionResultList([result1, result2]);

    const commands = getCommands(results);
    expect(commands).toEqual(["see", "ya"]);
  });
});
