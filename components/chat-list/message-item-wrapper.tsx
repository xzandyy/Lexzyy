import { UIMessage } from "ai";
import { memo, useEffect } from "react";
import MessageItem from "./message-item";
import { useInView } from "react-intersection-observer";

interface MessageItemWrapperProps {
  index: number;
  message: UIMessage;
  onAddMessageRef: (id: string, node: HTMLDivElement | null) => void;
  root: React.RefObject<Element | Document | null>;
  onInViewChange: (inView: boolean, entry: IntersectionObserverEntry, message: UIMessage, index: number) => void;
  onUnmount: (index: number) => void;
}

const MessageItemWrapper = memo(function MessageItemWrapper({
  index,
  message,
  onAddMessageRef,
  root,
  onInViewChange,
  onUnmount,
}: MessageItemWrapperProps) {
  const { ref } = useInView({
    root: root.current,
    rootMargin: "-64px 0px",
    onChange: (inView, entry) => onInViewChange(inView, entry, message, index),
  });

  useEffect(() => {
    return () => onUnmount(index);
  }, [onUnmount, index]);

  return (
    <article ref={ref} className="relative">
      <div ref={(node) => onAddMessageRef(message.id, node)} className="absolute w-8 h-[1px] -top-4 bg-amber-300" />
      <MessageItem message={message} />
    </article>
  );
});

export default MessageItemWrapper;
