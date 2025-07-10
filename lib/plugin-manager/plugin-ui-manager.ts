"use client";

import { LazyExoticComponent, ComponentType } from "react";
import {
  PluginUIManager,
  PluginBase,
  PluginUIState,
  PluginConfigUIProps,
  PluginResultUIProps,
  PluginIconUIProps,
} from "./types";

class PluginUIManagerImpl implements PluginUIManager {
  private uiStates: Map<string, PluginUIState<any, any, any>> = new Map();
  private initialized = false;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    if (this.initialized) return;

    try {
      const { initializeClientPlugins } = await import("../../plugins/client-init");
      await initializeClientPlugins();

      this.initialized = true;
      console.log("Plugin UI Manager initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Plugin UI Manager:", error);
    }
  }

  registerPluginUI<TConfig extends Record<string, any>, TArgs extends Record<string, any>, TResult>(
    plugin: PluginBase<TConfig>,
    configUI: LazyExoticComponent<ComponentType<PluginConfigUIProps<TConfig>>>,
    resultUI: LazyExoticComponent<ComponentType<PluginResultUIProps<TArgs, TResult>>>,
    iconUI: LazyExoticComponent<ComponentType<PluginIconUIProps>>,
  ): void {
    const pluginUIState: PluginUIState<TConfig, TArgs, TResult> = {
      base: plugin,
      configUI,
      resultUI,
      iconUI,
    };

    this.uiStates.set(plugin.meta.toolName, pluginUIState);
    console.log(`Plugin UI ${plugin.meta.toolName} registered`);
  }

  getAllPluginMetas(): PluginBase<any>[] {
    return Array.from(this.uiStates.values()).map((state) => state.base);
  }

  getAllPluginConfigs(): Map<string, Record<string, any>> {
    const configs = new Map<string, Record<string, any>>();
    this.uiStates.forEach((state, toolName) => {
      configs.set(toolName, { ...state.base.defaultConfig });
    });
    return configs;
  }

  getConfigUI(toolName: string): LazyExoticComponent<ComponentType<PluginConfigUIProps<any>>> | null {
    const pluginUIState = this.uiStates.get(toolName);
    return pluginUIState?.configUI || null;
  }

  getResultUI(toolName: string): LazyExoticComponent<ComponentType<PluginResultUIProps<any, any>>> | null {
    const pluginUIState = this.uiStates.get(toolName);
    return pluginUIState?.resultUI || null;
  }

  // 获取图标UI
  getIconUI(toolName: string): LazyExoticComponent<ComponentType<PluginIconUIProps>> | null {
    const pluginUIState = this.uiStates.get(toolName);
    return pluginUIState?.iconUI || null;
  }

  getPluginConfig(toolName: string): Record<string, any> | null {
    const pluginUIState = this.uiStates.get(toolName);
    return pluginUIState ? { ...pluginUIState.base.defaultConfig } : null;
  }
}

export const pluginUIManager = new PluginUIManagerImpl();
export default pluginUIManager;
