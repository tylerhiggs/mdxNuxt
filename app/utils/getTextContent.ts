import type { MdNode } from "~/shared/types";

export function getTextContent(node: MdNode): string {
  if ("text" in node && node.text) {
    return node.text || "";
  }
  if ("items" in node) {
    return node.items.map(getTextContent).join("");
  }
  return "";
}
