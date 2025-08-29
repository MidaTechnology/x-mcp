import axios from "axios";
import { getBaseUrl } from "./binance_config";

async function axiosBinanceGet(path: string, params?: Record<string, any>) {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${path}`;

  const res = await axios.get(url, { params });
  return res.data;
}

// ================== 获取交易对近期成交数据 ==================
export async function fetchBinanceTrades(symbol: string, limit?: number) {
  return axiosBinanceGet("/api/v3/trades", {
    symbol: symbol.toUpperCase(),
    limit: limit ?? 100,
  });
}

// ================== 获取交易对深度数据 ==================
export async function binanceDepth(symbol: string, limit?: number) {
  return axiosBinanceGet("/api/v3/depth", {
    symbol: symbol.toUpperCase(),
    limit: limit ?? 100,
  });
}

// ========== Binance 公共 GET 接口（无需签名） ==========

/**
 * 测试服务器连通性
 * @returns {Promise<any>}
 * @example
 * const res = await ping();
 */
export async function ping(): Promise<any> {
  return axiosBinanceGet("/api/v3/ping");
}

/**
 * 获取 Binance 服务器时间（毫秒级 Unix 时间戳）
 * @returns {Promise<any>}
 * @example
 * const res = await serverTime();
 * // { serverTime: 1735437894653 }
 */
export async function serverTime(): Promise<any> {
  return axiosBinanceGet("/api/v3/time");
}

/**
 * 获取交易规则和交易对信息
 * @param {Object} params
 * @param {string} [params.symbol] 可选，指定交易对，例如 "BTCUSDT"
 * @param {string[]} [params.symbols] 可选，多个交易对，例如 ["BTCUSDT","ETHUSDT"]
 * @param {string[]} [params.permissions] 可选，过滤交易对权限，例如 ["SPOT"]
 * @returns {Promise<any>}
 * @example
 * const res = await exchangeInfo({ symbol: "BTCUSDT" });
 */
export async function exchangeInfo(params?: Record<string, any>): Promise<any> {
  return axiosBinanceGet("/api/v3/exchangeInfo", params);
}

/**
 * 获取订单簿深度（Order Book）
 * @param {string} symbol 交易对，例如 "BTCUSDT"
 * @param {number} [limit] 可选，返回深度条数，默认 100，可选 [5,10,20,50,100,500,1000,5000]
 * @returns {Promise<any>}
 * @example
 * const res = await orderBook("BTCUSDT", 50);
 */
export async function orderBook(symbol: string, limit?: number): Promise<any> {
  return axiosBinanceGet("/api/v3/depth", {
    symbol: symbol.toUpperCase(),
    ...(limit && { limit }),
  });
}

/**
 * 获取近期交易（最近成交的交易）
 * @param {string} symbol 交易对，例如 "BTCUSDT"
 * @param {number} [limit] 可选，返回条数，默认 100，最大 1000
 * @returns {Promise<any>}
 * @example
 * const res = await recentTrades("ETHUSDT", 10);
 */
export async function recentTrades(
  symbol: string,
  limit?: number
): Promise<any> {
  return axiosBinanceGet("/api/v3/trades", {
    symbol: symbol.toUpperCase(),
    ...(limit && { limit }),
  });
}

/**
 * 获取更久远的历史交易（需要额外权限）
 * @param {string} symbol 交易对，例如 "BTCUSDT"
 * @param {number} [limit] 可选，返回条数，默认 100，最大 1000
 * @param {number} [fromId] 可选，从指定成交 ID 开始返回
 * @returns {Promise<any>}
 * @example
 * const res = await historicalTrades("BTCUSDT", 50, 123456789);
 */
export async function historicalTrades(
  symbol: string,
  limit?: number,
  fromId?: number
): Promise<any> {
  return axiosBinanceGet("/api/v3/historicalTrades", {
    symbol: symbol.toUpperCase(),
    ...(limit && { limit }),
    ...(fromId && { fromId }),
  });
}

/**
 * 获取聚合交易数据（压缩后的成交）
 * @param {string} symbol 交易对，例如 "BTCUSDT"
 * @param {Object} [opts]
 * @param {number} [opts.fromId] 从指定成交 ID 开始
 * @param {number} [opts.startTime] 开始时间（毫秒）
 * @param {number} [opts.endTime] 结束时间（毫秒）
 * @param {number} [opts.limit] 返回条数，默认 500，最大 1000
 * @returns {Promise<any>}
 * @example
 * const res = await aggTrades("BTCUSDT", { startTime: 1735430000000, endTime: 1735439999999, limit: 100 });
 */
export async function aggTrades(
  symbol: string,
  opts?: {
    fromId?: number;
    startTime?: number;
    endTime?: number;
    limit?: number;
  }
): Promise<any> {
  return axiosBinanceGet("/api/v3/aggTrades", {
    symbol: symbol.toUpperCase(),
    ...(opts?.fromId && { fromId: opts.fromId }),
    ...(opts?.startTime && { startTime: opts.startTime }),
    ...(opts?.endTime && { endTime: opts.endTime }),
    ...(opts?.limit && { limit: opts.limit }),
  });
}

/**
 * 获取 K 线数据（蜡烛图）
 * @param {string} symbol 交易对，例如 "BTCUSDT"
 * @param {string} interval 时间间隔，例如 "1m", "5m", "1h", "1d"
 * @param {Object} [opts]
 * @param {number} [opts.startTime] 开始时间（毫秒）
 * @param {number} [opts.endTime] 结束时间（毫秒）
 * @param {number} [opts.limit] 返回条数，默认 500，最大 1000
 * @param {string} [opts.timeZone] 可选，时区
 * @returns {Promise<any>}
 * @example
 * const res = await klines("BTCUSDT", "1h", { limit: 200 });
 */
export async function klines(
  symbol: string,
  interval: string,
  opts?: {
    startTime?: number;
    endTime?: number;
    limit?: number;
    timeZone?: string;
  }
): Promise<any> {
  return axiosBinanceGet("/api/v3/klines", {
    symbol: symbol.toUpperCase(),
    interval,
    ...(opts?.startTime && { startTime: opts.startTime }),
    ...(opts?.endTime && { endTime: opts.endTime }),
    ...(opts?.limit && { limit: opts.limit }),
    ...(opts?.timeZone && { timeZone: opts.timeZone }),
  });
}

/**
 * 获取 UI 优化的 K 线数据（和 klines 类似，但结构更适合前端）
 * @param {string} symbol 交易对，例如 "BTCUSDT"
 * @param {string} interval 时间间隔，例如 "1m", "5m", "1h", "1d"
 * @param {Object} [opts]
 * @param {number} [opts.startTime] 开始时间（毫秒）
 * @param {number} [opts.endTime] 结束时间（毫秒）
 * @param {number} [opts.limit] 返回条数，默认 500，最大 1000
 * @param {string} [opts.timeZone] 可选，时区
 * @returns {Promise<any>}
 * @example
 * const res = await uiKlines("ETHUSDT", "5m", { limit: 50 });
 */
export async function uiKlines(
  symbol: string,
  interval: string,
  opts?: {
    startTime?: number;
    endTime?: number;
    limit?: number;
    timeZone?: string;
  }
): Promise<any> {
  return axiosBinanceGet("/api/v3/uiKlines", {
    symbol: symbol.toUpperCase(),
    interval,
    ...(opts?.startTime && { startTime: opts.startTime }),
    ...(opts?.endTime && { endTime: opts.endTime }),
    ...(opts?.limit && { limit: opts.limit }),
    ...(opts?.timeZone && { timeZone: opts.timeZone }),
  });
}

/**
 * 获取当前平均价格
 */
export async function avgPrice(symbol: String) {
  return axiosBinanceGet("/api/v3/avgPrice", {
    symbol: symbol.toUpperCase(),
  });
}

/**
 * 24hr价格变动情况
 */
export async function ticker24hr(symbol: String) {
  return axiosBinanceGet("/api/v3/ticker/24hr", {
    symbol: symbol.toUpperCase(),
  });
}

/**
 * 获取指定交易对当日交易统计
 * @param symbol 交易对，例如 "BTCUSDT"
 */
export async function binanceTradingDay(symbol: string) {
  return axiosBinanceGet("/api/v3/ticker/tradingDay", {
    symbol: symbol.toUpperCase(),
  });
}

/**
 * 获取指定交易对或所有交易对的最新成交价格
 * @param symbol 可选，交易对，例如 "BTCUSDT"，不传返回所有交易对
 */
export async function binanceTickerPrice(symbol?: string) {
  return axiosBinanceGet("/api/v3/ticker/price", symbol ? { symbol } : undefined);
}

/**
 * 获取指定交易对或所有交易对的最优买卖挂单
 * @param symbol 可选，交易对，例如 "BTCUSDT"，不传返回所有交易对
 */
export async function binanceBookTicker(symbol?: string) {
  return axiosBinanceGet("/api/v3/ticker/bookTicker", symbol ? { symbol } : undefined);
}

/**
 * 获取指定交易对或多个交易对在指定时间窗口的 ticker 数据
 * @param symbol 单个交易对，例如 "BTCUSDT"
 * @param symbols 可选，多个交易对数组，例如 ["BTCUSDT","ETHUSDT"]
 * @param windowSize 可选，时间窗口，默认 "1d"，支持分钟/小时/天，如 "1m", "2h", "3d"
 * @param type 可选，FULL 或 MINI，默认 FULL
 */
export async function binanceTicker(
  symbol?: string,
  symbols?: string[],
  windowSize?: string,
  type?: "FULL" | "MINI"
) {
  const params: Record<string, any> = {};
  if (symbol) params.symbol = symbol;
  if (symbols) params.symbols = JSON.stringify(symbols);
  if (windowSize) params.windowSize = windowSize;
  if (type) params.type = type;
  return axiosBinanceGet("/api/v3/ticker", params);
}