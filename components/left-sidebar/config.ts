import { History, Network, Settings } from "lucide-react";
import { LeftSidebarProps } from "./index";

const defaultConfig: Required<LeftSidebarProps> = {
  defaultActiveTabId: "chat-flow",
  tabs: [
    {
      id: "chat-flow",
      icon: Network,
      label: "对话流",
      component: undefined,
    },
    {
      id: "history",
      icon: History,
      label: "历史记录",
      component: undefined,
    },
    {
      id: "settings",
      icon: Settings,
      label: "设置",
      component: undefined,
    },
  ],
};

export default defaultConfig;
