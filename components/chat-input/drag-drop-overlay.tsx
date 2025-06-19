import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText } from "lucide-react";

interface DragDropOverlayProps {
  isVisible: boolean;
}

const DragDropOverlay = memo(function DragDropOverlay({ isVisible }: DragDropOverlayProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-blue-50 bg-opacity-80 backdrop-blur-sm"
          style={{ pointerEvents: "none" }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl p-8 shadow-2xl border-2 border-dashed border-blue-400 max-w-md mx-4"
          >
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="relative">
                  <Upload className="w-16 h-16 text-blue-500" />
                  <motion.div
                    animate={{ y: [-2, 2, -2] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-2 -right-2"
                  >
                    <FileText className="w-6 h-6 text-blue-600" />
                  </motion.div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">拖拽文件到这里</h3>

              <p className="text-gray-600 mb-4">支持图片、文本文件、PDF等格式</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default DragDropOverlay;
