import { ChatRequestOptions } from "ai";
import { z } from "zod";
import { LazyExoticComponent, ComponentType } from "react";

// plugin base //
export interface PluginBase<TConfig extends Record<string, any>> {
  meta: PluginMeta;
  defaultConfig: TConfig;
}

export type PluginMeta = {
  name: string;
  description: string;
  toolName: string;
};

// plugin register //
export interface PluginRegister<TConfig extends Record<string, any>, TArgs extends Record<string, any>, TResult> {
  register: () => Promise<PluginTool<TConfig, TArgs, TResult>> | PluginTool<TConfig, TArgs, TResult>;
  unregister: () => Promise<void> | void;
}

export type PluginTool<TConfig extends Record<string, any>, TArgs extends Record<string, any>, TResult> = {
  description: string;
  parameters: z.ZodSchema<TArgs>;
  execute: (context: PluginContext<TConfig>, args: TArgs) => Promise<TResult>;
};

export type PluginContext<TConfig extends Record<string, any>> = {
  config: TConfig;
  chatOptions: ChatRequestOptions;
};

// plugin manager //
export interface PluginManager {
  plugins: Map<string, PluginState<any, any, any>>;
  // register
  registerPlugin: <TConfig extends Record<string, any>, TArgs extends Record<string, any>, TResult>(
    plugin: PluginBase<TConfig>,
    register: PluginRegister<TConfig, TArgs, TResult>,
  ) => Promise<void> | void;
  unregisterPlugin: (toolName: string) => Promise<void> | void;
  // get
  getFinalTools: (configs: Record<string, Record<string, any>>, chatOptions: ChatRequestOptions) => Record<string, any>;
}

export type PluginState<TConfig extends Record<string, any>, TArgs extends Record<string, any>, TResult> = {
  base: PluginBase<TConfig>;
  register: PluginRegister<TConfig, TArgs, TResult>;
  tool: PluginTool<TConfig, TArgs, TResult>;
};

export type AITool<TArgs extends Record<string, any>, TResult> = {
  description: string;
  parameters: z.ZodSchema<TArgs>;
  execute: (args: TArgs) => Promise<TResult>;
};

// plugin config ui //
export interface PluginConfigUIProps<TConfig extends Record<string, any>> {
  config: TConfig;
  onConfigChange: (config: TConfig) => void;
}

// plugin icon ui //
export interface PluginIconUIProps {
  className?: string;
  size?: number;
}

// plugin result ui //
export interface PluginResultUIProps<TArgs extends Record<string, any>, TResult> {
  toolInvocation: PluginToolCall<TArgs, TResult>;
}

export type PluginToolCall<TArgs extends Record<string, any>, TResult> = {
  toolCallId: string;
  toolName: string;
  args: TArgs;
} & (
  | {
      state: "partial-call" | "call";
      result?: never;
    }
  | {
      state: "result";
      result: TResult;
    }
);

// Plugin UI Manager //
export interface PluginUIManager {
  // register
  registerPluginUI: <TConfig extends Record<string, any>, TArgs extends Record<string, any>, TResult>(
    plugin: PluginBase<TConfig>,
    configUI: LazyExoticComponent<ComponentType<PluginConfigUIProps<TConfig>>>,
    resultUI: LazyExoticComponent<ComponentType<PluginResultUIProps<TArgs, TResult>>>,
    iconUI: LazyExoticComponent<ComponentType<PluginIconUIProps>>,
  ) => void;
  // get
  getAllPluginMetas: () => PluginBase<any>[];
  getAllPluginConfigs: () => Map<string, Record<string, any>>;
  getConfigUI: (toolName: string) => LazyExoticComponent<ComponentType<PluginConfigUIProps<any>>> | null;
  getResultUI: (toolName: string) => LazyExoticComponent<ComponentType<PluginResultUIProps<any, any>>> | null;
  getIconUI: (toolName: string) => LazyExoticComponent<ComponentType<PluginIconUIProps>> | null;
  getPluginConfig: (toolName: string) => Record<string, any> | null;
}

export type PluginUIState<TConfig extends Record<string, any>, TArgs extends Record<string, any>, TResult> = {
  base: PluginBase<TConfig>;
  configUI: LazyExoticComponent<ComponentType<PluginConfigUIProps<TConfig>>>;
  resultUI: LazyExoticComponent<ComponentType<PluginResultUIProps<TArgs, TResult>>>;
  iconUI: LazyExoticComponent<ComponentType<PluginIconUIProps>>;
};
