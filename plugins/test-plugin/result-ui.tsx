"use client";

import React from "react";
import { Calculator, CheckCircle, Clock, AlertCircle, Loader2 } from "lucide-react";
import { PluginResultUIProps } from "@/lib/plugin-manager/types";
import { TestPluginArgs, TestPluginResult } from "./types";

const ResultUI: React.FC<PluginResultUIProps<TestPluginArgs, TestPluginResult>> = ({ toolInvocation }) => {
  const getStatusIcon = () => {
    switch (toolInvocation.state) {
      case "partial-call":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case "call":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "result":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (toolInvocation.state) {
      case "partial-call":
        return "正在解析计算...";
      case "call":
        return "准备计算";
      case "result":
        return "计算完成";
      default:
        return "未知状态";
    }
  };

  const getStatusBadgeStyle = () => {
    switch (toolInvocation.state) {
      case "partial-call":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      case "call":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
      case "result":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

  return (
    <div className="border border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-900/10 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Calculator className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        {getStatusIcon()}
        <span className="font-medium text-sm text-blue-800 dark:text-blue-200">计算器</span>
        <span className={`px-2 py-1 rounded text-xs ${getStatusBadgeStyle()}`}>{getStatusText()}</span>
      </div>

      {/* 显示计算参数 */}
      {(toolInvocation.state === "call" || toolInvocation.state === "result") && toolInvocation.args && (
        <div className="mb-3">
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">计算参数:</div>
          <div className="bg-gray-100 dark:bg-gray-800 rounded p-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-mono">
                <strong>{toolInvocation.args.firstNumber}</strong>
              </span>
              <span className="text-gray-500">×</span>
              <span className="font-mono">
                <strong>{toolInvocation.args.secondNumber}</strong>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 显示部分调用内容 */}
      {toolInvocation.state === "partial-call" && (
        <div className="text-xs text-gray-600 dark:text-gray-400">正在解析计算参数...</div>
      )}

      {/* 显示计算结果 */}
      {toolInvocation.state === "result" && toolInvocation.result && (
        <div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">计算结果:</div>
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded p-3">
            <div className="text-lg font-mono text-green-800 dark:text-green-300 mb-2">
              {toolInvocation.result.formattedResult}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <div>
                计算过程: {toolInvocation.result.firstNumber} × {toolInvocation.result.secondNumber} ={" "}
                {toolInvocation.result.result}
              </div>
              <div className="text-gray-500">
                执行时间: {new Date(toolInvocation.result.timestamp).toLocaleString("zh-CN")}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultUI;
