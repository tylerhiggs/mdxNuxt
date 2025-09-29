import { expect, test, describe } from "vitest";
import { diffLines } from "./diff";
import type { DiffResult } from "./diff";

describe("diffLines", () => {
  test("identical strings", () => {
    const previous = "line1\nline2\nline3";
    const updated = "line1\nline2\nline3";
    const expected: DiffResult = { changes: [] };

    const result = diffLines(previous, updated);
    expect(result).toEqual(expected);
  });

  test("empty strings", () => {
    const previous = "";
    const updated = "";
    const expected: DiffResult = { changes: [] };

    const result = diffLines(previous, updated);
    expect(result).toEqual(expected);
  });

  test("add single line to empty", () => {
    const previous = "";
    const updated = "new line";
    const expected: DiffResult = {
      changes: [
        { type: "changed", lineNum: 0, oldLine: -1, content: "new line" },
      ],
    };

    const result = diffLines(previous, updated);
    expect(result).toEqual(expected);
  });

  test("remove single line", () => {
    const previous = "line to remove";
    const updated = "";
    const expected: DiffResult = {
      changes: [{ type: "changed", lineNum: 0, oldLine: -1, content: "" }],
    };

    const result = diffLines(previous, updated);
    expect(result).toEqual(expected);
  });

  test("add line at beginning", () => {
    const previous = "line2\nline3";
    const updated = "line1\nline2\nline3";
    const expected: DiffResult = {
      changes: [{ type: "added", lineNum: 0, oldLine: -1, content: "line1" }],
    };

    const result = diffLines(previous, updated);
    expect(result).toEqual(expected);
  });

  test("add line in middle", () => {
    const previous = "line1\nline3\n";
    const updated = "line1\n\nline3\n";
    const expected: DiffResult = {
      changes: [{ type: "added", lineNum: 1, oldLine: -1, content: "" }],
    };

    const result = diffLines(previous, updated);
    expect(result).toEqual(expected);
  });

  test("add line at end", () => {
    const previous = "line1\nline2";
    const updated = "line1\nline2\nline3";
    const expected: DiffResult = {
      changes: [{ type: "added", lineNum: 2, oldLine: -1, content: "line3" }],
    };

    const result = diffLines(previous, updated);
    expect(result).toEqual(expected);
  });

  test("remove line from beginning", () => {
    const previous = "line1\nline2\nline3";
    const updated = "line2\nline3";
    const expected: DiffResult = {
      changes: [{ type: "removed", lineNum: 0, oldLine: 0, content: "" }],
    };

    const result = diffLines(previous, updated);
    expect(result).toEqual(expected);
  });

  test("remove line from middle", () => {
    const previous = "line1\nline2\nline3";
    const updated = "line1\nline3";
    const expected: DiffResult = {
      changes: [{ type: "removed", lineNum: 1, oldLine: 1, content: "" }],
    };

    const result = diffLines(previous, updated);
    expect(result).toEqual(expected);
  });

  test("change single line", () => {
    const previous = "old line";
    const updated = "new line";
    const expected: DiffResult = {
      changes: [
        { type: "changed", lineNum: 0, oldLine: -1, content: "new line" },
      ],
    };

    const result = diffLines(previous, updated);
    expect(result).toEqual(expected);
  });
});
