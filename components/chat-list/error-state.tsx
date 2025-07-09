import { AlertCircle } from "lucide-react";
import useLocale from "@/hooks/use-locale";

interface ErrorStateProps {
  error: Error;
}

export default function ErrorState({ error }: ErrorStateProps) {
  const { t } = useLocale();
  return (
    <div className="flex items-start space-x-4">
      <div className="flex-1 min-w-0">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-gray-800 font-medium mb-2">
            <AlertCircle className="w-4 h-4" />
            <span>{t.list.errorOccurred}</span>
          </div>
          <div className="text-gray-700 text-sm mb-3">{error.message || t.list.unknownError}</div>
        </div>
      </div>
    </div>
  );
}
