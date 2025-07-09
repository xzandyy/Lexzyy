"use client";

import { lazy } from "react";
import { FieldType } from "../types";

const LazyFieldRegistry = {
  input: lazy(() => import("./input").then((m) => ({ default: m.AutoFormInput }))),
  email: lazy(() => import("./input").then((m) => ({ default: m.AutoFormInput }))),
  password: lazy(() => import("./input").then((m) => ({ default: m.AutoFormInput }))),
  number: lazy(() => import("./input").then((m) => ({ default: m.AutoFormInput }))),
  tel: lazy(() => import("./input").then((m) => ({ default: m.AutoFormInput }))),
  url: lazy(() => import("./input").then((m) => ({ default: m.AutoFormInput }))),
  textarea: lazy(() => import("./textarea").then((m) => ({ default: m.AutoFormTextarea }))),
  select: lazy(() => import("./select").then((m) => ({ default: m.AutoFormSelect }))),
  checkbox: lazy(() => import("./checkbox").then((m) => ({ default: m.AutoFormCheckbox }))),
  radio: lazy(() => import("./radio-group").then((m) => ({ default: m.AutoFormRadioGroup }))),
  switch: lazy(() => import("./switch").then((m) => ({ default: m.AutoFormSwitch }))),
  toggle: lazy(() => import("./toggle").then((m) => ({ default: m.AutoFormToggle }))),
  "toggle-group": lazy(() => import("./toggle-group").then((m) => ({ default: m.AutoFormToggleGroup }))),
  slider: lazy(() => import("./slider").then((m) => ({ default: m.AutoFormSlider }))),
  calendar: lazy(() => import("./calendar").then((m) => ({ default: m.AutoFormCalendar }))),
  date: lazy(() => import("./calendar").then((m) => ({ default: m.AutoFormCalendar }))),
  "datetime-local": lazy(() => import("./calendar").then((m) => ({ default: m.AutoFormCalendar }))),
  time: lazy(() => import("./calendar").then((m) => ({ default: m.AutoFormCalendar }))),
  "input-otp": lazy(() => import("./input-otp").then((m) => ({ default: m.AutoFormInputOTP }))),
} as const;

export function getLazyFieldComponent(type: FieldType) {
  return LazyFieldRegistry[type] || LazyFieldRegistry.input;
}
