"use client";

import React from "react";
import { useController } from "react-hook-form";
import { cn } from "@/lib/utils";
import { AutoFormFieldProps, SelectOption } from "../types";
import { useFontSize } from "..";
import { FieldWrapper } from "./field-wrapper";

export function AutoFormToggleGroup<T extends Record<string, any>>({
  fieldName,
  control,
  label,
  description,
  required,
  disabled,
  options = [],
}: AutoFormFieldProps<T> & {
  options?: SelectOption[];
}) {
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
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = Array.isArray(field.value)
            ? field.value.includes(option.value)
            : field.value === option.value;
          return (
            <button
              type="button"
              key={option.value}
              className={cn(
                "inline-flex items-center px-4 py-1 rounded-full border transition-colors select-none cursor-pointer font-medium",
                isSelected
                  ? "bg-primary text-white border-primary shadow hover:bg-primary/90 hover:text-white"
                  : "bg-white text-primary border-primary hover:bg-primary/10 hover:text-primary hover:border-primary",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                fontSize,
              )}
              onClick={() => {
                if (Array.isArray(field.value)) {
                  if (field.value.includes(option.value)) {
                    field.onChange(field.value.filter((v: string) => v !== option.value));
                  } else {
                    field.onChange([...field.value, option.value]);
                  }
                } else {
                  field.onChange([option.value]);
                }
              }}
              aria-pressed={isSelected}
              disabled={disabled}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </FieldWrapper>
  );
}
