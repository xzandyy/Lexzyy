"use client";

import React from "react";
import { useController } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AutoFormFieldProps } from "../types";
import { useFontSize } from "..";
import { FieldWrapper } from "./field-wrapper";

export function AutoFormInput<T extends Record<string, any>>({
  fieldName,
  control,
  label,
  placeholder,
  description,
  required,
  disabled,
  type = "text",
}: AutoFormFieldProps<T> & { type?: string }) {
  const fontSize = useFontSize() || "text-sm";
  const isNumber = type === "number";
  const {
    field,
    fieldState: { error },
  } = useController({
    name: fieldName,
    control,
    rules: { required: required ? "此字段为必填项" : false },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isNumber) {
      const value = e.target.value;
      if (value === "") {
        field.onChange("");
      } else {
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          field.onChange(numValue);
        } else {
          field.onChange(value);
        }
      }
    } else {
      field.onChange(e.target.value);
    }
  };

  return (
    <FieldWrapper label={label} description={description} required={required} error={error?.message}>
      <Input
        {...field}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(fontSize)}
        onChange={handleChange}
        onInvalid={(e) => e.preventDefault()}
      />
    </FieldWrapper>
  );
}
