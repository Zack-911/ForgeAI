"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MCPManager = void 0;
class MCPManager {
    constructor(servers = []) {
        this.servers = new Map();
        this.toolCache = new Map();
        for (const srv of servers)
            this.register(srv);
    }
    register(server) {
        this.servers.set(server.id, server);
    }
    remove(id) {
        this.servers.delete(id);
        this.toolCache.delete(id);
    }
    enable(id) {
        const srv = this.servers.get(id);
        if (srv) {
            srv.enabled = true;
            this.servers.set(id, srv);
        }
    }
    disable(id) {
        const srv = this.servers.get(id);
        if (srv) {
            srv.enabled = false;
            this.servers.set(id, srv);
        }
    }
    listServers() {
        return Array.from(this.servers.values());
    }
    // ─── Tool discovery ───────────────────────────────────────────────────────
    async fetchTools(serverId) {
        const servers = serverId
            ? [this.servers.get(serverId)].filter(Boolean)
            : Array.from(this.servers.values()).filter((s) => s.enabled);
        const all = [];
        for (const srv of servers) {
            try {
                const tools = await this._listTools(srv);
                this.toolCache.set(srv.id, tools);
                all.push(...tools);
            }
            catch (err) {
                console.warn(`[ForgeAI] MCP server "${srv.id}" tool discovery failed:`, err.message);
            }
        }
        return all;
    }
    getCachedTools(serverId) {
        if (serverId)
            return this.toolCache.get(serverId) ?? [];
        const all = [];
        for (const tools of this.toolCache.values())
            all.push(...tools);
        return all;
    }
    /** Call an MCP tool and return its result. */
    async callTool(serverId, toolName, args) {
        const srv = this.servers.get(serverId);
        if (!srv)
            throw new Error(`[ForgeAI] MCP server "${serverId}" not found`);
        const response = await fetch(`${srv.url}/tools/call`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(srv.apiKey ? { Authorization: `Bearer ${srv.apiKey}` } : {}),
            },
            body: JSON.stringify({ name: toolName, arguments: args }),
        });
        if (!response.ok)
            throw new Error(`MCP tool call failed: ${response.status} ${await response.text()}`);
        const data = (await response.json());
        return data.content?.find((c) => c.type === 'text')?.text ?? '';
    }
    /** Format tools as OpenAI function definitions. */
    formatAsOpenAITools(tools) {
        return tools.map((t) => ({
            type: 'function',
            function: {
                name: `${t.serverId}__${t.name}`.replace(/[^a-zA-Z0-9_]/g, '_'),
                description: t.description,
                parameters: t.inputSchema,
            },
        }));
    }
    async _listTools(srv) {
        const response = await fetch(`${srv.url}/tools/list`, {
            headers: srv.apiKey ? { Authorization: `Bearer ${srv.apiKey}` } : {},
        });
        if (!response.ok)
            throw new Error(`${response.status}`);
        const data = (await response.json());
        return (data.tools ?? []).map((t) => ({
            serverId: srv.id,
            name: t.name,
            description: t.description ?? '',
            inputSchema: (t.inputSchema ?? {}),
        }));
    }
}
exports.MCPManager = MCPManager;
//# sourceMappingURL=MCPManager.js.map