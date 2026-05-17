import { MCPServerConfig, MCPTool } from './types';
export declare class MCPManager {
    private servers;
    private toolCache;
    constructor(servers?: MCPServerConfig[]);
    register(server: MCPServerConfig): void;
    remove(id: string): void;
    enable(id: string): void;
    disable(id: string): void;
    listServers(): MCPServerConfig[];
    fetchTools(serverId?: string): Promise<MCPTool[]>;
    getCachedTools(serverId?: string): MCPTool[];
    /** Call an MCP tool and return its result. */
    callTool(serverId: string, toolName: string, args: Record<string, unknown>): Promise<string>;
    /** Format tools as OpenAI function definitions. */
    formatAsOpenAITools(tools: MCPTool[]): object[];
    private _listTools;
}
//# sourceMappingURL=MCPManager.d.ts.map