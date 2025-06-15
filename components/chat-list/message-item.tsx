import { forwardRef } from "react";
import { MarkdownRenderer } from "@/components/renderers";
import { UIMessage } from "ai";
import type { Attachment } from "ai";
import { FileText, Download } from "lucide-react";

interface MessageItemProps {
  message: UIMessage;
}

const MessageItem = forwardRef<HTMLDivElement, MessageItemProps>(function MessageItem({ message }, ref) {
  // 渲染附件的函数
  const renderAttachments = (attachments: Attachment[] | undefined) => {
    if (!attachments || attachments.length === 0) return null;

    return (
      <div className="mt-2 space-y-2">
        {attachments.map((attachment, index) => (
          <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
            {attachment.contentType?.startsWith("image/") ? (
              <div className="relative">
                <img
                  src={attachment.url}
                  alt={attachment.name || `附件 ${index + 1}`}
                  className="max-w-full max-h-64 object-contain"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white px-2 py-1 text-xs">
                  {attachment.name}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-gray-50">
                <FileText className="w-5 h-5 text-gray-600" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {attachment.name || `附件 ${index + 1}`}
                  </div>
                  <div className="text-xs text-gray-500">{attachment.contentType}</div>
                </div>
                {attachment.url && (
                  <a
                    href={attachment.url}
                    download={attachment.name}
                    className="text-gray-600 hover:text-gray-800"
                    title="下载文件"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[70%] relative bg-gray-100 text-gray-800 rounded-3xl px-4 py-3">
          <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
          {renderAttachments(message.experimental_attachments)}
          {ref && <div ref={ref} className="absolute bottom-16"></div>}
        </div>
      </div>
    );
  }

  if (message.role === "assistant") {
    return (
      <div className="flex justify-start max-w-full">
        <div className="max-w-full min-w-0 overflow-hidden flex-1">
          <MarkdownRenderer content={message.content} />
          {renderAttachments(message.experimental_attachments)}
        </div>
      </div>
    );
  }

  return null;
});

export default MessageItem;
