import { pluginManager } from "@/lib/plugin-manager";
import { testPluginBase, testPluginRegister } from "./test-plugin";

let serverInitialized = false;

export async function initializeServerPlugins() {
  try {
    if (serverInitialized) {
      return;
    }

    pluginManager.registerPlugin(testPluginBase, testPluginRegister);

    serverInitialized = true;
  } catch (error) {
    console.error("Failed to initialize server plugins:", error);
    throw error;
  }
}
