"use client";

import React from "react";
import { useController } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Toggle } from "@/components/ui/toggle";

import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { AutoFormFieldProps, SelectOption } from "./types";
import { useFontSize, useLayout } from ".";

interface FieldWrapperProps {
  label?: string;
  description?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

export function FieldWrapper({ label, description, required, error, children }: FieldWrapperProps) {
  const fontSize = useFontSize() || "text-sm";
  const layout = useLayout();

  return (
    <div className={cn(layout === "horizontal" ? "flex items-start gap-5" : "space-y-2", fontSize)}>
      {label && (
        <Label
          className={cn(
            fontSize,
            layout === "horizontal" && "flex-shrink-0 w-24 pt-2 text-right",
            required &&
              "after:content-['*'] after:-ml-0.5 after:text-red-500 after:align-top after:relative after:-top-0.5",
          )}
        >
          {label}
        </Label>
      )}
      <div className={cn(layout === "horizontal" ? "flex-1 space-y-1" : "")}>
        {children}
        {description && <p className={cn("text-xs text-muted-foreground mt-1")}>{description}</p>}
        <div className="min-h-[20px] flex items-start mt-1">
          {error && <p className={cn("text-xs font-medium text-destructive")}>{error}</p>}
        </div>
      </div>
    </div>
  );
}

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

export function AutoFormToggle<T extends Record<string, any>>({
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
      <Toggle
        pressed={field.value}
        onPressedChange={field.onChange}
        disabled={disabled}
        className={cn(
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
          "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
          "data-[state=on]:border-primary",
          fontSize,
        )}
      >
        {field.value ? "已开启" : "已关闭"}
      </Toggle>
    </FieldWrapper>
  );
}

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
