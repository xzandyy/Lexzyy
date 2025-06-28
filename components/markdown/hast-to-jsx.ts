import { Element, Root as HastRoot, Nodes } from "hast";
import { ReactElement } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { visit } from "unist-util-visit";
import { urlAttributes } from "html-url-attributes";
import { Components } from "./types";

const safeProtocol = /^(https?|ircs?|mailto|xmpp)$/i;
const charsAfterProtocol = /[/?#]/;

export function defaultUrlTransform(value: string): string {
  const colon = value.indexOf(":");
  const beforeColon = value.slice(0, colon);
  return colon === -1 || charsAfterProtocol.test(beforeColon) || safeProtocol.test(beforeColon) ? value : "";
}

export function hastToJSX(tree: HastRoot, components?: Components): ReactElement {
  visit(tree, transform);

  return toJsxRuntime(tree, {
    Fragment,
    components,
    ignoreInvalidStyle: true,
    jsx,
    jsxs,
    passKeys: true,
    passNode: true,
  });

  function transform(node: Nodes) {
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
  }
}
