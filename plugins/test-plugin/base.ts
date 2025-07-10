import { PluginBase } from "@/lib/plugin-manager/types";
import { TestPluginConfig } from "./types";

export const testPluginBase: PluginBase<TestPluginConfig> = {
  meta: {
    name: "计算器",
    description: "一个用于执行数学乘法运算的计算器插件",
    toolName: "calculator",
  },
  defaultConfig: {
    enabled: true,
    prefix: "计算结果: ",
  },
};
