"use client";

import React from "react";
import { useController } from "react-hook-form";
import { Slider } from "@/components/ui/slider";
import { AutoFormFieldProps } from "../types";
import { FieldWrapper } from "./field-wrapper";

export function AutoFormSlider<T extends Record<string, any>>({
  fieldName,
  control,
  label,
  description,
  required,
  disabled,
  min = 0,
  max = 100,
  step = 1,
}: AutoFormFieldProps<T> & { min?: number; max?: number; step?: number }) {
  const { field } = useController({
    name: fieldName,
    control,
  });

  return (
    <FieldWrapper label={label} description={description} required={required}>
      <div className="space-y-3">
        <Slider
          value={[field.value || min]}
          onValueChange={(values) => field.onChange(values[0])}
          max={max}
          min={min}
          step={step}
          disabled={disabled}
          className="w-full"
        />
        <div className="relative flex justify-between text-sm text-muted-foreground">
          <span>{min}</span>
          <span className="absolute left-1/2 transform -translate-x-1/2 font-medium text-foreground">
            {field.value || min}
          </span>
          <span>{max}</span>
        </div>
      </div>
    </FieldWrapper>
  );
}
