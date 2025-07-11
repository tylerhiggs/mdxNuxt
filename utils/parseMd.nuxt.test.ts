import { expect, test } from "vitest";
import { groupListItems, parseMd } from "./parseMd";
import type {
  LinkNode,
  ListItemNode,
  MdNode,
  ParagraphNode,
} from "~/shared/types";
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
    expect.objectContaining({
      type: "paragraph",
      items: [
        expect.objectContaining({
          type: "text",
          text: "This is a single line of text.",
        }),
      ],
    }),
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
    expect.objectContaining({
      type: "heading",
      depth: 1,
      items: [
        expect.objectContaining({
          type: "text",
          text: "Heading 1",
        }),
      ],
    }),
    expect.objectContaining({
      type: "heading",
      depth: 2,
      items: [
        expect.objectContaining({
          type: "text",
          text: "Heading 2",
        }),
      ],
    }),
    expect.objectContaining({
      type: "heading",
      depth: 3,
      items: [
        expect.objectContaining({
          type: "text",
          text: "Heading 3",
        }),
      ],
    }),
    expect.objectContaining({
      type: "paragraph",
      items: [
        expect.objectContaining({
          type: "text",
          text: "This is a paragraph with some text.",
        }),
      ],
    }),
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
    expect.objectContaining({
      type: "heading",
      depth: 1,
      items: [
        expect.objectContaining({
          type: "text",
          text: "Heading 1",
        }),
      ],
    }),
    expect.objectContaining({
      type: "heading",
      depth: 2,
      items: [
        expect.objectContaining({
          type: "text",
          text: "Heading 2",
        }),
      ],
    }),
    expect.objectContaining({
      type: "heading",
      depth: 3,
      items: [
        expect.objectContaining({
          type: "text",
          text: "Heading 3",
        }),
      ],
    }),
    expect.objectContaining({
      type: "paragraph",
      items: [
        expect.objectContaining({
          type: "text",
          text: "This is a paragraph with ",
        }),
        expect.objectContaining({
          type: "bold",
          items: [
            expect.objectContaining({
              type: "text",
              text: "bold text",
            }),
          ],
        }),
        expect.objectContaining({
          type: "text",
          text: " and ",
        }),
        expect.objectContaining({
          type: "italic",
          items: [
            expect.objectContaining({
              type: "text",
              text: "italic text",
            }),
          ],
        }),
        expect.objectContaining({
          type: "text",
          text: ".",
        }),
      ],
    }),
    expect.objectContaining({
      type: "list-items",
      depth: 0,
      items: [
        expect.objectContaining({
          type: "list-item",
          depth: 0,
          items: [
            expect.objectContaining({
              type: "text",
              text: "List item 1",
            }),
          ],
        }),
        expect.objectContaining({
          type: "list-item",
          depth: 0,
          items: [
            expect.objectContaining({
              type: "text",
              text: "List item 2",
            }),
          ],
        }),
      ],
    }),
    expect.objectContaining({
      type: "paragraph",
      items: [
        expect.objectContaining({
          type: "link",
          title: "Link text",
          href: sanitizeUrl("https://example.com"),
        }),
      ],
    }),
  ];
  const output = await parseMd(input);
  expect(output).toEqual(expectedOutput);
});

test("parseMd - link XXS safety", async () => {
  const input = `[Link text](javascript:alert('XSS'))`;
  const output = await parseMd(input);
  expect((output[0] as ParagraphNode).items[0].type).toEqual("link");
  expect(((output[0] as ParagraphNode).items[0] as LinkNode).href).not.toEqual(
    "javascript:alert('XSS')",
  );
});

test("parseMd - inline code", async () => {
  const input = `This is a paragraph with \`inline code\`.`;
  const expectedOutput = [
    expect.objectContaining({
      type: "paragraph",
      items: [
        expect.objectContaining({
          type: "text",
          text: "This is a paragraph with ",
        }),
        expect.objectContaining({
          type: "inline-code",
          text: "inline code",
        }),
        expect.objectContaining({
          type: "text",
          text: ".",
        }),
      ],
    }),
  ];
  const output = await parseMd(input);
  expect(output).toEqual(expectedOutput);
});

test("parseMd - inline code with options", async () => {
  const input = `This is a paragraph with \`inline code\`{lang='typescript', color='primary'}.`;
  const expectedOutput = [
    expect.objectContaining({
      type: "paragraph",
      items: [
        expect.objectContaining({
          type: "text",
          text: "This is a paragraph with ",
        }),
        expect.objectContaining({
          type: "inline-code",
          language: "typescript",
          color: "primary",
        }),
        expect.objectContaining({
          type: "text",
          text: ".",
        }),
      ],
    }),
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
    expect.objectContaining({
      type: "list-items",
      depth: 0,
      items: [
        expect.objectContaining({
          type: "list-item",
          depth: 0,
          items: [
            expect.objectContaining({
              type: "text",
              text: "List item 1",
            }),
          ],
        }),
        expect.objectContaining({
          type: "list-item",
          depth: 0,
          items: [
            expect.objectContaining({
              type: "text",
              text: "List item 2",
            }),
            expect.objectContaining({
              type: "list-items",
              depth: 1,
              items: [
                expect.objectContaining({
                  type: "list-item",
                  depth: 1,
                  items: [
                    expect.objectContaining({
                      type: "text",
                      text: "Nested item 1",
                    }),
                  ],
                }),
                expect.objectContaining({
                  type: "list-item",
                  depth: 1,
                  items: [
                    expect.objectContaining({
                      type: "text",
                      text: "Nested item 2",
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        expect.objectContaining({
          type: "list-item",
          depth: 0,
          items: [
            expect.objectContaining({
              type: "text",
              text: "List item 3",
            }),
          ],
        }),
      ],
    }),
  ];
  const output = await parseMd(input);
  expect(output).toEqual(expectedOutput);
});

test("parseMd - groupListItems", () => {
  const items: ListItemNode[] = [
    {
      id: "",
      type: "list-item",
      items: [{ id: "", type: "text", text: "Item 1" }],
      depth: 0,
    },
    {
      id: "",
      type: "list-item",
      items: [{ id: "", type: "text", text: "Item 2" }],
      depth: 0,
    },
  ];
  const grouped = groupListItems(items);
  expect(grouped).toEqual([
    expect.objectContaining({
      type: "list-items",
      items,
      depth: 0,
    }),
  ]);
});

test("parseMd - groupListItems with ordered list", () => {
  const items: MdNode[] = [
    {
      id: "",
      type: "ordered-list-item",
      depth: 0,
      items: [{ id: "", type: "text", text: "Item 1" }],
      number: 1,
    },
    {
      id: "",
      type: "ordered-list-item",
      depth: 0,
      items: [{ id: "", type: "text", text: "Item 2" }],
      number: 2,
    },
  ];
  const grouped = groupListItems(items);
  expect(grouped).toEqual([
    expect.objectContaining({
      type: "ordered-list-items",
      items,
      depth: 0,
      orderedListStartIndex: 1,
    }),
  ]);
});

test("parseMd - groupListItems with ordered list - start number 2", () => {
  const items: MdNode[] = [
    {
      id: "",
      type: "ordered-list-item",
      depth: 0,
      number: 2,
      items: [{ id: "", type: "text", text: "Item 1" }],
    },
    {
      id: "",
      number: 1,
      type: "ordered-list-item",
      depth: 0,
      items: [{ id: "", type: "text", text: "Item 2" }],
    },
  ];
  const grouped = groupListItems(items);
  expect(grouped).toEqual([
    expect.objectContaining({
      type: "ordered-list-items",
      items,
      depth: 0,
      orderedListStartIndex: 2,
    }),
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
          items: [
            expect.objectContaining({
              type: "text",
              text: "rich",
            }),
          ],
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
          items: [
            expect.objectContaining({
              type: "text",
              text: "rich",
            }),
          ],
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
  const input = `::accordion

  ::accordion-item{label='Item 1', icon='plus'}
  This is the content of item 1.
  ::
  ::
  normal text outside the component.`;

  const expectedOutput = [
    expect.objectContaining({
      type: "accordion",
      items: [
        expect.objectContaining({
          type: "accordion-item",
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

test("parseMd - MD code block - inner md should be rendered as text", async () => {
  const input = `\`\`\`\`md
\`\`\`
const f = false
\`\`\`
\`\`\`\``;
  const expectedOutput = [
    expect.objectContaining({
      type: "code-block",
      language: "md",
    }),
  ];
  const output = await parseMd(input);
  expect(output).toEqual(expectedOutput);
});

test("parseMd - inline component with props", async () => {
  const input = `This is a paragraph with :icon{name='plus'} inline component.`;
  const expectedOutput = [
    expect.objectContaining({
      type: "paragraph",
      items: [
        expect.objectContaining({
          type: "text",
          text: "This is a paragraph with ",
        }),
        expect.objectContaining({
          type: "icon",
          componentProps: {
            name: "plus",
          },
        }),
        expect.objectContaining({
          type: "text",
          text: " inline component.",
        }),
      ],
    }),
  ];
  const output = await parseMd(input);
  expect(output).toEqual(expectedOutput);
});

test("parseMd - table with headers and rows", async () => {
  const input = `| Header 1 | Header 2 |
| --------- | --------- |
| Row 1 Col 1 | Row 1 Col 2 |
| Row 2 Col 1 | Row 2 Col 2 |`;
  const expectedOutput = [
    expect.objectContaining({
      type: "table",
      headers: [
        [
          expect.objectContaining({
            type: "text",
            text: "Header 1",
          }),
        ],
        [
          expect.objectContaining({
            type: "text",
            text: "Header 2",
          }),
        ],
      ],
      rows: [
        [
          [
            expect.objectContaining({
              type: "text",
              text: "Row 1 Col 1",
            }),
          ],
          [
            expect.objectContaining({
              type: "text",
              text: "Row 1 Col 2",
            }),
          ],
        ],
        [
          [
            expect.objectContaining({
              type: "text",
              text: "Row 2 Col 1",
            }),
          ],
          [
            expect.objectContaining({
              type: "text",
              text: "Row 2 Col 2",
            }),
          ],
        ],
      ],
    }),
  ];
  const output = await parseMd(input);
  expect(output).toEqual(expectedOutput);
});

test("parseMd - table with alignment", async () => {
  const input = `| Header 1 | Header 2 |
| :-------: | ---------: |
| Row 1 Col 1 | Row 1 Col 2 |
| Row 2 Col 1 | Row 2 Col 2 |`;
  const expectedOutput = [
    expect.objectContaining({
      type: "table",
      headers: [
        [
          expect.objectContaining({
            type: "text",
            text: "Header 1",
          }),
        ],
        [
          expect.objectContaining({
            type: "text",
            text: "Header 2",
          }),
        ],
      ],
      rows: [
        [
          [
            expect.objectContaining({
              type: "text",
              text: "Row 1 Col 1",
            }),
          ],
          [
            expect.objectContaining({
              type: "text",
              text: "Row 1 Col 2",
            }),
          ],
        ],
        [
          [
            expect.objectContaining({
              type: "text",
              text: "Row 2 Col 1",
            }),
          ],
          [
            expect.objectContaining({
              type: "text",
              text: "Row 2 Col 2",
            }),
          ],
        ],
      ],
      align: ["center", "right"],
    }),
  ];
  const output = await parseMd(input);
  expect(output).toEqual(expectedOutput);
});
