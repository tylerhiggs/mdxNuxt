import { expect, test } from "vitest";
import { groupListItems, parseMd } from "./parseMd";
import type { MdNode } from "./types";
import { sanitizeUrl } from "@braintree/sanitize-url";
import { de } from "@nuxt/ui/runtime/locale/index.js";

test("parseMd - empty input", async () => {
  const input = "";
  const expectedOutput = [] as MdNode[];
  const output = await parseMd(input);
  expect(output).toEqual(expectedOutput);
});
test("parseMd - single line input", async () => {
  const input = "This is a single line of text.";
  const expectedOutput = [
    {
      type: "paragraph",
      raw: "This is a single line of text.",
      items: [
        {
          type: "text",
          raw: "This is a single line of text.",
          text: "This is a single line of text.",
        },
      ],
    },
  ];
  const output = await parseMd(input);
  expect(output).toEqual(expectedOutput);
});
test("parseMd - headings and paragraphs", async () => {
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
      items: [
        {
          type: "text",
          raw: "This is a paragraph with some text.",
          text: "This is a paragraph with some text.",
        },
      ],
    },
  ];
  const output = await parseMd(input);
  expect(output).toEqual(expectedOutput);
});

test("parseMd - basic markdown parsing", async () => {
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
      items: [
        {
          type: "text",
          raw: "This is a paragraph with ",
          text: "This is a paragraph with ",
        },
        {
          type: "bold",
          raw: "**bold text**",
          text: "bold text",
        },
        {
          type: "text",
          raw: " and ",
          text: " and ",
        },
        {
          type: "italic",
          raw: "*italic text*",
          text: "italic text",
        },
        {
          type: "text",
          raw: ".",
          text: ".",
        },
      ],
    },
    {
      type: "list-items",
      depth: 0,
      raw: "",
      items: [
        {
          type: "list-item",
          raw: "- List item 1",
          depth: 0,
          items: [
            {
              type: "text",
              raw: "List item 1",
              text: "List item 1",
            },
          ],
        },
        {
          type: "list-item",
          raw: "- List item 2",
          depth: 0,
          items: [
            {
              type: "text",
              raw: "List item 2",
              text: "List item 2",
            },
          ],
        },
      ],
    },
    {
      type: "paragraph",
      raw: "[Link text](https://example.com)",
      items: [
        {
          type: "link",
          raw: "[Link text](https://example.com)",
          text: "Link text",
          href: sanitizeUrl("https://example.com"),
        },
      ],
    },
  ];
  const output = await parseMd(input);
  expect(output).toEqual(expectedOutput);
});

test("parseMd - link XXS safety", async () => {
  const input = `[Link text](javascript:alert('XSS'))`;
  const output = await parseMd(input);
  expect(output[0].href).not.toEqual("javascript:alert('XSS')");
});

test("parseMd - inline code", async () => {
  const input = `This is a paragraph with \`inline code\`.`;
  const expectedOutput = [
    {
      type: "paragraph",
      raw: "This is a paragraph with `inline code`.",
      items: [
        {
          type: "text",
          raw: "This is a paragraph with ",
          text: "This is a paragraph with ",
        },
        {
          type: "inline-code",
          raw: "`inline code`",
          text: "inline code",
        },
        {
          type: "text",
          raw: ".",
          text: ".",
        },
      ],
    },
  ];
  const output = await parseMd(input);
  expect(output).toEqual(expectedOutput);
});

test("parseMd - inline code with options", async () => {
  const input = `This is a paragraph with \`inline code\`{lang='typescript', color='primary'}.`;
  // Option 1: Use expect.objectContaining to ignore syntaxHighlightedTokens
  const expectedOutput = [
    {
      type: "paragraph",
      raw: "This is a paragraph with `inline code`{lang='typescript', color='primary'}.",
      items: [
        {
          type: "text",
          raw: "This is a paragraph with ",
          text: "This is a paragraph with ",
        },
        expect.objectContaining({
          type: "inline-code",
          raw: "`inline code`{lang='typescript', color='primary'}",
          text: "inline code",
          language: "typescript",
          color: "primary",
          // syntaxHighlightedTokens is ignored
        }),
        {
          type: "text",
          raw: ".",
          text: ".",
        },
      ],
    },
  ];
  const output = await parseMd(input);
  expect(output).toEqual(expectedOutput);
});

test("parseMd - nested lists", async () => {
  const input = `- List item 1
- List item 2
  - Nested item 1
  - Nested item 2
- List item 3`;
  const expectedOutput = [
    {
      type: "list-items",
      depth: 0,
      raw: "",
      items: [
        {
          type: "list-item",
          raw: "- List item 1",
          depth: 0,
          items: [
            {
              type: "text",
              raw: "List item 1",
              text: "List item 1",
            },
          ],
        },
        {
          type: "list-item",
          raw: "- List item 2",
          depth: 0,
          items: [
            {
              type: "text",
              raw: "List item 2",
              text: "List item 2",
            },
            {
              type: "list-items",
              depth: 1,
              raw: "",
              items: [
                {
                  type: "list-item",
                  raw: "  - Nested item 1",
                  depth: 1,
                  items: [
                    {
                      type: "text",
                      raw: "Nested item 1",
                      text: "Nested item 1",
                    },
                  ],
                },
                {
                  type: "list-item",
                  raw: "  - Nested item 2",
                  depth: 1,
                  items: [
                    {
                      type: "text",
                      raw: "Nested item 2",
                      text: "Nested item 2",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: "list-item",
          raw: "- List item 3",
          depth: 0,
          items: [
            {
              type: "text",
              raw: "List item 3",
              text: "List item 3",
            },
          ],
        },
      ],
    },
  ];
  const output = await parseMd(input);
  expect(output).toEqual(expectedOutput);
});

test("parseMd - groupListItems", () => {
  const items: MdNode[] = [
    {
      type: "list-item",
      raw: "- Item 1",
      items: [{ type: "text", raw: "Item 1", text: "Item 1" }],
    },
    {
      type: "list-item",
      raw: "- Item 2",
      items: [{ type: "text", raw: "Item 2", text: "Item 2" }],
    },
  ];
  const grouped = groupListItems(items);
  expect(grouped).toEqual([
    {
      type: "list-items",
      items,
      raw: "",
      depth: 0,
    },
  ]);
});

test("parseMd - groupListItems with ordered list", () => {
  const items: MdNode[] = [
    {
      type: "ordered-list-item",
      raw: "1. Item 1",
      depth: 0,
      items: [{ type: "text", raw: "Item 1", text: "Item 1" }],
    },
    {
      type: "ordered-list-item",
      raw: "2. Item 2",
      depth: 0,
      items: [{ type: "text", raw: "Item 2", text: "Item 2" }],
    },
  ];
  const grouped = groupListItems(items);
  expect(grouped).toEqual([
    {
      type: "ordered-list-items",
      items,
      depth: 0,
      orderedListStartIndex: 1,
      raw: "",
    },
  ]);
});

test("parseMd - groupListItems with ordered list - start number 2", () => {
  const items: MdNode[] = [
    {
      type: "ordered-list-item",
      raw: "2. Item 1",
      depth: 0,
      items: [{ type: "text", raw: "Item 1", text: "Item 1" }],
    },
    {
      type: "ordered-list-item",
      raw: "1. Item 2",
      depth: 0,
      items: [{ type: "text", raw: "Item 2", text: "Item 2" }],
    },
  ];
  const grouped = groupListItems(items);
  expect(grouped).toEqual([
    {
      type: "ordered-list-items",
      items,
      raw: "",
      depth: 0,
      orderedListStartIndex: 2,
    },
  ]);
});
