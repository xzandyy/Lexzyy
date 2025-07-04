import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  error: Error;
}

export default function ErrorState({ error }: ErrorStateProps) {
  return (
    <div className="flex items-start space-x-4">
      <div className="flex-1 min-w-0">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-gray-800 font-medium mb-2">
            <AlertCircle className="w-4 h-4" />
            <span>发生错误</span>
          </div>
          <div className="text-gray-700 text-sm mb-3">{error.message || "未知错误"}</div>
        </div>
      </div>
    </div>
  );
}
