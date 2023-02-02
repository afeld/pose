import { describe, test, expect } from "@jest/globals";
import {
  MockSpeechRecognitionResult,
  MockSpeechRecognitionResultList,
} from "./mocks";
import { getCommand } from "./util";

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
