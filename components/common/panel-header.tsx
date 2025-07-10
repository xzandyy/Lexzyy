import React from "react";

interface PanelHeaderProps {
  label: React.ReactNode;
  children?: React.ReactNode;
}

export function PanelHeader({ label, children }: PanelHeaderProps) {
  return (
    <div className="h-12 flex items-center justify-between px-4 border-b border-gray-200">
      <div className="flex items-center">
        <h2 className="text-sm font-medium text-gray-800">{label}</h2>
      </div>
      {children && <div className="flex items-center space-x-2">{children}</div>}
    </div>
  );
}
