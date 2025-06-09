import { MessageCircle } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="h-[50vh] flex items-center justify-center">
      <div className="text-center text-gray-500">
        <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <h3 className="text-xl font-medium mb-2 text-gray-700">开始新对话</h3>
        <p className="text-gray-500">我是Frychic，可以帮你解答问题、协助工作或进行创意讨论</p>
        <div className="text-xs text-gray-400 mt-3">支持 Markdown、代码高亮、数学公式、图表和 Emoji 😊</div>
      </div>
    </div>
  );
}
