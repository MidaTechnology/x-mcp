#!/usr/bin/env node
import { Tool } from "@modelcontextprotocol/sdk/types.js";
export declare const GET_HUOCHEPIAO_LIST: Tool;
export declare const SUPPORT_TOOLS: readonly [{
    [x: string]: unknown;
    name: string;
    inputSchema: {
        [x: string]: unknown;
        type: "object";
        required?: string[] | undefined;
        properties?: {
            [x: string]: unknown;
        } | undefined;
    };
    title?: string | undefined;
    description?: string | undefined;
    _meta?: {
        [x: string]: unknown;
    } | undefined;
    outputSchema?: {
        [x: string]: unknown;
        type: "object";
        required?: string[] | undefined;
        properties?: {
            [x: string]: unknown;
        } | undefined;
    } | undefined;
    annotations?: {
        [x: string]: unknown;
        title?: string | undefined;
        readOnlyHint?: boolean | undefined;
        destructiveHint?: boolean | undefined;
        idempotentHint?: boolean | undefined;
        openWorldHint?: boolean | undefined;
    } | undefined;
}];
export declare function handleGetHuochepiaoList(depStationName: string, arrStationName: string, depDate: string): Promise<any>;
