import z from "zod";
import { ToolConfig } from "./binance_config";
export declare function getCryptoPrice(): ToolConfig<{
    symbol: z.ZodString;
    limit: z.ZodOptional<z.ZodNumber>;
}, {}>;
export declare function binanceRecentTrades(): ToolConfig<{
    symbol: z.ZodString;
    limit: z.ZodOptional<z.ZodNumber>;
}, {}>;
/**
 * 获取指定交易对当日交易统计
 */
export declare function binanceTradingDayTool(): ToolConfig<{
    symbol: z.ZodString;
}, {}>;
/**
 * 获取指定交易对的当前平均价格
 */
export declare function binanceAvgPriceTool(): ToolConfig<{
    symbol: z.ZodString;
}, {}>;
/**
 * 获取指定交易对或全部交易对 24 小时价格变动情况
 */
export declare function binanceTicker24hrTool(): ToolConfig<{
    symbol: z.ZodString;
}, {}>;
/**
 * 获取指定交易对或所有交易对的最新成交价格
 */
export declare function binanceTickerPriceTool(): ToolConfig<{
    symbol: z.ZodOptional<z.ZodString>;
}, {}>;
/**
 * 获取指定交易对或所有交易对的最优买卖挂单
 */
export declare function binanceBookTickerTool(): ToolConfig<{
    symbol: z.ZodOptional<z.ZodString>;
}, {}>;
/**
 * 获取指定交易对或多个交易对在指定时间窗口的 ticker 数据
 */
export declare function binanceTickerTool(): ToolConfig<{
    symbol: z.ZodOptional<z.ZodString>;
    symbols: z.ZodOptional<z.ZodArray<z.ZodString>>;
    windowSize: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodEnum<["FULL", "MINI"]>>;
}, {}>;
