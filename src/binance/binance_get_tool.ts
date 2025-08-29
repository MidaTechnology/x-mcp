import z from "zod";
import * as BinanceGetApi from "./binance_get_api";
import { ToolConfig } from "./binance_config";

export function getCryptoPrice(): ToolConfig<
  {
    symbol: z.ZodString;
    limit: z.ZodOptional<z.ZodNumber>;
  },
  {}
> {
  return {
    name: "getCryptoPrice",
    config: {
      title: "获取虚拟货币价格（默认查询 USDT 交易对）",
      description: `
        获取指定虚拟货币的当前价格（当前数据源来自 Binance）。

        默认交易对规则：
        - 如果只输入币种（如 "BTC"），系统会自动补全为 "BTCUSDT" 并查询价格。
        - 如果需要查询非 USDT 交易对（如 "ETHBTC"），请完整输入交易对。

        示例：
        - 输入 "BTC" → 查询 BTCUSDT 当前价格
        - 输入 "ETHBTC" → 查询 ETHBTC 当前价格
      `,
      inputSchema: {
        symbol: z
          .string()
          .describe(
            "虚拟货币或交易对，例如 'BTC' (默认查询 BTCUSDT) 或完整交易对 'ETHBTC'"
          ),
        limit: z
          .number()
          .optional()
          .describe("返回的订单簿条数（默认 100，最大 5000）"),
      },
    },
    handler: async ({ symbol, limit }) => {
      const data = await BinanceGetApi.binanceDepth(symbol, limit);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(data),
          },
        ],
      };
    },
  };
}

export function binanceRecentTrades(): ToolConfig<
  {
    symbol: z.ZodString;
    limit: z.ZodOptional<z.ZodNumber>;
  },
  {}
> {
  return {
    name: "binanceRecentTrades",
    config: {
      title: `获取交易对近期成交记录（默认查询 USDT 交易对）`,
      description: `
            获取指定交易对的最近成交记录。
    
            默认交易对规则：
            - 如果只输入币种（如 "BTC"），系统会自动补全为 "BTCUSDT" 并查询成交记录。
            - 如果输入完整交易对（如 "ETHBTC"），则查询指定交易对的成交记录。
    
            输入说明：
            - symbol: 交易对或币种，例如 "BTC" (默认 BTCUSDT) 或完整交易对 "ETHBTC"
            - limit (可选): 返回的成交记录条数，最大 1000
    
            示例：
            - 查询 BTC 最近成交 → symbol="BTC"
            - 查询 ETHBTC 最近成交 → symbol="ETHBTC"
            `,
      inputSchema: {
        symbol: z
          .string()
          .describe(
            "虚拟货币或交易对，例如 'BTC' (默认查询 BTCUSDT) 或完整交易对 'ETHBTC')"
          ),
        limit: z.number().optional().describe("返回的成交记录条数，最大 1000"),
      },
    },
    handler: async ({ symbol, limit }) => {
      const data = await BinanceGetApi.fetchBinanceTrades(symbol, limit);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(data),
          },
        ],
      };
    },
  };
}

/**
 * 获取指定交易对当日交易统计
 */
export function binanceTradingDayTool(): ToolConfig<
  {
    symbol: z.ZodString;
  },
  {}
> {
  return {
    name: "binanceTradingDay",
    config: {
      title: "获取指定交易对当日交易统计",
      description: `
        查询指定交易对的当日交易统计数据，包括开盘价、收盘价、最高价、最低价、成交量等。
        
        参数说明：
        - symbol: 交易对，例如 "BTCUSDT"
        
        示例：
        - 查询 BTCUSDT 当日交易统计 → { symbol: "BTCUSDT" }
      `,
      inputSchema: {
        symbol: z.string().describe("交易对，例如 'BTCUSDT'"),
      },
    },
    handler: async ({ symbol }) => {
      const data = await BinanceGetApi.binanceTradingDay(symbol);
      return { content: [{ type: "text", text: JSON.stringify(data) }] };
    },
  };
}

/**
 * 获取指定交易对的当前平均价格
 */
export function binanceAvgPriceTool(): ToolConfig<
  {
    symbol: z.ZodString;
  },
  {}
> {
  return {
    name: "binanceAvgPrice",
    config: {
      title: "获取指定交易对的当前平均价格",
      description: `
        查询指定交易对的当前平均成交价格。
        
        参数说明：
        - symbol: 交易对，例如 "BTCUSDT"
        
        返回数据示例：
        {
          "mins": 5,
          "price": "10003.45"
        }
        
        示例：
        - 查询 BTCUSDT 平均价格 → { symbol: "BTCUSDT" }
      `,
      inputSchema: {
        symbol: z.string().describe("交易对，例如 'BTCUSDT'"),
      },
    },
    handler: async ({ symbol }) => {
      const data = await BinanceGetApi.avgPrice(symbol);
      return { content: [{ type: "text", text: JSON.stringify(data) }] };
    },
  };
}

/**
 * 获取指定交易对或全部交易对 24 小时价格变动情况
 */
export function binanceTicker24hrTool(): ToolConfig<
  {
    symbol: z.ZodString;
  },
  {}
> {
  return {
    name: "binanceTicker24hr",
    config: {
      title: "获取指定交易对或全部交易对 24 小时价格变动情况",
      description: `
        查询指定交易对或所有交易对的过去 24 小时内价格变动信息。
        
        参数说明：
        - symbol (可选): 交易对，例如 "BTCUSDT"，不传则返回所有交易对
        
        返回示例：
        {
          "symbol": "BTCUSDT",
          "priceChange": "123.45",
          "priceChangePercent": "1.23",
          "weightedAvgPrice": "10000.01",
          "prevClosePrice": "9980.56",
          "lastPrice": "10003.00",
          "lastQty": "0.001",
          "openPrice": "9880.00",
          "highPrice": "10100.00",
          "lowPrice": "9870.00",
          "volume": "1234.56",
          "quoteVolume": "12345678.90",
          "openTime": 1690000000000,
          "closeTime": 1690086399999,
          "firstId": 100,
          "lastId": 200,
          "count": 101
        }
        
        示例：
        - 查询 BTCUSDT 24 小时价格变动 → { symbol: "BTCUSDT" }
        - 查询所有交易对 24 小时价格变动 → {}
      `,
      inputSchema: {
        symbol: z.string().describe("交易对，例如 'BTCUSDT'"),
      },
    },
    handler: async ({ symbol }) => {
      const data = await BinanceGetApi.ticker24hr(symbol);
      return { content: [{ type: "text", text: JSON.stringify(data) }] };
    },
  };
}

/**
 * 获取指定交易对或所有交易对的最新成交价格
 */
export function binanceTickerPriceTool(): ToolConfig<
  {
    symbol: z.ZodOptional<z.ZodString>;
  },
  {}
> {
  return {
    name: "binanceTickerPrice",
    config: {
      title: "获取指定交易对或所有交易对的最新成交价格",
      description: `
        查询指定交易对或所有交易对的最新成交价格。
        
        参数说明：
        - symbol (可选): 交易对，例如 "BTCUSDT"，不传则返回所有交易对
        
        返回示例：
        {
          "symbol": "BTCUSDT",
          "price": "10003.45"
        }
        
        示例：
        - 查询 BTCUSDT 最新价格 → { symbol: "BTCUSDT" }
        - 查询所有交易对最新价格 → {}
      `,
      inputSchema: {
        symbol: z.string().optional().describe("可选，交易对，例如 'BTCUSDT'，不传返回全部交易对"),
      },
    },
    handler: async ({ symbol }) => {
      const data = await BinanceGetApi.binanceTickerPrice(symbol);
      return { content: [{ type: "text", text: JSON.stringify(data) }] };
    },
  };
}

/**
 * 获取指定交易对或所有交易对的最优买卖挂单
 */
export function binanceBookTickerTool(): ToolConfig<
  {
    symbol: z.ZodOptional<z.ZodString>;
  },
  {}
> {
  return {
    name: "binanceBookTicker",
    config: {
      title: "获取指定交易对或所有交易对的最优买卖挂单",
      description: `
        查询指定交易对或所有交易对的最优买卖挂单（买一卖一）。
        
        参数说明：
        - symbol (可选): 交易对，例如 "BTCUSDT"，不传则返回所有交易对
        
        返回示例：
        {
          "symbol": "BTCUSDT",
          "bidPrice": "10000.00",
          "bidQty": "0.5",
          "askPrice": "10001.00",
          "askQty": "0.3"
        }
        
        示例：
        - 查询 BTCUSDT 最优挂单 → { symbol: "BTCUSDT" }
        - 查询所有交易对最优挂单 → {}
      `,
      inputSchema: {
        symbol: z.string().optional().describe("可选，交易对，例如 'BTCUSDT'，不传返回全部交易对"),
      },
    },
    handler: async ({ symbol }) => {
      const data = await BinanceGetApi.binanceBookTicker(symbol);
      return { content: [{ type: "text", text: JSON.stringify(data) }] };
    },
  };
}

/**
 * 获取指定交易对或多个交易对在指定时间窗口的 ticker 数据
 */
export function binanceTickerTool(): ToolConfig<
  {
    symbol: z.ZodOptional<z.ZodString>;
    symbols: z.ZodOptional<z.ZodArray<z.ZodString>>;
    windowSize: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodEnum<["FULL", "MINI"]>>;
  },
  {}
> {
  return {
    name: "binanceTicker",
    config: {
      title: "获取指定交易对或多个交易对在指定时间窗口的 ticker 数据",
      description: `
        获取指定交易对或多个交易对在指定时间窗口的统计数据。
        注意: 统计区间比 windowSize 多不超过 59999ms。
        
        参数说明：
        - symbol: 单个交易对，例如 "BTCUSDT"，与 symbols 二选一
        - symbols: 多个交易对数组，例如 ["BTCUSDT","BNBUSDT"]，最多 100 个交易对
        - windowSize: 时间窗口，默认 "1d"，支持分钟/小时/天，如 "1m","2h","3d"
        - type: FULL 或 MINI，默认 FULL
        
        示例：
        - 查询 BTCUSDT 最近 1 天的 ticker → { symbol: "BTCUSDT" }
        - 查询 BTCUSDT 和 ETHUSDT 最近 2 小时的 ticker → { symbols: ["BTCUSDT","ETHUSDT"], windowSize: "2h" }
      `,
      inputSchema: {
        symbol: z.string().optional().describe("单个交易对，例如 'BTCUSDT'"),
        symbols: z.array(z.string()).optional().describe("多个交易对数组，例如 ['BTCUSDT','BNBUSDT']，最多 100 个"),
        windowSize: z.string().optional().describe("时间窗口，例如 '1m','2h','1d'，默认 '1d'"),
        type: z.enum(["FULL", "MINI"]).optional().describe("FULL 或 MINI，默认 FULL"),
      },
    },
    handler: async ({ symbol, symbols, windowSize, type }) => {
      const data = await BinanceGetApi.binanceTicker(symbol, symbols, windowSize, type);
      return { content: [{ type: "text", text: JSON.stringify(data) }] };
    },
  };
}