"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultTradingPairDescription = void 0;
exports.getBaseUrl = getBaseUrl;
const binanceBaseUrls = [
    "https://api.binance.com",
    "https://api-gcp.binance.com",
    "https://api1.binance.com",
    "https://api2.binance.com",
    "https://api3.binance.com",
    "https://api4.binance.com",
];
const binanceApiKey = process.env.BINANCE_API_KEY || "";
// 从 list 中取一个 baseUrl（这里用随机策略）
function getBaseUrl() {
    const idx = Math.floor(Math.random() * binanceBaseUrls.length);
    return binanceBaseUrls[idx];
}
exports.DefaultTradingPairDescription = `默认行为：\n" +
            "- 如果只输入币种（如 \"BTC\"），系统会自动补全为 ${"BTCUSDT"} 交易对。\n" +
            "- 如果需要指定非 USDT 交易对（如 BTCETH），请完整输入交易对。\n" +
            "\n" +
            "示例：\n" +
            "- 输入 \"BTC\" → 查询 BTCUSDT 最近成交\n" +
            "- 输入 \"ETHBTC\" → 查询 ETHBTC 最近成交`;
//# sourceMappingURL=binance_config.js.map