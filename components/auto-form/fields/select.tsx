"use client";

import React from "react";
import { useController } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { AutoFormFieldProps, SelectOption } from "../types";
import { useFontSize } from "..";
import { FieldWrapper } from "./field-wrapper";

export function AutoFormSelect<T extends Record<string, any>>({
  fieldName,
  control,
  label,
  placeholder,
  description,
  required,
  disabled,
  options = [],
}: AutoFormFieldProps<T> & { options?: SelectOption[] }) {
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
      <Select value={field.value} onValueChange={field.onChange} disabled={disabled}>
        <SelectTrigger className={cn("w-full", error && "border-destructive", fontSize)}>
          <SelectValue placeholder={placeholder || "请选择..."} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FieldWrapper>
  );
}
