import Markdown from "@/components/markdown";
import { components } from "./components";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";

interface MarkdownRendererProps {
  uid: string;
  children: string;
  preset: "chat" | "markdown";
}

const rehypePlugins = [rehypeKatex];
const remarkPlugins = [remarkGfm, remarkMath];

export default function MarkdownRenderer({ uid, children, preset }: MarkdownRendererProps) {
  return (
    <div className="markdown-renderer">
      <Markdown
        preset={preset}
        uid={uid}
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
        components={components}
      >
        {children}
      </Markdown>
    </div>
  );
}
