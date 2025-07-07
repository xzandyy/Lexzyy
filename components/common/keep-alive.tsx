import React, { ReactNode } from "react";

interface KeepAliveProps {
  cacheKey: string;
  active: boolean;
  children: ReactNode | (() => ReactNode);
  enabled?: boolean;
  immediate?: boolean;
}

const globalCache = new Map<string, boolean>();

export function KeepAlive({ cacheKey, active, children, enabled = true, immediate = true }: KeepAliveProps) {
  const renderChildren = (): ReactNode => {
    if (typeof children === "function") {
      return children();
    }
    return children;
  };

  if (!enabled) {
    return <div className={`h-full ${active ? "block" : "hidden"}`}>{renderChildren()}</div>;
  }

  const hasRendered = globalCache.get(cacheKey);

  if (!immediate && !hasRendered && !active) {
    return <div className={`h-full ${active ? "block" : "hidden"}`}></div>;
  }

  if (!hasRendered) {
    globalCache.set(cacheKey, true);
  }

  return <div className={`h-full ${active ? "block" : "hidden"}`}>{renderChildren()}</div>;
}
