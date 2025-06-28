import MessageItem from "./message-item";
import EmptyState from "./empty-state";
import { UIMessage } from "ai";
import { IntersectionObserverProps, PlainChildrenProps, useInView } from "react-intersection-observer";
import { createElement, memo, Ref, useCallback, useRef } from "react";

type MessageRefData = {
  node: HTMLDivElement | null;
  index: number;
};

interface ChatListProps {
  messages: UIMessage[];
  onActiveMessageChange: Function;
}

const ChatList = memo(function ChatList({ messages, onActiveMessageChange }: ChatListProps) {
  const scrollRootRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<Map<string, MessageRefData>>(new Map());
  const isMessageEmpty = messages.length === 0;

  const addMessageRefData = useCallback((id: string, data: MessageRefData) => {
    if (data.node) messageRefs.current.set(id, data);
  }, []);

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden pt-4" ref={scrollRootRef}>
      <div className="max-w-4xl mx-auto px-6">
        <div className="space-y-8">
          {/* 消息列表 */}
          {messages.map((message, index) => (
            <MessageItem message={message} key={message.id} />
            // <FocusInView root={scrollRootRef.current} key={message.id}>
            //   {({ ref }) => (
            //     <MesageRefWrapper
            //       containerRef={ref}
            //       anchorRef={(node) => addMessageRefData(message.id, { node, index })}
            //     >
            //       <MessageItem message={message} />
            //     </MesageRefWrapper>
            //   )}
            // </FocusInView>
          ))}

          {/* 欢迎信息、空白占位 */}
          {isMessageEmpty && <EmptyState />}
          {messages.length > 0 && <div className="min-h-[20vh]"></div>}
          {messages.length > 2 && <div className="min-h-[50vh]"></div>}
        </div>
      </div>
    </div>
  );
});

export default ChatList;

function FocusInView(props: IntersectionObserverProps | PlainChildrenProps) {
  const {
    children,
    root,
    rootMargin,
    threshold,
    trackVisibility,
    triggerOnce,
    skip,
    delay,
    initialInView,
    fallbackInView,
    onChange,
    ...rest
  } = props;

  const { ref, inView, entry } = useInView({
    root,
    rootMargin,
    threshold,
    trackVisibility,
    triggerOnce,
    skip,
    delay,
    initialInView,
    fallbackInView,
    onChange,
  });

  if (typeof children === "function") {
    return children({ inView, entry, ref });
  } else {
    return createElement((props as PlainChildrenProps).as || "div", { ref, ...rest }, children);
  }
}

function MesageRefWrapper({
  children,
  containerRef,
  anchorRef,
}: {
  children: React.ReactNode;
  containerRef?: Ref<HTMLDivElement> | undefined;
  anchorRef?: Ref<HTMLDivElement> | undefined;
}) {
  return (
    <div className="relative" ref={containerRef}>
      <div
        ref={anchorRef}
        className="absolute size-0"
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      ></div>
      {children}
    </div>
  );
}
