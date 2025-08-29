export type ToolDefinition = {
    name: string;
    description: string;
    title: string;
    handler: (extra?: any) => Promise<any>;
};
export declare const DEFAULT_TEMPLATES: {
    activity: string;
    viewmodel: string;
    layout: string;
};
export declare function getCreateActivityTool(): ToolDefinition;
