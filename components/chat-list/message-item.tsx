import { MarkdownRenderer, AttachmentRenderer, PlainTextRenderer } from "@/components/renderers";
import { UIMessage } from "ai";
import { memo } from "react";

interface MessageItemProps {
  message: UIMessage;
}

const MessageItem = memo(function MessageItem({ message }: MessageItemProps) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[70%] bg-gray-100 text-gray-800 rounded-3xl px-4 py-3">
          <PlainTextRenderer content={message.content} />
          <AttachmentRenderer attachments={message.experimental_attachments} />
        </div>
      </div>
    );
  }

  if (message.role === "assistant") {
    return (
      <div className="flex justify-start max-w-full">
        <div className="max-w-full min-w-0 overflow-hidden flex-1">
          <MarkdownRenderer preset="chat" uid={message.id}>
            {message.content}
          </MarkdownRenderer>
          <AttachmentRenderer attachments={message.experimental_attachments} />
        </div>
      </div>
    );
  }

  return null;
});

export default MessageItem;
