"use client";

import { lazy } from "react";
import { pluginUIManager } from "@/lib/plugin-manager";
import { testPluginBase } from "./test-plugin";

const TestPluginConfigUI = lazy(() => import("./test-plugin/config-ui"));
const TestPluginResultUI = lazy(() => import("./test-plugin/result-ui"));
const TestPluginIconUI = lazy(() => import("./test-plugin/icon-ui"));

let clientInitialized = false;

export async function initializeClientPlugins() {
  try {
    if (clientInitialized) {
      return;
    }

    pluginUIManager.registerPluginUI(testPluginBase, TestPluginConfigUI, TestPluginResultUI, TestPluginIconUI);

    clientInitialized = true;
  } catch (error) {
    console.error("Failed to initialize client plugins:", error);
    throw error;
  }
}
