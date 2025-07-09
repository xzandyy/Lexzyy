"use client";

import React from "react";
import { useController } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { AutoFormFieldProps } from "../types";
import { FieldWrapper } from "./field-wrapper";

export function AutoFormCalendar<T extends Record<string, any>>({
  fieldName,
  control,
  label,
  placeholder,
  description,
  required,
  disabled,
}: AutoFormFieldProps<T>) {
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
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !field.value && "text-muted-foreground",
              error && "border-destructive",
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {field.value ? format(field.value, "PPP") : <span>{placeholder || "选择日期"}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
        </PopoverContent>
      </Popover>
    </FieldWrapper>
  );
}
