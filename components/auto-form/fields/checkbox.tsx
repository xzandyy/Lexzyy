"use client";

import React from "react";
import { useController } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { AutoFormFieldProps } from "../types";
import { useFontSize } from "..";
import { FieldWrapper } from "./field-wrapper";

export function AutoFormCheckbox<T extends Record<string, any>>({
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
      <div className="flex items-center space-x-3">
        <Checkbox id={fieldName} checked={field.value} onCheckedChange={field.onChange} disabled={disabled} />
        <span className={fontSize}>{field.value ? "已选中" : "未选中"}</span>
      </div>
    </FieldWrapper>
  );
}
