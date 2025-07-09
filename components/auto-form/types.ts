import { z } from "zod";
import { Control, FieldPath, FieldValues } from "react-hook-form";

export interface AutoFormFieldProps<T extends FieldValues = FieldValues> {
  fieldName: FieldPath<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
}

export type FieldType =
  | "input"
  | "textarea"
  | "select"
  | "checkbox"
  | "radio"
  | "switch"
  | "slider"
  | "calendar"
  | "input-otp"
  | "toggle"
  | "toggle-group"
  | "password"
  | "email"
  | "number"
  | "tel"
  | "url"
  | "date"
  | "datetime-local"
  | "time";

export interface SelectOption {
  value: string;
  label: string;
}

export interface FieldConfig<T = unknown> {
  type: FieldType;
  label: string;
  validation: z.ZodType<T>;
  defaultValue?: T;
  placeholder?: string;
  description?: string;
  disabled?: boolean;
  hidden?: boolean;
  options?: SelectOption[];
}

// 从字段配置推导出表单数据类型
export type InferFormData<T> = {
  [K in keyof T]: T[K] extends FieldConfig<infer U> ? U : never;
};

export interface AutoFormConfig<T = Record<string, FieldConfig>> {
  fields: T;
}

export interface AutoFormProps<T extends Record<string, FieldConfig>> {
  config: { fields: T };
  onSubmit: (data: InferFormData<T>) => void | Promise<void>;
  submitText?: string;
  resetText?: string;
  showReset?: boolean;
  loading?: boolean;
  className?: string;
  /**
   * 全局字号，所有控件、标签、描述、错误提示等都统一字号
   * 如 'text-sm' | 'text-base' | 'text-lg' | 'text-xl' | string
   */
  fontSize?: string;
  /**
   * 布局方式：垂直布局（label在上，控件在下）或水平布局（label在左，控件在右）
   * @default 'vertical'
   */
  layout?: "vertical" | "horizontal";
}
