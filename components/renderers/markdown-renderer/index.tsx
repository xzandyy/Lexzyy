import Markdown from "@/components/markdown";
import "katex/dist/katex.min.css";

interface MarkdownRendererProps {
  uid: string;
  children: string;
  preset: string;
}

export default function MarkdownRenderer({ uid, children, preset }: MarkdownRendererProps) {
  return (
    <div className="markdown-renderer">
      <Markdown preset={preset} uid={uid}>
        {children}
      </Markdown>
    </div>
  );
}
