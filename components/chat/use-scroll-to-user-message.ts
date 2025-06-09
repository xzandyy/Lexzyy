import { useEffect, useRef } from "react";
import { UIMessage } from "ai";

export function useScrollToUserMessage(messages: UIMessage[]) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const lastUserMessageRef = useRef<HTMLDivElement>(null);

  // 滚动到用户消息的函数
  const scrollToUserMessage = () => {
    if (lastUserMessageRef.current && messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      const userMessage = lastUserMessageRef.current;

      // 计算滚动位置，让用户消息显示在容器上方1/3处
      const containerHeight = container.clientHeight;
      const messageTop = userMessage.offsetTop;
      const targetScrollTop = messageTop - containerHeight * 0.2;

      container.scrollTo({
        top: Math.max(0, targetScrollTop),
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    // 只在用户发送新消息时触发滚动定位
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === "user") {
        // 延迟执行，确保DOM已更新
        setTimeout(() => {
          scrollToUserMessage();
        }, 100);
      }
    }
  }, [messages.length, messages]);

  return {
    messagesContainerRef,
    lastUserMessageRef,
  };
}
