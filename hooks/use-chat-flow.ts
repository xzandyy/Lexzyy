import { useChat } from "@ai-sdk/react";
import { ChatRequestOptions, UIMessage } from "ai";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ChatTree from "@/components/chat-flow/chat-tree";
import {
  DEFAULT_STYLE_CONFIG,
  EMPTY_ACTIVE_NODE_DATA,
  ActiveNodeData,
  StyleConfig,
  ActiveWay,
} from "@/components/chat-flow/types";
import useStableCallback from "./use-stable-callback";

function createSystemMessage(content: string) {
  return {
    id: "system",
    role: "system",
    content,
  } as UIMessage;
}

export default function useChatFlow() {
  const systemMessage = createSystemMessage("你是一个AI助手");
  const {
    status,
    error,
    handleInputChange: _handleInputChange,
    messages: srcMessages,
    setMessages: _setSrcMessages,
    handleSubmit: _srcSubmit,
    stop,
    reload,
  } = useChat({
    initialMessages: [systemMessage],
    experimental_throttle: 33.3,
  });

  const handleInputChange = useStableCallback(_handleInputChange);
  const srcSubmit = useStableCallback(_srcSubmit);
  const setSrcMessages = useStableCallback(_setSrcMessages);

  // scroll
  const messageRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const addMessageRefs = useCallback((id: string, ref: HTMLDivElement) => {
    messageRefs.current.set(id, ref);
  }, []);

  const scrollToMessage = useCallback((id: string, behavior: "smooth" | "instant" = "instant") => {
    messageRefs.current.get(id)?.scrollIntoView({ behavior });
  }, []);

  // active node
  const [activeNodeData, setActiveNodeData] = useState<ActiveNodeData>(EMPTY_ACTIVE_NODE_DATA);
  const clickNodeId = useRef<string | null>(null);
  const lastClickTime = useRef(0);
  const clickTimer = useRef<number | null>(null);
  const scrollTimer = useRef<number | null>(null);

  const handleActiveNodeChange = useCallback((id: string, index: number, way: ActiveWay) => {
    const scrollGap = 100;
    const clickGap = 500;

    if (way === "scroll" && Date.now() - lastClickTime.current > scrollGap) {
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
        scrollTimer.current = null;
      }
      scrollTimer.current = window.setTimeout(() => {
        console.log("scroll");
        setActiveNodeData({ id, index, method: "activate" });
        scrollTimer.current = null;
      }, scrollGap);
    }

    if (way === "click") {
      if (id !== clickNodeId.current) {
        clickNodeId.current = id;
        lastClickTime.current = 0;
        clickTimer.current = null;
      }
      if (Date.now() - lastClickTime.current > clickGap) {
        setActiveNodeData({ id, index, method: "jump-fork" });
        console.log("jump-fork");
      } else {
        if (clickTimer.current) {
          clearTimeout(clickTimer.current);
          clickTimer.current = null;
        } else {
          setActiveNodeData({ id, index, method: "jump-node" });
          console.log("jump-node");
        }
        clickTimer.current = window.setTimeout(() => {
          clickTimer.current = null;
        }, clickGap);
      }
      lastClickTime.current = Date.now();
    }
  }, []);

  const handleScrollActiveChange = useCallback(
    (id: string, index: number) => {
      handleActiveNodeChange(id, index, "scroll");
    },
    [handleActiveNodeChange],
  );

  useEffect(() => {
    if (activeNodeData.method.startsWith("jump")) {
      scrollToMessage(activeNodeData.id);
    }
  }, [activeNodeData, scrollToMessage]);

  // style
  const [styleConfig, setStyleConfig] = useState<StyleConfig>(DEFAULT_STYLE_CONFIG);

  const handleStyleConfigChange = useCallback((styleConfig: StyleConfig) => {
    setStyleConfig(styleConfig);
  }, []);

  // chat flow
  const flow = useRef(
    new ChatTree(
      status,
      srcMessages,
      styleConfig,
      activeNodeData,
      {
        onNodeClick: (id: string, index: number) => {
          handleActiveNodeChange(id, index, "click");
        },
      },
      systemMessage,
    ),
  );

  useMemo(() => {
    flow.current.update(status, srcMessages, styleConfig, activeNodeData);
  }, [status, srcMessages, styleConfig, activeNodeData]);

  // submit
  const [pendingSubmit, setPendingSubmit] = useState<ChatRequestOptions | undefined>(undefined);

  const handleSubmit = useCallback(
    (chatRequestOptions?: ChatRequestOptions) => {
      setSrcMessages((prev) => (prev === flow.current.messagesToShow ? [...prev] : flow.current.messagesToShow));
      setPendingSubmit(chatRequestOptions || {});
    },
    [setSrcMessages],
  );

  useEffect(() => {
    if (pendingSubmit) {
      const chatRequestOptions = pendingSubmit;
      setPendingSubmit(undefined);
      srcSubmit(undefined, chatRequestOptions);
    }
  }, [pendingSubmit, srcSubmit]);

  return {
    status,
    handleInputChange,
    handleSubmit,
    stop,
    reload,
    messagesToShow: flow.current.messagesToShow,
    error,
    addMessageRefs,
    handleScrollActiveChange,
    flowElements: flow.current.flowElements,
    flowCSSVariables: flow.current.flowCSSVariables,
    handleStyleConfigChange,
  };
}
