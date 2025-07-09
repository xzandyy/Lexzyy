"use client";

import React from "react";
import { useController } from "react-hook-form";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import { AutoFormFieldProps } from "../types";
import { useFontSize } from "..";
import { FieldWrapper } from "./field-wrapper";

export function AutoFormToggle<T extends Record<string, any>>({
  fieldName,
  control,
  label,
  description,
  disabled,
}: AutoFormFieldProps<T>) {
  const fontSize = useFontSize() || "text-sm";
  const { field } = useController({
    name: fieldName,
    control,
  });

  return (
    <FieldWrapper label={label} description={description}>
      <Toggle
        pressed={field.value}
        onPressedChange={field.onChange}
        disabled={disabled}
        className={cn(
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
          "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
          "data-[state=on]:border-primary",
          fontSize,
        )}
      >
        {field.value ? "已开启" : "已关闭"}
      </Toggle>
    </FieldWrapper>
  );
}
