import { expect, test } from "vitest";
import { JSDOM } from "jsdom";
import { parseDom } from "./parseDom";

test("parseDom - formatted paragraph", () => {
  const dom = new JSDOM();
  global.document = dom.window.document;
  global.Node = dom.window.Node;
  const el = document.createElement("p");
  el.innerHTML = "This is a <strong>formatted</strong> paragraph.";
  const output = parseDom(el);
  expect(output).toEqual("This is a **formatted** paragraph.\n");
});
