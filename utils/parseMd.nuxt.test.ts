import { expect, test } from "vitest";
import { groupListItems, parseMd } from "./parseMd";
import type { MdNode } from "~/shared/types";
import { sanitizeUrl } from "@braintree/sanitize-url";

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
    expect.objectContaining({
      type: "paragraph",
      items: [
        expect.objectContaining({
          type: "text",
          text: "This is a paragraph with ",
        }),
        expect.objectContaining({
          type: "bold",
          text: "bold text",
        }),
        expect.objectContaining({
          type: "text",
          text: " and ",
        }),
        expect.objectContaining({
          type: "italic",
          text: "italic text",
        }),
        expect.objectContaining({
          type: "text",
          text: ".",
        }),
      ],
    }),
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
    expect.objectContaining({
      type: "paragraph",
      items: [
        {
          type: "link",
          raw: "[Link text](https://example.com)",
          text: "Link text",
          href: sanitizeUrl("https://example.com"),
        },
      ],
    }),
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

test("parseMd - basic component parsing", async () => {
  const input = `::note
  This is a note with **rich** text.
  ::`;

  const expectedContent = [
    expect.objectContaining({
      type: "paragraph",
      items: [
        expect.objectContaining({
          type: "text",
          text: "This is a note with ",
        }),
        expect.objectContaining({
          type: "bold",
          text: "rich",
        }),
        expect.objectContaining({
          type: "text",
          text: " text.",
        }),
      ],
    }),
  ] as MdNode[];

  const expectedOutput = [
    expect.objectContaining({
      type: "note",
      items: expectedContent,
    }),
  ];

  const output = await parseMd(input);
  expect(output).toEqual(expectedOutput);
});

test("parseMd - component with props", async () => {
  const input = `::callout{color='primary', icon='trash'}
  This is a callout with **rich** text.
  ::`;

  const expectedContent = [
    expect.objectContaining({
      type: "paragraph",
      items: [
        expect.objectContaining({
          type: "text",
          text: "This is a callout with ",
        }),
        expect.objectContaining({
          type: "bold",
          text: "rich",
        }),
        expect.objectContaining({
          type: "text",
          text: " text.",
        }),
      ],
    }),
  ] as MdNode[];

  const expectedOutput = [
    expect.objectContaining({
      type: "callout",
      items: expectedContent,
      componentProps: expect.objectContaining({
        color: "primary",
        icon: "trash",
      }),
    }),
  ];

  const output = await parseMd(input);
  expect(output).toEqual(expectedOutput);
});

test("parseMd - component with props and nested content", async () => {
  const input = `::accordian
  
  ::accordian-item{label='Item 1', icon='plus'}
  This is the content of item 1.
  ::
  ::
  normal text outside the component.`;

  const expectedOutput = [
    expect.objectContaining({
      type: "accordian",
      items: [
        expect.objectContaining({
          type: "accordian-item",
          componentProps: expect.objectContaining({
            label: "Item 1",
            icon: "plus",
          }),
          items: [
            expect.objectContaining({
              type: "paragraph",
              items: [
                expect.objectContaining({
                  type: "text",
                  text: "This is the content of item 1.",
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    expect.objectContaining({
      type: "paragraph",
      items: [
        expect.objectContaining({
          type: "text",
          text: "normal text outside the component.",
        }),
      ],
    }),
  ];
  const output = await parseMd(input);
  expect(output).toEqual(expectedOutput);
});
