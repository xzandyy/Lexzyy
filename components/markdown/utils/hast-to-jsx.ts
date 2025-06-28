import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { HastRoot } from "../types";
import { getPreset } from "./presets";

export function hastToJSX(preset: string, hast: HastRoot) {
  const components = getPreset(preset).markdownComponents;

  return toJsxRuntime(hast, {
    Fragment,
    components,
    ignoreInvalidStyle: true,
    jsx,
    jsxs,
    passKeys: true,
    passNode: true,
  });
}
