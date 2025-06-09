import { forwardRef } from "react";
import { MarkdownRenderer } from "@/components/renderers";
import { UIMessage } from "ai";

interface MessageItemProps {
  message: UIMessage;
}

const MessageItem = forwardRef<HTMLDivElement, MessageItemProps>(function MessageItem({ message }, ref) {
  if (message.role === "user") {
    return (
      <div className="flex items-start space-x-4 justify-end" ref={ref}>
        <div className="max-w-[80%]">
          <div className="bg-gray-100 text-gray-800 rounded-3xl px-4 py-3">
            <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
          </div>
        </div>
      </div>
    );
  }

  if (message.role === "assistant") {
    return (
      <div className="flex items-start space-x-4">
        <div className="flex-1 min-w-0">
          <div className="prose prose-sm max-w-none">
            <MarkdownRenderer content={message.content} />
          </div>
        </div>
      </div>
    );
  }

  return null;
});

export default MessageItem;
