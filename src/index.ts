import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { getCreateActivityTool } from "./math_create_file";
import { config } from "process";
import { z } from "zod";

// 创建 MCP 服务器
const server = new McpServer({
  name: "math-mcp",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
  instructions:
    "本 MCP 服务专为 MathWallet Android 项目开发过程设计，提供项目组件的自动化创建与代码生成能力。服务功能和规则如下：\n" +
    "\n" +
    "【服务目标】\n" +
    "- 帮助开发者在 MathWallet Android 项目中快速生成符合规范的代码与配置。\n" +
    "- 保证生成结果遵循 AndroidX 标准和 MathWallet 的项目结构。\n" +
    "\n" +
    "【支持的功能】\n" +
    "1. 创建 Android 组件：\n" +
    "   - Activity\n" +
    "   - Fragment\n" +
    "   - ViewModel\n" +
    "   - Module\n" +
    "   - 其他常见组件（如 XML Layout 文件）\n" +
    "2. 生成配置文件：\n" +
    "   - Gradle 依赖配置\n" +
    "   - 项目常用库的引用模板\n" +
    "3. 钱包相关逻辑支持：\n" +
    "   - EIP712 签名相关 Kotlin 封装\n" +
    "   - 钱包特定 Action（如 Transfer、Send 等）的代码模板\n" +
    "\n" +
    "【输入要求】\n" +
    "- 必须指定生成的组件类型（如 Activity、Fragment、ViewModel、Module 等）。\n" +
    "- 必须指定目标包名（package name）。\n" +
    "- 必须指定生成文件的名称。\n" +
    "- 可选参数：依赖注入方式（Hilt/Koin/无）、UI 框架（Compose/XML）、是否包含示例代码。\n" +
    "\n" +
    "【输出结果】\n" +
    "- 生成对应的 Kotlin、XML 或 Gradle 代码片段。\n" +
    "- 提供生成文件的推荐路径，确保符合 MathWallet Android 项目的目录结构。\n" +
    "- 返回清晰的代码说明，便于开发者直接复制到项目中使用。\n" +
    "\n" +
    "【使用场景】\n" +
    "- 在 MathWallet Android 项目中快速创建新功能模块。\n" +
    "- 在开发过程中避免重复手写模板代码。\n" +
    "- 保证代码风格和项目结构的一致性。\n",
});

// 创建 activity 工具
const createActivity = getCreateActivityTool();
server.tool(
  createActivity.name,
  createActivity.description,
  {
  },
  createActivity.handler
);

async function init() {}

async function main() {
  const transport = new StdioServerTransport();
  await init();
  await server.connect(transport);
  console.error("MCP Server running on stdio @Xing");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
