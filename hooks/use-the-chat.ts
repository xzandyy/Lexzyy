import { createChatTree } from "@/components/chat-flow/chat-tree";
import { DEFAULT_STYLE_CONFIG } from "@/components/chat-flow/config";
import { calculateTextLayoutMetrics, generateLayoutedElements } from "@/components/chat-flow/flow-utils";
import { StyleConfig } from "@/components/chat-flow/types";
import { useChat } from "@ai-sdk/react";
import { ChatRequestOptions, UIMessage } from "ai";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export default function useTheChat() {
  const {
    status,
    error,
    input,
    handleInputChange,
    messages: srcMessages,
    setMessages: setSrcMessages,
    handleSubmit: srcSubmit,
    stop,
    reload,
  } = useChat();
  // if (status === "streaming") console.log(new Date().toLocaleString());
  const stableMessages = useRef(srcMessages);
  const chatTree = useRef(createChatTree());
  const messageRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [activeNodeId, setActiveNodeId] = useState("");
  const [styleConfig, setStyleConfig] = useState<StyleConfig>(DEFAULT_STYLE_CONFIG);
  const [pendingSubmit, setPendingSubmit] = useState(false);

  // 消息更新
  useMemo(() => {
    if (status !== "streaming") {
      stableMessages.current = srcMessages;
      chatTree.current.updateFromMessages(srcMessages);
    }
  }, [status, srcMessages]);

  // 消息滚动
  const addMessageRef = useCallback((node: HTMLDivElement, message: UIMessage) => {
    messageRefs.current.set(message.id, node);
  }, []);

  const scrollToMessage = useCallback((id: string, behavior: "instant" | "smooth" = "instant") => {
    messageRefs.current.get(id)?.scrollIntoView({ behavior });
  }, []);

  const handleMessageInview = useCallback((id: string) => {
    setActiveNodeId(id);
  }, []);

  // 最终显示的消息
  const isActiveNodeInSrc = useMemo(() => {
    if (activeNodeId) {
      return !!stableMessages.current.findLast((message) => message.id === activeNodeId);
    } else {
      setActiveNodeId(stableMessages.current[stableMessages.current.length - 1]?.id ?? "");
      return true;
    }
  }, [activeNodeId]);

  const activeMessages = useMemo(() => {
    if (!isActiveNodeInSrc) {
      return chatTree.current.getMessagePathFromRootToFirstLeaf(activeNodeId);
    }
    return [];
  }, [activeNodeId, isActiveNodeInSrc]);

  const messagesToShow = isActiveNodeInSrc ? srcMessages : activeMessages;

  // 对话流元素样式
  const getFlowCssVariables = useCallback(() => {
    const textLayoutMetrics = calculateTextLayoutMetrics(styleConfig);
    return {
      "--node-width": `${styleConfig.nodeWidth}px`,
      "--node-height": `${styleConfig.nodeHeight}px`,
      "--node-font-size": `${styleConfig.fontSize}px`,
      "--node-line-height": styleConfig.lineHeight,
      "--node-max-width": `${textLayoutMetrics.maxWidth}px`,
      "--node-text-height": `${textLayoutMetrics.exactTextHeight}px`,
      "--node-line-clamp": textLayoutMetrics.maxCompleteLines,
    } as React.CSSProperties;
  }, [styleConfig]);

  const getLayoutedElements = useCallback(() => {
    return generateLayoutedElements(chatTree.current.tree, styleConfig, activeNodeId, status);
  }, [styleConfig, status, activeNodeId]);

  // 对话节点点击
  const handleNodeClick = useCallback(
    (id: string) => {
      scrollToMessage(id);
    },
    [scrollToMessage],
  );

  // 提交消息（分支不变）
  const handleSubmit = useCallback(
    (options?: ChatRequestOptions) => {
      srcSubmit(undefined, options);
    },
    [srcSubmit],
  );

  // 提交信息（新增分支）
  const handleNewBranchSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      setPendingSubmit(true);
      setSrcMessages(chatTree.current.getMessagePathFromRoot(activeNodeId));
    },
    [activeNodeId, setSrcMessages],
  );

  useEffect(() => {
    if (pendingSubmit) {
      handleSubmit();
      setPendingSubmit(false);
    }
  }, [pendingSubmit, handleSubmit]);

  // 对话节点删除
  const handleNodeDelete = useCallback((id: string) => {
    chatTree.current.removeMessage(id);
  }, []);

  return {
    status,
    error,
    input,
    handleInputChange,
    messagesToShow,
    addMessageRef,
    handleMessageInview,
    styleConfig,
    setStyleConfig,
    getLayoutedElements,
    getFlowCssVariables,
    handleNodeDelete,
    handleNodeClick,
    handleSubmit,
    handleNewBranchSubmit,
    stop,
    reload,
  };
}
