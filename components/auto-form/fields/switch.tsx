"use client";

import React from "react";
import { useController } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { AutoFormFieldProps } from "../types";
import { FieldWrapper } from "./field-wrapper";

export function AutoFormSwitch<T extends Record<string, any>>({
  fieldName,
  control,
  label,
  description,
  disabled,
}: AutoFormFieldProps<T>) {
  const { field } = useController({
    name: fieldName,
    control,
  });

  return (
    <FieldWrapper label={label} description={description}>
      <Switch id={fieldName} checked={field.value} onCheckedChange={field.onChange} disabled={disabled} />
    </FieldWrapper>
  );
}
