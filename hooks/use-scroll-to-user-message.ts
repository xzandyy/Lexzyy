import { useEffect, useRef } from "react";
import { UIMessage } from "ai";

export default function useScrollToUserMessage(messages: UIMessage[]) {
  const lastUserMessageRef = useRef<HTMLDivElement>(null);

  const scrollToUserMessage = () => {
    if (lastUserMessageRef.current) {
      const userMessage = lastUserMessageRef.current;
      userMessage.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === "user") {
        setTimeout(() => {
          scrollToUserMessage();
        }, 100);
      }
    }
  }, [messages]);

  return {
    lastUserMessageRef,
  };
}
