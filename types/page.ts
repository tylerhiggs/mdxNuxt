export type Page = Omit<
  typeof tables.pages.$inferSelect,
  "path" | "createdAt" | "updatedAt" | "lastUpdatedAt" | "deletedAt"
> & {
  path: {
    id: number;
    title: string;
    emoji: string;
  }[];
  createdAt: number;
  updatedAt: number;
  lastUpdatedAt: number;
  deletedAt?: string;
};

export type Block = typeof tables.blocks.$inferSelect;

export type BlockType = "text" | "table" | "callout" | "image" | "code";

export type PageUpdate = { id: number } & Partial<Omit<Page, "blocks">>;
export type BlockUpdate = {
  pageId: number;
  blockId: number;
  textContent: string;
};

export type PageItem = {
  id: number;
  title: string;
  emoji: string;
  isPublic: boolean;
  isFavorite: boolean;
  lastUpdatedAt: number;
  lastUpdatedByName: string;
};

export type Command =
  | "Upload Image"
  | "Image Url"
  | "Bold"
  | "Italic"
  | "Strikethrough"
  | "Highlighted"
  | "Superscript"
  | "Subscript"
  | "Link"
  | "Inline Code"
  | "Inline Code - Success"
  | "Inline Code - Error"
  | "Inline Code - Warning"
  | "Inline Code - Info"
  | "Inline Code - Primary"
  | "Inline Code - Secondary"
  | "Inline Code - Syntax Highlighted"
  | "Ordered List"
  | "Unordered List"
  | "Code Block"
  | "Blockquote"
  | "Divider"
  | "Heading 1"
  | "Heading 2"
  | "Heading 3"
  | "Icon"
  | "Key Binding"
  | "Accordion"
  | "Badge"
  | "Callout"
  | "Note"
  | "Tip"
  | "Warning"
  | "Caution"
  | "Card"
  | "Card Group"
  | "Code Collapse"
  | "Code Group"
  | "Code Tree"
  | "Collapsible"
  | "Field"
  | "Field Group"
  | "Tabs"
  | "Steps"
  | "Custom Input"
  | "Insert Table";

export type CommandOptions = {
  name?: string;
};
