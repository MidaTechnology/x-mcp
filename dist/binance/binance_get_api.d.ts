export declare function fetchBinanceTrades(symbol: string, limit?: number): Promise<any>;
export declare function binanceDepth(symbol: string, limit?: number): Promise<any>;
/**
 * 测试服务器连通性
 * @returns {Promise<any>}
 * @example
 * const res = await ping();
 */
export declare function ping(): Promise<any>;
/**
 * 获取 Binance 服务器时间（毫秒级 Unix 时间戳）
 * @returns {Promise<any>}
 * @example
 * const res = await serverTime();
 * // { serverTime: 1735437894653 }
 */
export declare function serverTime(): Promise<any>;
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
export declare function exchangeInfo(params?: Record<string, any>): Promise<any>;
/**
 * 获取订单簿深度（Order Book）
 * @param {string} symbol 交易对，例如 "BTCUSDT"
 * @param {number} [limit] 可选，返回深度条数，默认 100，可选 [5,10,20,50,100,500,1000,5000]
 * @returns {Promise<any>}
 * @example
 * const res = await orderBook("BTCUSDT", 50);
 */
export declare function orderBook(symbol: string, limit?: number): Promise<any>;
/**
 * 获取近期交易（最近成交的交易）
 * @param {string} symbol 交易对，例如 "BTCUSDT"
 * @param {number} [limit] 可选，返回条数，默认 100，最大 1000
 * @returns {Promise<any>}
 * @example
 * const res = await recentTrades("ETHUSDT", 10);
 */
export declare function recentTrades(symbol: string, limit?: number): Promise<any>;
/**
 * 获取更久远的历史交易（需要额外权限）
 * @param {string} symbol 交易对，例如 "BTCUSDT"
 * @param {number} [limit] 可选，返回条数，默认 100，最大 1000
 * @param {number} [fromId] 可选，从指定成交 ID 开始返回
 * @returns {Promise<any>}
 * @example
 * const res = await historicalTrades("BTCUSDT", 50, 123456789);
 */
export declare function historicalTrades(symbol: string, limit?: number, fromId?: number): Promise<any>;
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
export declare function aggTrades(symbol: string, opts?: {
    fromId?: number;
    startTime?: number;
    endTime?: number;
    limit?: number;
}): Promise<any>;
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
export declare function klines(symbol: string, interval: string, opts?: {
    startTime?: number;
    endTime?: number;
    limit?: number;
    timeZone?: string;
}): Promise<any>;
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
export declare function uiKlines(symbol: string, interval: string, opts?: {
    startTime?: number;
    endTime?: number;
    limit?: number;
    timeZone?: string;
}): Promise<any>;
/**
 * 获取当前平均价格
 */
export declare function avgPrice(symbol: String): Promise<any>;
/**
 * 24hr价格变动情况
 */
export declare function ticker24hr(symbol: String): Promise<any>;
/**
 * 获取指定交易对当日交易统计
 * @param symbol 交易对，例如 "BTCUSDT"
 */
export declare function binanceTradingDay(symbol: string): Promise<any>;
/**
 * 获取指定交易对或所有交易对的最新成交价格
 * @param symbol 可选，交易对，例如 "BTCUSDT"，不传返回所有交易对
 */
export declare function binanceTickerPrice(symbol?: string): Promise<any>;
/**
 * 获取指定交易对或所有交易对的最优买卖挂单
 * @param symbol 可选，交易对，例如 "BTCUSDT"，不传返回所有交易对
 */
export declare function binanceBookTicker(symbol?: string): Promise<any>;
/**
 * 获取指定交易对或多个交易对在指定时间窗口的 ticker 数据
 * @param symbol 单个交易对，例如 "BTCUSDT"
 * @param symbols 可选，多个交易对数组，例如 ["BTCUSDT","ETHUSDT"]
 * @param windowSize 可选，时间窗口，默认 "1d"，支持分钟/小时/天，如 "1m", "2h", "3d"
 * @param type 可选，FULL 或 MINI，默认 FULL
 */
export declare function binanceTicker(symbol?: string, symbols?: string[], windowSize?: string, type?: "FULL" | "MINI"): Promise<any>;
