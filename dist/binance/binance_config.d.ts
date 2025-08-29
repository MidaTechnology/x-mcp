import z, { ZodRawShape } from "zod";
export declare function getBaseUrl(): string;
export declare const DefaultTradingPairDescription = "\u9ED8\u8BA4\u884C\u4E3A\uFF1A\n\" +\n            \"- \u5982\u679C\u53EA\u8F93\u5165\u5E01\u79CD\uFF08\u5982 \"BTC\"\uFF09\uFF0C\u7CFB\u7EDF\u4F1A\u81EA\u52A8\u8865\u5168\u4E3A BTCUSDT \u4EA4\u6613\u5BF9\u3002\n\" +\n            \"- \u5982\u679C\u9700\u8981\u6307\u5B9A\u975E USDT \u4EA4\u6613\u5BF9\uFF08\u5982 BTCETH\uFF09\uFF0C\u8BF7\u5B8C\u6574\u8F93\u5165\u4EA4\u6613\u5BF9\u3002\n\" +\n            \"\n\" +\n            \"\u793A\u4F8B\uFF1A\n\" +\n            \"- \u8F93\u5165 \"BTC\" \u2192 \u67E5\u8BE2 BTCUSDT \u6700\u8FD1\u6210\u4EA4\n\" +\n            \"- \u8F93\u5165 \"ETHBTC\" \u2192 \u67E5\u8BE2 ETHBTC \u6700\u8FD1\u6210\u4EA4";
export type ToolConfig<InputArgs extends ZodRawShape, OutputArgs extends ZodRawShape> = {
    name: string;
    config: {
        title: string;
        description: string;
        inputSchema: InputArgs;
        outputSchema?: OutputArgs;
    };
    handler: (args: z.infer<z.ZodObject<InputArgs>>) => Promise<any>;
};
