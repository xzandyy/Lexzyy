"use client";

import React, { createContext, useContext, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { AutoFormProps, FieldConfig, InferFormData } from "./types";
import { getLazyFieldComponent } from "./fields/lazy-registry";

function FieldLoadingFallback({ label }: { label?: string }) {
  return (
    <div className="space-y-2">
      {label && <div className="h-5 w-20 bg-gray-200/60 rounded animate-pulse"></div>}
      <div className="h-10 w-full bg-gray-200/60 rounded animate-pulse"></div>
      <div className="h-4 w-0"></div>
    </div>
  );
}

function renderField(fieldName: string, fieldConfig: FieldConfig, control: any, required: boolean) {
  if (fieldConfig.hidden) return null;

  const { type, label, placeholder, description, disabled, options } = fieldConfig;

  const commonProps = {
    fieldName,
    control,
    label,
    placeholder,
    description,
    required,
    disabled,
  };

  const LazyFieldComponent = getLazyFieldComponent(type);

  const getFieldSpecificProps = () => {
    switch (type) {
      case "input":
      case "email":
      case "password":
      case "number":
      case "tel":
      case "url":
        return { ...commonProps, type };
      case "select":
      case "radio":
      case "toggle-group":
        return { ...commonProps, options };
      default:
        return commonProps;
    }
  };

  return (
    <Suspense key={fieldName} fallback={<FieldLoadingFallback label={label} />}>
      <LazyFieldComponent {...getFieldSpecificProps()} />
    </Suspense>
  );
}

function buildSchemaFromConfig(config: { fields: Record<string, FieldConfig> }) {
  const schemaFields: Record<string, z.ZodTypeAny> = {};

  Object.entries(config.fields).forEach(([fieldName, fieldConfig]) => {
    schemaFields[fieldName] = fieldConfig.validation;
  });

  return z.object(schemaFields);
}

function buildDefaultValuesFromConfig<T>(config: { fields: Record<string, FieldConfig> }): Partial<T> {
  const defaultValues: Partial<T> = {};

  Object.entries(config.fields).forEach(([fieldName, fieldConfig]) => {
    if (fieldConfig.defaultValue !== undefined) {
      (defaultValues as any)[fieldName] = fieldConfig.defaultValue;
    }
  });

  return defaultValues;
}

function isFieldRequired(validation: z.ZodTypeAny): boolean {
  return !(validation instanceof z.ZodOptional || validation instanceof z.ZodNullable);
}

const FontSizeContext = createContext<string | undefined>(undefined);
export const useFontSize = () => useContext(FontSizeContext);

const LayoutContext = createContext<"vertical" | "horizontal">("vertical");
export const useLayout = () => useContext(LayoutContext);

export function AutoForm<T extends Record<string, FieldConfig>>({
  config,
  onSubmit,
  submitText = "提交",
  resetText = "重置",
  showReset = false,
  loading = false,
  className,
  fontSize = "text-sm",
  layout = "vertical",
}: AutoFormProps<T>) {
  const schema = buildSchemaFromConfig(config);
  const defaultValues = buildDefaultValuesFromConfig<InferFormData<T>>(config);

  const form = useForm<InferFormData<T>>({
    resolver: zodResolver(schema) as any,
    defaultValues: defaultValues as any,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form;

  const handleFormSubmit = async (data: InferFormData<T>) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("表单提交错误:", error);
    }
  };

  return (
    <FontSizeContext.Provider value={fontSize}>
      <LayoutContext.Provider value={layout}>
        <Form {...form}>
          <form onSubmit={handleSubmit(handleFormSubmit)} className={cn("space-y-6", className)}>
            <div className="space-y-2">
              {Object.entries(config.fields).map(([fieldName, fieldConfig]) => {
                const required = isFieldRequired(fieldConfig.validation);
                return renderField(fieldName, fieldConfig, control, required);
              })}
            </div>

            <div className="flex gap-3 pt-5">
              <Button type="submit" disabled={isSubmitting || loading} className="flex-1">
                {isSubmitting || loading ? "提交中..." : submitText}
              </Button>

              {showReset && (
                <Button type="button" variant="outline" onClick={() => reset()} disabled={isSubmitting || loading}>
                  {resetText}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </LayoutContext.Provider>
    </FontSizeContext.Provider>
  );
}

export * from "./types";
export * from "./fields";
