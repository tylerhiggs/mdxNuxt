import { expect, test } from "vitest";
import { parseMd } from "./parseMd";
import { MdNode } from "~/shared/types";

test("parseMd - empty input", () => {
  const input = "";
  const expectedOutput = [] as MdNode[];
  const output = parseMd(input);
  expect(output).toEqual(expectedOutput);
});
test("parseMd - single line input", () => {
  const input = "This is a single line of text.";
  const expectedOutput = [
    {
      type: "paragraph",
      raw: "This is a single line of text.",
      text: "This is a single line of text.",
    },
  ];
  const output = parseMd(input);
  expect(output).toEqual(expectedOutput);
});
test("parseMd - headings and paragraphs", () => {
  const input = `# Heading 1
## Heading 2
### Heading 3
This is a paragraph with some text.`;
  const expectedOutput = [
    {
      type: "heading",
      raw: "# Heading 1",
      text: "Heading 1",
      depth: 1,
    },
    {
      type: "heading",
      raw: "## Heading 2",
      text: "Heading 2",
      depth: 2,
    },
    {
      type: "heading",
      raw: "### Heading 3",
      text: "Heading 3",
      depth: 3,
    },
    {
      type: "paragraph",
      raw: "This is a paragraph with some text.",
      text: "This is a paragraph with some text.",
    },
  ];
  const output = parseMd(input);
  expect(output).toEqual(expectedOutput);
});

test("parseMd - basic markdown parsing", () => {
  const input = `# Heading 1
## Heading 2
### Heading 3
This is a paragraph with **bold text** and *italic text*.
- List item 1
- List item 2
[Link text](https://example.com)
`;
  const expectedOutput = [
    {
      type: "heading",
      raw: "# Heading 1",
      text: "Heading 1",
      depth: 1,
    },
    {
      type: "heading",
      raw: "## Heading 2",
      text: "Heading 2",
      depth: 2,
    },
    {
      type: "heading",
      raw: "### Heading 3",
      text: "Heading 3",
      depth: 3,
    },
    {
      type: "paragraph",
      raw: "This is a paragraph with **bold text** and *italic text*.",
      text: "This is a paragraph with bold text and italic text.",
    },
    {
      type: "bold",
      raw: "**bold text**",
      text: "bold text",
    },
    {
      type: "italic",
      raw: "*italic text*",
      text: "italic text",
    },
    {
      type: "list-item",
      raw: "- List item 1",
      text: "List item 1",
    },
    {
      type: "list-item",
      raw: "- List item 2",
      text: "List item 2",
    },
    {
      type: "link",
      raw: "[Link text](https://example.com)",
      text: "Link text",
      href: encodeURIComponent("https://example.com"),
    },
  ];
  const output = parseMd(input);
  expect(output).toEqual(expectedOutput);
});
