export const parseDom = (el: Element, listDepth = 0): string => {
  const tagToMarkdown: Record<string, (el: Element) => string> = {
    STRONG: (el) =>
      `**${Array.from(el.childNodes)
        .map((node) =>
          node.nodeType === Node.ELEMENT_NODE
            ? parseDom(node as Element)
            : node.nodeType === Node.TEXT_NODE
              ? node.textContent || ""
              : "",
        )
        .join("")}**`,
    B: (el) =>
      `**${Array.from(el.childNodes)
        .map((node) =>
          node.nodeType === Node.ELEMENT_NODE
            ? parseDom(node as Element)
            : node.nodeType === Node.TEXT_NODE
              ? node.textContent || ""
              : "",
        )
        .join("")}**`,
    EM: (el) =>
      `*${Array.from(el.childNodes)
        .map((node) =>
          node.nodeType === Node.ELEMENT_NODE
            ? parseDom(node as Element)
            : node.nodeType === Node.TEXT_NODE
              ? node.textContent || ""
              : "",
        )
        .join("")}*`,
    I: (el) =>
      `*${Array.from(el.childNodes)
        .map((node) =>
          node.nodeType === Node.ELEMENT_NODE
            ? parseDom(node as Element)
            : node.nodeType === Node.TEXT_NODE
              ? node.textContent || ""
              : "",
        )
        .join("")}*`,
    CODE: (el) =>
      `\`${Array.from(el.childNodes)
        .map((node) =>
          node.nodeType === Node.ELEMENT_NODE
            ? parseDom(node as Element)
            : node.nodeType === Node.TEXT_NODE
              ? node.textContent || ""
              : "",
        )
        .join("")}\``,
    A: (el) => {
      const href = el.getAttribute("href");
      const text = el.textContent || "";
      return href ? `[${text}](${href})` : text;
    },
    H1: (el) =>
      `# ${Array.from(el.childNodes)
        .map((node) =>
          node.nodeType === Node.ELEMENT_NODE
            ? parseDom(node as Element)
            : node.nodeType === Node.TEXT_NODE
              ? node.textContent || ""
              : "",
        )
        .join("")}\n\n`,
    H2: (el) =>
      `## ${Array.from(el.childNodes)
        .map((node) =>
          node.nodeType === Node.ELEMENT_NODE
            ? parseDom(node as Element)
            : node.nodeType === Node.TEXT_NODE
              ? node.textContent || ""
              : "",
        )
        .join("")}\n\n`,
    H3: (el) =>
      `### ${Array.from(el.childNodes)
        .map((node) =>
          node.nodeType === Node.ELEMENT_NODE
            ? parseDom(node as Element)
            : node.nodeType === Node.TEXT_NODE
              ? node.textContent || ""
              : "",
        )
        .join("")}\n\n`,
    H4: (el) =>
      `#### ${Array.from(el.childNodes)
        .map((node) =>
          node.nodeType === Node.ELEMENT_NODE
            ? parseDom(node as Element)
            : node.nodeType === Node.TEXT_NODE
              ? node.textContent || ""
              : "",
        )
        .join("")}\n\n`,
    H5: (el) =>
      `##### ${Array.from(el.childNodes)
        .map((node) =>
          node.nodeType === Node.ELEMENT_NODE
            ? parseDom(node as Element)
            : node.nodeType === Node.TEXT_NODE
              ? node.textContent || ""
              : "",
        )
        .join("")}\n\n`,
    H6: (el) =>
      `###### ${Array.from(el.childNodes)
        .map((node) =>
          node.nodeType === Node.ELEMENT_NODE
            ? parseDom(node as Element)
            : node.nodeType === Node.TEXT_NODE
              ? node.textContent || ""
              : "",
        )
        .join("")}\n\n`,
    UL: (el) =>
      Array.from(el.children)
        .map(
          (li) =>
            `${"  ".repeat(listDepth)}- ${Array.from(li.childNodes)
              .map((node) =>
                node.nodeType === Node.ELEMENT_NODE
                  ? parseDom(node as Element, listDepth + 1)
                  : node.nodeType === Node.TEXT_NODE
                    ? node.textContent || ""
                    : "",
              )
              .join("")}`,
        )
        .join("\n") + "\n",
    OL: (el) =>
      Array.from(el.children)
        .map(
          (li, i) =>
            `${"  ".repeat(listDepth)}${i + 1}. ${Array.from(li.childNodes)
              .map((node) =>
                node.nodeType === Node.ELEMENT_NODE
                  ? parseDom(node as Element, listDepth + 1)
                  : node.nodeType === Node.TEXT_NODE
                    ? node.textContent || ""
                    : "",
              )
              .join("")}`,
        )
        .join("\n") + "\n",
    LI: (el) =>
      Array.from(el.childNodes)
        .map((node) =>
          node.nodeType === Node.ELEMENT_NODE
            ? parseDom(node as Element, listDepth)
            : node.nodeType === Node.TEXT_NODE
              ? node.textContent || ""
              : "",
        )
        .join(""),
    BLOCKQUOTE: (el) =>
      `> ${Array.from(el.childNodes)
        .map((node) =>
          node.nodeType === Node.ELEMENT_NODE
            ? parseDom(node as Element)
            : node.nodeType === Node.TEXT_NODE
              ? node.textContent || ""
              : "",
        )
        .join("")}\n\n`,
    BR: () => "\n",
    P: (el) =>
      `${Array.from(el.childNodes)
        .map((node) =>
          node.nodeType === Node.ELEMENT_NODE
            ? parseDom(node as Element)
            : node.nodeType === Node.TEXT_NODE
              ? node.textContent || ""
              : "",
        )
        .join("")}\n\n`,
    IMG: (el) => {
      const alt = el.getAttribute("alt") || "";
      const src = el.getAttribute("src") || "";
      return src ? `![${alt}](${src})` : "";
    },
  };

  if (tagToMarkdown[el.tagName]) {
    return tagToMarkdown[el.tagName](el);
  }

  if (el.children.length > 0) {
    return Array.from(el.childNodes)
      .map((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          return parseDom(node as Element);
        }
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent || "";
        }
        return "";
      })
      .join("");
  }

  return el.textContent || "";
};
