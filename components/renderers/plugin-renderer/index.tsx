"use client";

import { memo } from "react";
import { CheckCircle, Clock, AlertCircle, Loader2 } from "lucide-react";
import { pluginUIManager } from "@/lib/plugin-manager";

interface ToolInvocation {
  toolCallId: string;
  toolName: string;
  args: Record<string, any>;
  result?: any;
  state: "partial-call" | "call" | "result";
}

interface PluginRendererProps {
  toolInvocations?: ToolInvocation[];
}

const PluginRenderer = memo(function PluginRenderer({ toolInvocations }: PluginRendererProps) {
  if (!toolInvocations || toolInvocations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 mb-4">
      {toolInvocations.map((invocation) => {
        const ResultUI = pluginUIManager.getResultUI(invocation.toolName);

        if (ResultUI) {
          return <ResultUI key={invocation.toolCallId} toolInvocation={invocation} />;
        } else {
          return <DefaultToolInvocationCard key={invocation.toolCallId} toolInvocation={invocation} />;
        }
      })}
    </div>
  );
});

const DefaultToolInvocationCard = memo(function DefaultToolInvocationCard({
  toolInvocation,
}: {
  toolInvocation: ToolInvocation;
}) {
  const statusConfig = {
    "partial-call": {
      icon: <Loader2 className="h-4 w-4 animate-spin text-blue-500" />,
      text: "正在调用工具...",
      style: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
    },
    call: {
      icon: <Clock className="h-4 w-4 text-yellow-500" />,
      text: "等待执行",
      style: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
    },
    result: {
      icon: <CheckCircle className="h-4 w-4 text-green-500" />,
      text: "执行完成",
      style: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
    },
    default: {
      icon: <AlertCircle className="h-4 w-4 text-gray-500" />,
      text: "未知状态",
      style: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300",
    },
  };

  const status = statusConfig[toolInvocation.state] || statusConfig.default;

  return (
    <div className="border border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-900/10 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        {status.icon}
        <span className="font-medium text-sm text-blue-800 dark:text-blue-200">
          工具调用: {toolInvocation.toolName}
        </span>
        <span className={`px-2 py-1 rounded text-xs ${status.style}`}>{status.text}</span>
      </div>
      <div>
        {(toolInvocation.state === "call" || toolInvocation.state === "result") && toolInvocation.args && (
          <div className="mb-3">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">参数:</div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded p-2 text-xs font-mono">
              <pre className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                {JSON.stringify(toolInvocation.args, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {toolInvocation.state === "partial-call" && (
          <div className="text-xs text-gray-600 dark:text-gray-400">正在解析工具调用...</div>
        )}

        {toolInvocation.state === "result" && toolInvocation.result && (
          <div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">结果:</div>
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded p-2 text-xs font-mono">
              <pre className="whitespace-pre-wrap text-green-800 dark:text-green-300">
                {JSON.stringify(toolInvocation.result, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default PluginRenderer;
