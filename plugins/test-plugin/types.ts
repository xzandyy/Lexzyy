export interface TestPluginConfig {
  enabled: boolean;
  prefix: string;
}

export interface TestPluginArgs {
  firstNumber: number;
  secondNumber: number;
}

export interface TestPluginResult {
  firstNumber: number;
  secondNumber: number;
  result: number;
  formattedResult: string;
  timestamp: string;
}
