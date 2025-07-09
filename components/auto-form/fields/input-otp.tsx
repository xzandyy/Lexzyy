"use client";

import React from "react";
import { useController } from "react-hook-form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { AutoFormFieldProps } from "../types";
import { FieldWrapper } from "./field-wrapper";

export function AutoFormInputOTP<T extends Record<string, any>>({
  fieldName,
  control,
  label,
  description,
  required,
  disabled,
  length = 6,
}: AutoFormFieldProps<T> & { length?: number }) {
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
      <InputOTP maxLength={length} value={field.value} onChange={field.onChange} disabled={disabled}>
        <InputOTPGroup>
          {Array.from({ length }).map((_, index) => (
            <InputOTPSlot key={index} index={index} />
          ))}
        </InputOTPGroup>
      </InputOTP>
    </FieldWrapper>
  );
}
