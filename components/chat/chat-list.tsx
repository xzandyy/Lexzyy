import { forwardRef } from "react";
import MessageItem from "./message-item";
import ErrorState from "./error-state";
import EmptyState from "./empty-state";
import { UIMessage } from "ai";

interface ChatListProps {
  messages: UIMessage[];
  error?: Error | null;
  onRetry: () => void;
  lastUserMessageRef?: React.RefObject<HTMLDivElement | null>;
}

const ChatList = forwardRef<HTMLDivElement, ChatListProps>(function ChatList(
  { messages, error, onRetry, lastUserMessageRef },
  ref,
) {
  return (
    <div className="flex-1 overflow-y-auto" ref={ref}>
      <div className="max-w-4xl mx-auto p-6">
        <div className="space-y-8 pt-4 pb-32">
          {/* 消息列表 */}
          {messages.map((message, index) => (
            <div key={message.id} className="group">
              <MessageItem
                message={message}
                ref={index === messages.length - 1 && message.role === "user" ? lastUserMessageRef : undefined}
              />
            </div>
          ))}

          {/* 错误信息 */}
          {error && <ErrorState error={error} onRetry={onRetry} />}

          {/* 空状态 */}
          {messages.length === 0 && !error && <EmptyState />}
        </div>
      </div>
    </div>
  );
});

export default ChatList;
