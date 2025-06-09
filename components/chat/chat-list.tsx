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

export default function ChatList({ messages, error, onRetry, lastUserMessageRef }: ChatListProps) {
  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden pt-4">
      <div className="max-w-4xl mx-auto px-12">
        <div className="space-y-8">
          {/* 消息列表 */}
          {messages.map((message, index) => (
            <MessageItem
              key={message.id}
              message={message}
              ref={index === messages.length - 1 && message.role === "user" ? lastUserMessageRef : undefined}
            />
          ))}

          {/* 错误信息、欢迎信息、空白占位 */}
          {error && <ErrorState error={error} onRetry={onRetry} />}
          {messages.length === 0 && !error && <EmptyState />}
          {messages.length > 0 && <div className="min-h-[20vh]"></div>}
          {messages.length > 2 && <div className="min-h-[50vh]"></div>}
        </div>
      </div>
    </div>
  );
}
