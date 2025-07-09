"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useFontSize, useLayout } from "..";

interface FieldWrapperProps {
  label?: string;
  description?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

export function FieldWrapper({ label, description, required, error, children }: FieldWrapperProps) {
  const fontSize = useFontSize() || "text-sm";
  const layout = useLayout();

  return (
    <div className={cn(layout === "horizontal" ? "flex items-start gap-5" : "space-y-2", fontSize)}>
      {label && (
        <Label
          className={cn(
            fontSize,
            layout === "horizontal" && "flex-shrink-0 w-24 pt-2 text-right",
            required &&
              "after:content-['*'] after:-ml-0.5 after:text-red-500 after:align-top after:relative after:-top-0.5",
          )}
        >
          {label}
        </Label>
      )}
      <div className={cn(layout === "horizontal" ? "flex-1 space-y-1" : "")}>
        {children}
        {description && <p className={cn("text-xs text-muted-foreground mt-1")}>{description}</p>}
        <div className="min-h-[20px] flex items-start mt-1">
          {error && <p className={cn("text-xs font-medium text-destructive")}>{error}</p>}
        </div>
      </div>
    </div>
  );
}
