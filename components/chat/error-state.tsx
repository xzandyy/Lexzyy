import { AlertCircle, RotateCcw } from "lucide-react";

interface ErrorStateProps {
  error: Error;
  onRetry: () => void;
}

export default function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="group">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
            <AlertCircle className="w-4 h-4 text-white" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-gray-800 font-medium mb-2">
              <AlertCircle className="w-4 h-4" />
              <span>连接失败</span>
            </div>
            <div className="text-gray-700 text-sm mb-3">{error.message || "未知错误，请检查网络连接"}</div>
            <button
              onClick={onRetry}
              className="flex items-center space-x-2 px-3 py-1.5 bg-black text-white rounded-md hover:bg-gray-800 text-sm transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>重试</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
