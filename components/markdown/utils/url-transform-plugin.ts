import { visit } from "unist-util-visit";
import { urlAttributes } from "html-url-attributes";
import { HastRoot } from "../types";
import { Element, Nodes } from "hast";

const safeProtocol = /^(https?|ircs?|mailto|xmpp)$/i;
const charsAfterProtocol = /[/?#]/;

export function defaultUrlTransform(value: string): string {
  const colon = value.indexOf(":");
  const beforeColon = value.slice(0, colon);
  return colon === -1 || charsAfterProtocol.test(beforeColon) || safeProtocol.test(beforeColon) ? value : "";
}

export function urlTransformPlugin() {
  return (tree: HastRoot) => {
    visit(tree, (node: Nodes) => {
      if (node.type === "element") {
        const element = node as Element;
        let key: string;

        for (key in urlAttributes) {
          if (Object.hasOwn(urlAttributes, key) && Object.hasOwn(element.properties, key)) {
            const value = element.properties[key];
            const test = urlAttributes[key];
            if (test === null || test.includes(element.tagName)) {
              element.properties[key] = defaultUrlTransform(String(value || ""));
            }
          }
        }
      }
    });
  };
}
