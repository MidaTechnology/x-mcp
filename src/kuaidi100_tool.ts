import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import axios from "axios";
import * as process from "process";
import { z } from "zod";

// 获取环境变量
const kuaidi100ApiKey = "UcIntYJZ6508";
const kuaidi100ApiUrl = "https://api.kuaidi100.com/stdio/";

// 创建 MCP 服务器
const server = new McpServer({
  name: "kuaidi100-mcp",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
  instructions:
    "查询物流轨迹服务，传入快递单号和手机号，获取对应快递的物流轨迹",
});

// 公共 GET 请求函数
async function httpGet(
  url: string,
  params: Record<string, string>
): Promise<string> {
  try {
    const res = await axios.get(url, { params });
    return res.data;
  } catch (e: any) {
    throw new Error(`HTTP request failed: ${e.message}`);
  }
}

// query_trace 工具
server.tool(
  "query_trace",
  "查询物流轨迹服务，传入快递单号和手机号，获取对应快递的物流轨迹",
  {
    kuaidiNum: { type: "text", description: "快递单号" },
    phone: {
      type: "string",
      description: "手机号，当快递单号为SF开头时必填",
      default: "",
    },
  },
  async ({ args }) => {
    const params = {
      key: kuaidi100ApiKey!,
      kuaidiNum: args.kuaidiNum,
      phone: args.phone || "",
    };
    const response = await httpGet(`${kuaidi100ApiUrl}queryTrace`, params);
    return { content: [{ type: "text", text: response }] };
  }
);

// estimate_time 工具
// server.registerTool(
//   "estimate_time",
//   {
//     description: "预估快递送达时间",
//     schema: {
//       kuaidiCom: { type: "string", description: "快递公司编码" },
//       fromLoc: { type: "string", description: "出发地" },
//       toLoc: { type: "string", description: "目的地" },
//       orderTime: { type: "string", description: "下单时间", default: "" },
//       expType: { type: "string", description: "业务或产品类型" },
//     },
//   },
//   async (
//     args: {
//       kuaidiCom: string;
//       fromLoc: string;
//       toLoc: string;
//       orderTime?: string;
//       expType: string;
//     },
//     extra: RequestHandlerExtra
//   ) => {
//     const params = {
//       key: kuaidi100ApiKey!,
//       kuaidicom: args.kuaidiCom,
//       from: args.fromLoc,
//       to: args.toLoc,
//       orderTime: args.orderTime || "",
//       expType: args.expType,
//     };
//     const response = await httpGet(`${kuaidi100ApiUrl}estimateTime`, params);
//     return { content: [{ type: "text", text: response }] };
//   }
// );

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
