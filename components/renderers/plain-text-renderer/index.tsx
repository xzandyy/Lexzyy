export default function PlainTextRenderer({ content }: { content: string }) {
  return <div className="whitespace-pre-wrap leading-relaxed">{content}</div>;
}
