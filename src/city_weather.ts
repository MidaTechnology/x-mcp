import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import axios from "axios";
import { z } from "zod";

// 创建 MCP Server

// Server setup
const server = new McpServer({
  name: "xing-weather-mcp",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
  instructions:
    "获取城市的经纬度信息，和当天的温度和天气信息。使用场景包括但不限于：\n" +
    "1. 旅行规划：帮助用户了解目的地的天气情况，便于安排行程。\n" +
    "2. 日常生活：提供天气预报，帮助用户决定穿衣和出行方式。\n" +
    "3. 活动安排：根据天气情况调整户外活动的时间和地点。\n" +
    "4. 健康管理：提醒用户注意天气变化，预防感冒等疾病。\n" +
    "5. 农业生产：帮助农民了解天气情况，合理安排农作。\n" +
    "6. 交通出行：提供天气信息，帮助用户选择合适的出行方式。\n" +
    "7. 紧急预警：在极端天气情况下，及时通知用户采取防护措施。\n",
});

// Tool 1: 城市名 -> 经纬度
// server.tool(
//   "get_city_coordinates",
//   "输入城市名，返回经纬度信息",
//   {
//     citys: z.string().describe('要查询的城市，比如"北京"。'),
//   },
//   async ({ citys }) => {
//     const res = await axios.get(
//       "https://geocoding-api.open-meteo.com/v1/search",
//       {
//         params: {
//           name: citys,
//           count: 1,
//           language: "zh",
//           format: "json",
//         },
//       }
//     );

//     if (!res.data.results || res.data.results.length === 0) {
//       return {
//         content: [{ type: "text", text: "未找到城市" }],
//       };
//     }

//     const data = res.data.results[0];

//     return {
//       content: [{ type: "text", text: JSON.stringify(data) }],
//     };
//   }
// );

// // Tool 2: 经纬度 -> 当天温度
// server.registerTool(
//   "get_temperature_today",
//   {
//     title: "获取当天温度",
//     description: "输入经纬度，返回当天的气温，也仅仅只有温度没有其它天气信息。",
//     inputSchema: {
//       latitude: z.number().describe("纬度"),
//       longitude: z.number().describe("经度"),
//     },
//   },
//   async ({ latitude, longitude }) => {
//     const res = await axios.get("https://api.open-meteo.com/v1/forecast", {
//       params: {
//         latitude: latitude,
//         longitude: longitude,
//         current: "temperature_2m",
//       },
//     });

//     return {
//       content: [
//         {
//           type: "text",
//           text: `当天温度：${res.data.current.temperature_2m}°C`,
//         },
//       ],
//     };
//   }
// );

// // 通过经纬度获取天气
// server.registerTool(
//   "get_weather_today",
//   {
//     title: "获取当天的天气",
//     description: "输入经纬度，返回当天的天气信息。",
//     inputSchema: {
//       latitude: z.number().describe("纬度"),
//       longitude: z.number().describe("经度"),
//     },
//   },
//   async ({ latitude, longitude }) => {
//     const response = await axios.get("https://api.open-meteo.com/v1/forecast", {
//       params: {
//         latitude,
//         longitude,
//         current_weather: true,
//       },
//     });

//     const data = response.data;
//     const current = data.current_weather;

//     return {
//       content: [
//         {
//           type: "text",
//           text:
//             "当天温度：" +
//             current.temperature +
//             "°C，风速：" +
//             current.windspeed +
//             " km/h",
//         },
//       ],
//     };
//   }
// );

// 常见城市代码表（可以扩展成完整 JSON 文件）
const cityCodeMap: Record<string, string> = {
  北京: "101010100",
  上海: "101020100",
  广州: "101280101",
  深圳: "101280601",
  杭州: "101210101",
  成都: "101270101",
  重庆: "101040100",
};

// 工具：输入城市名称 -> 输出天气
server.registerTool(
  "get_weather_by_city",
  {
    description:
      "获取中国一座城市的天气信息，比如'北京'、'上海'、'广州'、'深圳'等，返回当天的天气信息。",
    title: "获取城市天气信息",
    inputSchema: {
      city: z
        .string()
        .describe("中国地区名称，比如'北京'、'上海'、'广州'、'深圳'等"),
    },
  },
  async ({ city }) => {
    // 1. 获取城市代码
    const cityCode = cityCodeMap[city];
    if (!cityCode) {
      return {
        content: [{ type: "text", text: `暂不支持城市: ${city}` }],
      };
    }

    // 2. 调用 itboy 免费天气 API
    const url = `http://t.weather.itboy.net/api/weather/city/${cityCode}`;
    const response = await axios.get(url);
    const data = response.data;

    if (!data || data.status !== 200) {
      return {
        content: [{ type: "text", text: `获取天气失败` }],
      };
    }

    const weatherInfo = data.data.forecast[0];

    // 3. 返回结果
    return {
      content: [
        {
          type: "text",
          text: `城市: ${city}\n日期: ${weatherInfo.date}\n天气: ${weatherInfo.type}\n最高温度: ${weatherInfo.high}\n最低温度: ${weatherInfo.low}\n风向: ${weatherInfo.fx}\n风力: ${weatherInfo.fl}`,
        },
      ],
    };
  }
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
