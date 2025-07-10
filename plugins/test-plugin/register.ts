import { z } from "zod";
import { PluginRegister, PluginTool } from "@/lib/plugin-manager/types";
import { TestPluginConfig, TestPluginArgs, TestPluginResult } from "./types";

export const testPluginRegister: PluginRegister<TestPluginConfig, TestPluginArgs, TestPluginResult> = {
  register: (): PluginTool<TestPluginConfig, TestPluginArgs, TestPluginResult> => ({
    description:
      "执行两个数字的乘法运算，计算 firstNumber × secondNumber。用于处理如 '5*3', '10×8', '计算6乘以6' 等乘法计算请求。",
    parameters: z.object({
      firstNumber: z.number().describe("第一个数字（被乘数）"),
      secondNumber: z.number().describe("第二个数字（乘数）"),
    }),
    execute: async (context, args) => {
      const { firstNumber, secondNumber } = args;
      const { config } = context;

      if (!config.enabled) {
        throw new Error("计算器插件已禁用");
      }

      const result = firstNumber * secondNumber;
      const formattedResult = `${config.prefix}${result}`;

      return {
        firstNumber,
        secondNumber,
        result,
        formattedResult,
        timestamp: new Date().toISOString(),
      };
    },
  }),

  unregister: () => {
    console.log("Calculator plugin unregistered");
  },
};
