import { MarkdownPreset } from "../types";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { components } from "../components/components";

const presets: Record<string, MarkdownPreset> = {};

export function registerPreset(name: string, preset: MarkdownPreset) {
  presets[name] = preset;
}

export function getPreset(name: string) {
  return presets[name];
}

export function initPresets() {
  registerPreset("chat-message", {
    markdownToHastProcessorOptions: {
      remarkPlugins: [remarkGfm, remarkMath],
      rehypePlugins: [rehypeKatex],
    },
    markdownComponents: components,
  });
}
