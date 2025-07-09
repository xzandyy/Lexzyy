import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { z } from "zod";
import { AutoForm } from "@/components/auto-form";

// 模拟action函数
const action = (name: string) => (data: any) => console.log(`${name}:`, data);

const meta: Meta<typeof AutoForm> = {
  title: "Components/AutoForm",
  component: AutoForm,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "AutoForm 是一个基于集中配置的动态表单生成组件，每个字段的验证规则、默认值和UI配置都集中在一起。",
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story: any) => (
      <div className="w-full max-w-md mx-auto">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// 所有字段类型展示（垂直布局）
export const AllFields: Story = {
  args: {
    config: {
      fields: {
        text: {
          type: "input" as const,
          label: "文本输入",
          validation: z.string().min(1, "请输入文本"),
          placeholder: "请输入文本内容",
        },
        email: {
          type: "email" as const,
          label: "邮箱地址",
          validation: z.string().email("请输入有效邮箱"),
          placeholder: "example@email.com",
        },
        password: {
          type: "password" as const,
          label: "密码",
          validation: z.string().min(8, "密码至少8位"),
          placeholder: "请输入密码",
        },
        age: {
          type: "number" as const,
          label: "年龄",
          validation: z.number().min(18, "年龄必须大于18岁").max(120, "年龄不能超过120岁"),
          placeholder: "请输入年龄",
        },
        phone: {
          type: "tel" as const,
          label: "电话号码",
          validation: z.string().min(10, "请输入有效电话号码"),
          placeholder: "请输入手机号码",
        },
        website: {
          type: "url" as const,
          label: "个人网站",
          validation: z.string().url("请输入有效网址"),
          placeholder: "https://example.com",
        },
        description: {
          type: "textarea" as const,
          label: "个人简介",
          validation: z.string().max(500, "描述不能超过500字符"),
          placeholder: "请简单介绍一下自己...",
        },
        gender: {
          type: "select" as const,
          label: "性别",
          validation: z.enum(["male", "female", "other"]),
          defaultValue: "male" as const,
          options: [
            { value: "male", label: "男" },
            { value: "female", label: "女" },
            { value: "other", label: "其他" },
          ],
        },
        status: {
          type: "radio" as const,
          label: "状态",
          validation: z.enum(["active", "inactive", "pending"]),
          defaultValue: "active" as const,
          options: [
            { value: "active", label: "活跃" },
            { value: "inactive", label: "非活跃" },
            { value: "pending", label: "等待中" },
          ],
        },
        agree: {
          type: "checkbox" as const,
          label: "同意条款",
          validation: z.boolean().refine((val) => val === true, "必须同意条款"),
          description: "点击查看服务条款",
        },
        newsletter: {
          type: "switch" as const,
          label: "订阅新闻",
          validation: z.boolean().default(false),
          defaultValue: true,
          description: "我们会定期发送产品更新和新闻",
        },
        notifications: {
          type: "toggle" as const,
          label: "通知设置",
          validation: z.boolean(),
          defaultValue: false,
        },
        theme: {
          type: "toggle-group" as const,
          label: "主题选择",
          validation: z.enum(["light", "dark", "auto"]),
          defaultValue: "light" as const,
          options: [
            { value: "light", label: "浅色" },
            { value: "dark", label: "深色" },
            { value: "auto", label: "自动" },
          ],
        },
        volume: {
          type: "slider" as const,
          label: "音量",
          validation: z.number().min(0).max(100),
          defaultValue: 50,
          description: "拖动滑块调整音量 (0-100)",
        },
        birthDate: {
          type: "date" as const,
          label: "出生日期",
          validation: z.date(),
          description: "选择你的出生日期",
        },
        code: {
          type: "input-otp" as const,
          label: "验证码",
          validation: z.string().length(6, "验证码必须是6位"),
          description: "请输入6位短信验证码",
        },
      },
    },
    onSubmit: action("all-fields-submitted"),
    submitText: "提交所有字段",
    showReset: true,
  },
  decorators: [
    (Story: any) => (
      <div className="w-full max-w-2xl mx-auto">
        <Story />
      </div>
    ),
  ],
};

// 所有字段类型展示（水平布局）
export const AllFieldsHorizontal: Story = {
  args: {
    config: {
      fields: {
        text: {
          type: "input" as const,
          label: "文本输入",
          validation: z.string().min(1, "请输入文本"),
          placeholder: "请输入文本内容",
        },
        email: {
          type: "email" as const,
          label: "邮箱地址",
          validation: z.string().email("请输入有效邮箱"),
          placeholder: "example@email.com",
        },
        password: {
          type: "password" as const,
          label: "密码",
          validation: z.string().min(8, "密码至少8位"),
          placeholder: "请输入密码",
        },
        age: {
          type: "number" as const,
          label: "年龄",
          validation: z.number().min(18, "年龄必须大于18岁").max(120, "年龄不能超过120岁"),
          placeholder: "请输入年龄",
        },
        phone: {
          type: "tel" as const,
          label: "电话号码",
          validation: z.string().min(10, "请输入有效电话号码"),
          placeholder: "请输入手机号码",
        },
        website: {
          type: "url" as const,
          label: "个人网站",
          validation: z.string().url("请输入有效网址"),
          placeholder: "https://example.com",
        },
        description: {
          type: "textarea" as const,
          label: "个人简介",
          validation: z.string().max(500, "描述不能超过500字符"),
          placeholder: "请简单介绍一下自己...",
        },
        gender: {
          type: "select" as const,
          label: "性别",
          validation: z.enum(["male", "female", "other"]),
          defaultValue: "male" as const,
          options: [
            { value: "male", label: "男" },
            { value: "female", label: "女" },
            { value: "other", label: "其他" },
          ],
        },
        status: {
          type: "radio" as const,
          label: "状态",
          validation: z.enum(["active", "inactive", "pending"]),
          defaultValue: "active" as const,
          options: [
            { value: "active", label: "活跃" },
            { value: "inactive", label: "非活跃" },
            { value: "pending", label: "等待中" },
          ],
        },
        agree: {
          type: "checkbox" as const,
          label: "同意条款",
          validation: z.boolean().refine((val) => val === true, "必须同意条款"),
          description: "点击查看服务条款",
        },
        newsletter: {
          type: "switch" as const,
          label: "订阅新闻",
          validation: z.boolean().default(false),
          defaultValue: true,
          description: "我们会定期发送产品更新和新闻",
        },
        notifications: {
          type: "toggle" as const,
          label: "通知设置",
          validation: z.boolean(),
          defaultValue: false,
        },
        theme: {
          type: "toggle-group" as const,
          label: "主题选择",
          validation: z.enum(["light", "dark", "auto"]),
          defaultValue: "light" as const,
          options: [
            { value: "light", label: "浅色" },
            { value: "dark", label: "深色" },
            { value: "auto", label: "自动" },
          ],
        },
        volume: {
          type: "slider" as const,
          label: "音量",
          validation: z.number().min(0).max(100),
          defaultValue: 50,
          description: "拖动滑块调整音量 (0-100)",
        },
        birthDate: {
          type: "date" as const,
          label: "出生日期",
          validation: z.date(),
          description: "选择你的出生日期",
        },
        code: {
          type: "input-otp" as const,
          label: "验证码",
          validation: z.string().length(6, "验证码必须是6位"),
          description: "请输入6位短信验证码",
        },
      },
    },
    onSubmit: action("all-fields-horizontal-submitted"),
    submitText: "提交所有字段",
    showReset: true,
    layout: "horizontal",
  },
  decorators: [
    (Story: any) => (
      <div className="w-full max-w-3xl mx-auto">
        <Story />
      </div>
    ),
  ],
};

// 基础输入框
export const InputField: Story = {
  args: {
    config: {
      fields: {
        text: {
          type: "input" as const,
          label: "文本输入",
          validation: z.string().min(1, "请输入文本"),
          placeholder: "请输入文本内容",
        },
      },
    },
    onSubmit: action("input-submitted"),
    submitText: "提交",
  },
};

// 邮箱输入框
export const EmailField: Story = {
  args: {
    config: {
      fields: {
        email: {
          type: "email" as const,
          label: "邮箱地址",
          validation: z.string().email("请输入有效邮箱"),
          placeholder: "example@email.com",
        },
      },
    },
    onSubmit: action("email-submitted"),
    submitText: "提交",
  },
};

// 密码输入框
export const PasswordField: Story = {
  args: {
    config: {
      fields: {
        password: {
          type: "password" as const,
          label: "密码",
          validation: z.string().min(8, "密码至少8位"),
          placeholder: "请输入密码",
        },
      },
    },
    onSubmit: action("password-submitted"),
    submitText: "提交",
  },
};

// 数字输入框
export const NumberField: Story = {
  args: {
    config: {
      fields: {
        age: {
          type: "number" as const,
          label: "年龄",
          validation: z.number().min(18, "年龄必须大于18岁").max(120, "年龄不能超过120岁"),
          placeholder: "请输入年龄",
        },
      },
    },
    onSubmit: action("number-submitted"),
    submitText: "提交",
  },
};

// 电话输入框
export const TelField: Story = {
  args: {
    config: {
      fields: {
        phone: {
          type: "tel" as const,
          label: "电话号码",
          validation: z.string().min(10, "请输入有效电话号码"),
          placeholder: "请输入手机号码",
        },
      },
    },
    onSubmit: action("tel-submitted"),
    submitText: "提交",
  },
};

// URL输入框
export const UrlField: Story = {
  args: {
    config: {
      fields: {
        website: {
          type: "url" as const,
          label: "个人网站",
          validation: z.string().url("请输入有效网址"),
          placeholder: "https://example.com",
        },
      },
    },
    onSubmit: action("url-submitted"),
    submitText: "提交",
  },
};

// 文本区域
export const TextareaField: Story = {
  args: {
    config: {
      fields: {
        description: {
          type: "textarea" as const,
          label: "个人简介",
          validation: z.string().max(500, "描述不能超过500字符"),
          placeholder: "请简单介绍一下自己...",
        },
      },
    },
    onSubmit: action("textarea-submitted"),
    submitText: "提交",
  },
};

// 下拉选择器
export const SelectField: Story = {
  args: {
    config: {
      fields: {
        gender: {
          type: "select" as const,
          label: "性别",
          validation: z.enum(["male", "female", "other"]),
          defaultValue: "male" as const,
          options: [
            { value: "male", label: "男" },
            { value: "female", label: "女" },
            { value: "other", label: "其他" },
          ],
        },
      },
    },
    onSubmit: action("select-submitted"),
    submitText: "提交",
  },
};

// 单选按钮组
export const RadioField: Story = {
  args: {
    config: {
      fields: {
        status: {
          type: "radio" as const,
          label: "状态",
          validation: z.enum(["active", "inactive", "pending"]),
          defaultValue: "active" as const,
          options: [
            { value: "active", label: "活跃" },
            { value: "inactive", label: "非活跃" },
            { value: "pending", label: "等待中" },
          ],
        },
      },
    },
    onSubmit: action("radio-submitted"),
    submitText: "提交",
  },
};

// 复选框
export const CheckboxField: Story = {
  args: {
    config: {
      fields: {
        agree: {
          type: "checkbox" as const,
          label: "同意条款",
          validation: z.boolean().refine((val) => val === true, "必须同意条款"),
          description: "点击查看服务条款",
        },
      },
    },
    onSubmit: action("checkbox-submitted"),
    submitText: "提交",
  },
};

// 开关
export const SwitchField: Story = {
  args: {
    config: {
      fields: {
        newsletter: {
          type: "switch" as const,
          label: "订阅新闻",
          validation: z.boolean().default(false),
          defaultValue: true,
          description: "我们会定期发送产品更新和新闻",
        },
      },
    },
    onSubmit: action("switch-submitted"),
    submitText: "提交",
  },
};

// 切换按钮
export const ToggleField: Story = {
  args: {
    config: {
      fields: {
        notifications: {
          type: "toggle" as const,
          label: "通知设置",
          validation: z.boolean(),
          defaultValue: false,
        },
      },
    },
    onSubmit: action("toggle-submitted"),
    submitText: "提交",
  },
};

// 切换按钮组
export const ToggleGroupField: Story = {
  args: {
    config: {
      fields: {
        theme: {
          type: "toggle-group" as const,
          label: "主题选择",
          validation: z.enum(["light", "dark", "auto"]),
          defaultValue: "light" as const,
          options: [
            { value: "light", label: "浅色" },
            { value: "dark", label: "深色" },
            { value: "auto", label: "自动" },
          ],
        },
      },
    },
    onSubmit: action("toggle-group-submitted"),
    submitText: "提交",
  },
};

// 滑动条
export const SliderField: Story = {
  args: {
    config: {
      fields: {
        volume: {
          type: "slider" as const,
          label: "音量",
          validation: z.number().min(0).max(100),
          defaultValue: 50,
          description: "拖动滑块调整音量 (0-100)",
        },
      },
    },
    onSubmit: action("slider-submitted"),
    submitText: "提交",
  },
};

// 日期选择器
export const DateField: Story = {
  args: {
    config: {
      fields: {
        birthDate: {
          type: "date" as const,
          label: "出生日期",
          validation: z.date(),
          description: "选择你的出生日期",
        },
      },
    },
    onSubmit: action("date-submitted"),
    submitText: "提交",
  },
};

// OTP验证码输入
export const OtpField: Story = {
  args: {
    config: {
      fields: {
        code: {
          type: "input-otp" as const,
          label: "验证码",
          validation: z.string().length(6, "验证码必须是6位"),
          description: "请输入6位短信验证码",
        },
      },
    },
    onSubmit: action("otp-submitted"),
    submitText: "提交",
  },
};

// 组合示例 - 用户注册表单
export const UserRegistrationForm: Story = {
  args: {
    config: {
      fields: {
        username: {
          type: "input" as const,
          label: "用户名",
          validation: z.string().min(3, "用户名至少3个字符"),
          placeholder: "请输入用户名",
        },
        email: {
          type: "email" as const,
          label: "邮箱地址",
          validation: z.string().email("请输入有效邮箱"),
          placeholder: "example@email.com",
        },
        password: {
          type: "password" as const,
          label: "密码",
          validation: z.string().min(8, "密码至少8位"),
          placeholder: "请输入密码",
        },
        gender: {
          type: "select" as const,
          label: "性别",
          validation: z.enum(["male", "female", "other"]),
          options: [
            { value: "male", label: "男" },
            { value: "female", label: "女" },
            { value: "other", label: "其他" },
          ],
        },
        birthDate: {
          type: "date" as const,
          label: "出生日期",
          validation: z.date(),
        },
        newsletter: {
          type: "switch" as const,
          label: "订阅新闻",
          validation: z.boolean().default(false),
          defaultValue: true,
          description: "我们会定期发送产品更新",
        },
        terms: {
          type: "checkbox" as const,
          label: "同意条款",
          validation: z.boolean().refine((val) => val === true, "必须同意条款"),
          description: "点击查看服务条款",
        },
      },
    },
    onSubmit: action("registration-submitted"),
    submitText: "注册",
    showReset: true,
  },
};

// 禁用字段示例
export const DisabledFields: Story = {
  args: {
    config: {
      fields: {
        name: {
          type: "input" as const,
          label: "姓名",
          validation: z.string().min(1, "请输入姓名"),
        },
        email: {
          type: "email" as const,
          label: "邮箱",
          validation: z.string().email("请输入有效邮箱"),
          defaultValue: "locked@example.com",
          disabled: true,
          description: "此邮箱已绑定，无法修改",
        },
        age: {
          type: "number" as const,
          label: "年龄",
          validation: z.number().min(18, "年龄必须大于18岁"),
          defaultValue: 25,
          disabled: true,
          description: "年龄信息已锁定",
        },
      },
    },
    onSubmit: action("disabled-submitted"),
    submitText: "更新",
  },
};

// 隐藏字段示例
export const HiddenFields: Story = {
  args: {
    config: {
      fields: {
        publicField: {
          type: "input" as const,
          label: "公开字段",
          validation: z.string(),
          description: "这个字段始终可见",
        },
        hiddenField: {
          type: "input" as const,
          label: "隐藏字段",
          validation: z.string(),
          hidden: true,
        },
        conditionalField: {
          type: "input" as const,
          label: "条件字段",
          validation: z.string().optional(),
          description: "这个字段根据条件显示",
        },
      },
    },
    onSubmit: action("hidden-submitted"),
    submitText: "提交",
  },
};

// 加载状态
export const LoadingState: Story = {
  args: {
    config: {
      fields: {
        name: {
          type: "input" as const,
          label: "姓名",
          validation: z.string().min(1, "请输入姓名"),
        },
        email: {
          type: "email" as const,
          label: "邮箱",
          validation: z.string().email("请输入有效邮箱"),
        },
      },
    },
    onSubmit: action("loading-submitted"),
    loading: true,
    submitText: "提交中...",
  },
};
