import { assert, describe, it } from "vitest";
import { ClueDecoder } from "../miniclue/decoder.js";
import { ClueEncoder } from "../miniclue/encoder.js";

describe("ClueEncoder", () => {
  const decoder = new ClueDecoder({});

  it("can encode clues without hints", () => {
    assert.deepEqual(
      decoder.decode(
        "#" + ClueEncoder.encode("Incredible pupil", "eye opening"),
      ),
      {
        clue: "Incredible pupil",
        answer: "eye opening",
      },
    );
  });

  it("can encode clues with hints", () => {
    assert.deepEqual(
      decoder.decode(
        "#" +
          ClueEncoder.encode(
            "Incredible pupil",
            "eye opening",
            "this is a hint",
          ),
      ),
      {
        clue: "Incredible pupil",
        answer: "eye opening",
        hint: "this is a hint",
      },
    );
  });
});
