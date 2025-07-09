"use client";

import React from "react";
import { useController } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AutoFormFieldProps, SelectOption } from "../types";
import { FieldWrapper } from "./field-wrapper";

export function AutoFormRadioGroup<T extends Record<string, any>>({
  fieldName,
  control,
  label,
  description,
  required,
  disabled,
  options = [],
}: AutoFormFieldProps<T> & { options?: SelectOption[] }) {
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
      <RadioGroup value={field.value} onValueChange={field.onChange} disabled={disabled}>
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value} id={option.value} />
            <Label htmlFor={option.value} className="cursor-pointer">
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </FieldWrapper>
  );
}
