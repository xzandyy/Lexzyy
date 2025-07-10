import { ChatRequestOptions } from "ai";
import { tool } from "ai";
import { PluginManager, PluginBase, PluginRegister, PluginState, PluginContext } from "./types";

class PluginManagerImpl implements PluginManager {
  plugins: Map<string, PluginState<any, any, any>> = new Map();

  registerPlugin<TConfig extends Record<string, any>, TArgs extends Record<string, any>, TResult>(
    plugin: PluginBase<TConfig>,
    register: PluginRegister<TConfig, TArgs, TResult>,
  ): void {
    try {
      const tool = register.register();

      if (tool instanceof Promise) {
        throw new Error(
          `Plugin ${plugin.meta.toolName} register method should not return a Promise in synchronous context`,
        );
      }

      const pluginState: PluginState<TConfig, TArgs, TResult> = {
        base: plugin,
        register,
        tool,
      };

      this.plugins.set(plugin.meta.toolName, pluginState);
    } catch (error) {
      console.error(`Failed to register plugin ${plugin.meta.toolName}:`, error);
      throw error;
    }
  }

  unregisterPlugin(toolName: string): void {
    this.plugins.delete(toolName);
  }

  hasPlugin(toolName: string): boolean {
    return this.plugins.has(toolName);
  }

  getPlugin<TConfig extends Record<string, any>, TArgs extends Record<string, any>, TResult>(
    toolName: string,
  ): PluginState<TConfig, TArgs, TResult> | undefined {
    return this.plugins.get(toolName) as PluginState<TConfig, TArgs, TResult> | undefined;
  }

  getAllPlugins(): PluginState<any, any, any>[] {
    return Array.from(this.plugins.values());
  }

  getAllPluginNames(): string[] {
    return Array.from(this.plugins.keys());
  }

  getAllPluginBases(): PluginBase<any>[] {
    return Array.from(this.plugins.values()).map((state) => state.base);
  }

  executePlugin<TConfig extends Record<string, any>, TArgs extends Record<string, any>, TResult>(
    toolName: string,
    context: PluginContext<TConfig>,
    args: TArgs,
  ): Promise<TResult> {
    const pluginState = this.getPlugin<TConfig, TArgs, TResult>(toolName);
    if (!pluginState) {
      throw new Error(`Plugin ${toolName} not found`);
    }
    return pluginState.tool.execute(context, args);
  }

  getFinalTools(configs: Record<string, Record<string, any>>, chatOptions: ChatRequestOptions): Record<string, any> {
    const finalTools: Record<string, any> = {};

    // 只处理configs中包含的插件（前端启用的插件）
    for (const [toolName, config] of Object.entries(configs)) {
      const pluginState = this.plugins.get(toolName);
      if (!pluginState) {
        console.warn(`Plugin with toolName ${toolName} not found in registry`);
        continue;
      }

      try {
        const context: PluginContext<any> = {
          config: { ...pluginState.base.defaultConfig, ...config },
          chatOptions,
        };

        finalTools[toolName] = tool({
          description: pluginState.tool.description,
          parameters: pluginState.tool.parameters,
          execute: async (args: any) => {
            try {
              const result = await pluginState.tool.execute(context, args);
              return result;
            } catch (error) {
              throw error;
            }
          },
        });
      } catch (error) {
        console.error(`Failed to create AI tool for plugin ${toolName}:`, error);
      }
    }

    return finalTools;
  }
}

export const pluginManager = new PluginManagerImpl();
export default pluginManager;
