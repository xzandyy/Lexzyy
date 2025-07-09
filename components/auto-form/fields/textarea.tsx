"use client";

import React from "react";
import { useController } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { AutoFormFieldProps } from "../types";
import { useFontSize } from "..";
import { FieldWrapper } from "./field-wrapper";

export function AutoFormTextarea<T extends Record<string, any>>({
  fieldName,
  control,
  label,
  placeholder,
  description,
  required,
  disabled,
}: AutoFormFieldProps<T>) {
  const fontSize = useFontSize() || "text-sm";
  const {
    field,
    fieldState: { error },
  } = useController({
    name: fieldName,
    control,
    rules: { required: required ? "此字段为必填项" : false },
  });

  return (
    <FieldWrapper label={label} description={description} required={required} error={error?.message}>
      <Textarea {...field} placeholder={placeholder} disabled={disabled} className={cn(fontSize)} />
    </FieldWrapper>
  );
}
