import { memo, useCallback, useEffect, useRef } from "react";
import { UIMessage } from "ai";
import EmptyState from "./empty-state";
import ErrorState from "./error-state";
import MessageItemWrapper from "./message-item-wrapper";
import { ChatStatus } from "@/types";

interface ChatListProps {
  status: ChatStatus;
  error: Error | undefined;
  messages: UIMessage[];
  onAddMessageRef: (id: string, node: HTMLDivElement) => void;
  onActiveMessageChange: (id: string, index: number) => void;
}

const ChatList = memo(function ChatList({
  status,
  error,
  messages,
  onAddMessageRef,
  onActiveMessageChange,
}: ChatListProps) {
  const scrollRootRef = useRef<HTMLDivElement>(null);
  const scrollToEndRef = useRef<HTMLDivElement>(null);

  const inViewMessages = useRef<Map<number, string>>(new Map());
  const activeMessage = useRef<{ id: string; index: number }>({
    id: "system",
    index: 0,
  });

  const isLastIsUser = messages.at(-1)!.role === "user";

  const handleUnmount = useCallback((index: number) => {
    inViewMessages.current.delete(index);
  }, []);

  const handleAddMessageRef = useCallback(
    (id: string, node: HTMLDivElement | null) => {
      if (!node) return;
      onAddMessageRef(id, node);
    },
    [onAddMessageRef],
  );

  useEffect(() => {
    if (status === "submitted") {
      scrollToEndRef.current!.scrollIntoView({ behavior: "smooth" });
    }
  }, [status]);

  const handleInviewChange = useCallback(
    (inView: boolean, entry: IntersectionObserverEntry, message: UIMessage, index: number) => {
      if (inView) {
        inViewMessages.current.set(index, message.id);
      } else {
        inViewMessages.current.delete(index);
      }

      if (inViewMessages.current.size > 0) {
        let minIndex = Infinity;
        let minId = "";

        inViewMessages.current.forEach((id, index) => {
          if (id === minId) {
            return;
          }

          if (index < minIndex) {
            minIndex = index;
            minId = id;
          }
        });

        if (minIndex !== Infinity && activeMessage.current.id !== minId) {
          activeMessage.current = { id: minId, index: minIndex };
          onActiveMessageChange(minId, minIndex);
        }
      }
    },
    [onActiveMessageChange],
  );

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden pt-4" ref={scrollRootRef}>
      <div
        className={`max-w-4xl mx-auto px-6 pb-8 space-y-8 ${!isLastIsUser ? "[&>article:last-of-type]:min-h-[calc(100dvh-240px)]" : ""}`}
      >
        {messages.map((message, index) => (
          <MessageItemWrapper
            key={message.id}
            index={index}
            message={message}
            onAddMessageRef={handleAddMessageRef}
            rootRef={scrollRootRef}
            onInViewChange={handleInviewChange}
            onUnmount={handleUnmount}
          />
        ))}

        {messages.length === 0 && <EmptyState />}
        {error && <ErrorState error={error} />}
        {isLastIsUser && <div ref={scrollToEndRef} className="min-h-[calc(100dvh-324px)]" />}
      </div>
    </div>
  );
});

export default ChatList;
