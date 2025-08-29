#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUPPORT_TOOLS = exports.GET_HUOCHEPIAO_LIST = void 0;
exports.handleGetHuochepiaoList = handleGetHuochepiaoList;
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const zod_1 = require("zod");
const TONGCHENG_CODE_URL = "https://www.ly.com/trainbffapi/getCodeByStationName";
const TONGCHENG_TRAIN_URL = "https://www.ly.com/trainsearchbffapi/trainSearch";
// 预定义一组常见的User-Agent字符串
const USER_AGENTS = [
    // Chrome (Windows/Mac)
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    // Firefox
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:125.0) Gecko/20100101 Firefox/125.0",
    // Safari
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15",
    // Edge
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.2478.67",
    // 移动端UA
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Linux; Android 13; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36",
    // 特殊浏览器
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 OPR/85.0.4341.18",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Vivaldi/6.2.3105.47",
];
exports.GET_HUOCHEPIAO_LIST = {
    name: "query_train_tickets_list",
    description: "火车票车次列表查询功能，查询指定日期、出发地和目的地之间的火车票信息。输入用户提供的出发站出发城市、到达站到达城市、出发日期进行查询结果，返回包含车次列表、出发/到达站信息、座位类型及票价等详细信息。本工具提供中国境内火车票班次信息的全面查询服务，数据实时对接同程旅行网官方接口。 提供不同座位类型（商务座/一等座/二等座等）的实时票价",
    inputSchema: {
        type: "object",
        properties: {
            depStationName: {
                type: "string",
                description: "出发火车站名称或者出发城市名称。支持输入火车站全称（如北京西站）或城市名（如北京）",
            },
            arrStationName: {
                type: "string",
                description: "目的地火车站名称或者到城市名称。支持输入火车站全称（如北京西站）或城市名（如北京）",
            },
            depDate: {
                type: "string",
                description: "出发日期：格式必须为yyyy-MM-dd",
            },
        },
        required: ["depStationName", "arrStationName", "depDate"],
    },
};
const GET_SYSTIME = {
    name: "get_current_system_time",
    description: "查询当前系统时间工具，它可以帮助你获取当前系统日期时间，返回格式为:yyyy-MM-dd hh:mm:ss，可用于火车票查询等需要时间验证的场景。" +
        "例如获取今天北京到上海的火车票，则先调用当前方法获取时间，再获取火车票详情",
    inputSchema: {
        type: "object",
        properties: {},
        required: [],
    },
};
exports.SUPPORT_TOOLS = [GET_SYSTIME];
// 获取随机User-Agent
function getRandomUserAgent() {
    return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}
// 辅助函数：构建响应
function buildSuccessResponse(text) {
    return {
        content: [{ type: "text", text }],
        error: false,
    };
}
function buildErrorResponse(text) {
    return {
        content: [{ type: "text", text }],
        error: true,
    };
}
async function handleGetHuochepiaoList(depStationName, arrStationName, depDate) {
    // 1.参数校验
    if (!depStationName ||
        depStationName == "" ||
        !arrStationName ||
        arrStationName == "" ||
        !depDate ||
        depDate == "") {
        return buildErrorResponse("参数不完整，请确保提供了depStationName、arrStationName、depDate");
    }
    // 2.模拟浏览器定义个请求头
    const headers = {
        "Content-Type": "application/json",
        Host: "www.ly.com",
        Origin: "https://www.ly.com",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        "User-Agent": getRandomUserAgent(),
    };
    // 先发送第一个请求，根据城市名称获取编码数据
    const response1 = await fetch(TONGCHENG_CODE_URL, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
            names: [depStationName, arrStationName],
            pid: 1,
        }),
    });
    const respBody = await response1.json();
    if (respBody.code !== 200) {
        return buildErrorResponse("获取火车票城市编码数据失败");
    }
    // 如果执行到这里说明第1个请求成功，在请求第2个接口 {"code":200,"data":["CQW","BJP"],"g":"1745854839135-18780"}
    const startCode = respBody.data[0];
    const endCode = respBody.data[1];
    // 在发送第2个请求
    const params2 = {
        depStation: startCode,
        arrStation: endCode,
        depDate: depDate,
        type: "ADULT",
        traceId: Date.now().toString(),
        pid: 1,
    };
    console.log(JSON.stringify(params2));
    const response2 = await fetch(TONGCHENG_TRAIN_URL, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(params2),
    });
    const data2 = await response2.json();
    if (data2.code && data2.code !== 200) {
        // 如果执行到这里说可能失败了
        return buildErrorResponse(`获取火车票列表数据失败:${data2.message}`);
    }
    if (!data2.success) {
        // 如果执行到这里说可能失败了
        return buildErrorResponse(`获取火车票列表数据失败:${data2.errorMessage}`);
    }
    //  数据解析与格式化
    const resultData = data2.data;
    if (!resultData.trains || resultData.trains.length == 0) {
        return buildSuccessResponse("数据为空");
    }
    // 如果知道这里，说明数据存在，则开始进行数据的清洗
    const finalResult = convertFieldNames(resultData, depStationName, arrStationName);
    // 返回正确的结果
    return buildSuccessResponse(JSON.stringify(finalResult, null, 2));
}
async function handleGetSystemTime() {
    // 获取当前系统时间
    const now = new Date();
    // 格式化日期时间
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    // 组合成标准格式
    const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    //  计算当前的系统时间是什么
    return {
        content: [
            {
                type: "text",
                text: formattedTime,
            },
        ],
        isError: false,
    };
}
const convertFieldNames = (resultData, depStationName, arrStationName) => {
    if (!resultData)
        return resultData;
    return {
        用户查询出发站: depStationName,
        用户查询到达站: arrStationName,
        车次列表: resultData.trains?.map((item) => ({
            是否当日到达: item.arrivalDays > 1 ? "否" : "是",
            出发火车站是否是经停站: item.depStationCode === item.startStationCode
                ? "不是经停站"
                : "是经停站",
            出发火车站是否是始发站: item.depStationCode === item.startStationCode
                ? "是始发站"
                : "不是始发站",
            车次号: item.trainCode,
            出发车站名称: item.depStationName,
            出发日期: item.depDate,
            出发时间: item.depTime,
            到达车站名称: item.arrStationName,
            到达日期: item.arrDate,
            到达时间: item.arrTime,
            历时小时分钟: item.runTime,
            座位类型: item.trainAvs?.map((seat) => ({
                类型: convertSeatName(seat.seatClassCode),
                价格: seat.price,
                余票: seat.num,
            })),
        })) || [],
    };
};
function convertSeatName(seatClassCode) {
    if (seatClassCode === "9") {
        return "商务座";
    }
    if (seatClassCode === "M") {
        return "一等座";
    }
    if (seatClassCode === "O") {
        return "二等座";
    }
    if (seatClassCode === "4") {
        return "软卧";
    }
    if (seatClassCode === "3") {
        return "硬卧";
    }
    if (seatClassCode === "1") {
        return "硬座";
    }
    if (seatClassCode === "W") {
        return "无座";
    }
    return "";
}
// Server setup
const server = new mcp_js_1.McpServer({
    name: "xing-12306-mcp",
    version: "1.0.0",
    capabilities: {
        resources: {},
        tools: {},
    },
    instructions: "本 MCP 服务专为12306火车票查询设计，提供车次列表查询和当前系统时间查询功能。服务功能和规则如下",
});
server.registerTool(exports.GET_HUOCHEPIAO_LIST.name, {
    description: exports.GET_HUOCHEPIAO_LIST.description,
    inputSchema: {
        depStationName: zod_1.z.string().describe("出发火车站名称或者出发城市名称"),
        arrStationName: zod_1.z.string().describe("目的地火车站名称或者到城市名称"),
        depDate: zod_1.z.string().describe("出发日期：格式必须为yyyy-MM-dd"),
    },
}, async ({ depStationName, arrStationName, depDate }) => {
    // const { depStationName, arrStationName, depDate } = request.value;
    return await handleGetHuochepiaoList(depStationName, arrStationName, depDate);
});
//查询时间工具，将时间格式化指定格式
server.tool(GET_SYSTIME.name, GET_SYSTIME.description, {}, async ({}) => {
    return await handleGetSystemTime();
});
async function init() { }
async function main() {
    const transport = new stdio_js_1.StdioServerTransport();
    await init();
    await server.connect(transport);
    console.error("MCP Server running on stdio @Xing");
}
main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
//# sourceMappingURL=12306_tool.js.map