import type { Attachment } from "ai";
import { FileText, Download } from "lucide-react";
import Image from "next/image";
import { memo } from "react";

const AttachmentRenderer = memo(function AttachmentRenderer({ attachments }: { attachments?: Attachment[] }) {
  if (!attachments || attachments.length === 0) return null;

  return (
    <div className="mt-2 space-y-2">
      {attachments.map((attachment, index) => (
        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
          {attachment.contentType?.startsWith("image/") ? (
            <div className="relative h-64">
              <Image
                src={attachment.url}
                alt={attachment.name || `附件 ${index + 1}`}
                fill
                className="object-contain"
              />
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
});

export default AttachmentRenderer;
