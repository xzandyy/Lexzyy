import React from "react";
import { PanelHeader } from "@/components/common";

export default function Settings() {
  return (
    <div className="h-full flex flex-col">
      <PanelHeader label="设置" />
      <div className="p-4 flex-1">
        <div className="text-sm text-gray-500">暂无设置选项</div>
      </div>
    </div>
  );
}
