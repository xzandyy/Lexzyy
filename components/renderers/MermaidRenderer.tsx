import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";

interface MermaidRendererProps {
  chart: string;
  className?: string;
}

const MermaidRenderer = ({ chart, className = "" }: MermaidRendererProps) => {
  const ref = useRef<HTMLDivElement>(null);

  // 简单验证Mermaid代码是否看起来完整
  const isValidMermaidCode = (code: string): boolean => {
    const trimmedCode = code.trim();

    // 检查是否为空
    if (!trimmedCode) return false;

    // 检查常见的Mermaid图表类型开头
    const validStarts = [
      "graph",
      "flowchart",
      "sequenceDiagram",
      "classDiagram",
      "stateDiagram",
      "erDiagram",
      "gantt",
      "pie",
      "gitgraph",
      "mindmap",
      "timeline",
      "quadrantChart",
      "requirement",
      "journey",
    ];

    const hasValidStart = validStarts.some((start) => trimmedCode.toLowerCase().startsWith(start.toLowerCase()));

    if (!hasValidStart) return false;

    // 对于graph类型，检查方向是否完整
    if (trimmedCode.toLowerCase().startsWith("graph")) {
      const lines = trimmedCode.split("\n");
      const firstLine = lines[0].trim().toLowerCase();

      // graph 后面应该有方向 (TD, TB, BT, RL, LR) 或者至少有一些内容
      if (firstLine === "graph" || firstLine.match(/^graph\s+[a-z]$/)) {
        return false; // 可能还在输入方向
      }
    }

    // 检查是否有基本的图表内容（至少有一个换行或者足够长）
    return trimmedCode.includes("\n") || trimmedCode.length > 20;
  };

  useEffect(() => {
    // 初始化mermaid配置
    mermaid.initialize({
      startOnLoad: false,
      theme: "default",
      securityLevel: "loose",
      fontFamily: "ui-sans-serif, system-ui, sans-serif",
      fontSize: 14,
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: "basis",
      },
      sequence: {
        diagramMarginX: 50,
        diagramMarginY: 10,
        useMaxWidth: true,
      },
      gantt: {
        useMaxWidth: true,
      },
    });

    const renderChart = async () => {
      if (!ref.current) return;

      try {
        // 验证代码是否完整
        if (!isValidMermaidCode(chart)) {
          ref.current.innerHTML = `
            <div class="flex justify-center items-center min-h-[100px] bg-blue-50 border border-blue-200 rounded-lg">
              <div class="text-blue-600 text-sm flex items-center gap-2">
                <div class="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                正在加载图表...
              </div>
            </div>
          `;
          return;
        }

        // 清空之前的内容
        ref.current.innerHTML = "";

        // 生成唯一ID
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;

        // 渲染图表
        const { svg } = await mermaid.render(id, chart);
        ref.current.innerHTML = svg;
      } catch (error) {
        console.warn("Mermaid rendering error (可能是流式传输中):", error);

        // 如果代码看起来不完整，显示加载状态而不是错误
        if (!isValidMermaidCode(chart)) {
          ref.current.innerHTML = `
            <div class="flex justify-center items-center min-h-[100px] bg-blue-50 border border-blue-200 rounded-lg">
              <div class="text-blue-600 text-sm flex items-center gap-2">
                <div class="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                正在加载图表...
              </div>
            </div>
          `;
        } else {
          // 代码看起来完整但渲染失败，显示错误信息
          if (ref.current) {
            ref.current.innerHTML = `
              <div class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                <div class="font-semibold mb-2 flex items-center gap-2">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                  图表渲染失败
                </div>
                <div class="text-sm">${error instanceof Error ? error.message : error}</div>
              </div>
            `;
          }
        }
      }
    };

    // 使用setTimeout进行debounce，避免频繁渲染
    const timeoutId = setTimeout(renderChart, 300);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [chart]);

  return (
    <div className={`my-4 overflow-x-auto ${className}`}>
      <div ref={ref} className="flex justify-center items-center min-h-[100px] bg-white rounded-lg border border-gray-200 p-4" />
    </div>
  );
};

export default MermaidRenderer;
