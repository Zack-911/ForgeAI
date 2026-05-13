import { MCPServerConfig, MCPTool } from './types'

export class MCPManager {
    private servers    = new Map<string, MCPServerConfig>()
    private toolCache  = new Map<string, MCPTool[]>()

    constructor(servers: MCPServerConfig[] = []) {
        for (const srv of servers) this.register(srv)
    }

    register(server: MCPServerConfig): void {
        this.servers.set(server.id, server)
    }

    remove(id: string): void {
        this.servers.delete(id)
        this.toolCache.delete(id)
    }

    enable(id: string): void {
        const srv = this.servers.get(id)
        if (srv) { srv.enabled = true; this.servers.set(id, srv) }
    }

    disable(id: string): void {
        const srv = this.servers.get(id)
        if (srv) { srv.enabled = false; this.servers.set(id, srv) }
    }

    listServers(): MCPServerConfig[] {
        return Array.from(this.servers.values())
    }

    // ─── Tool discovery ───────────────────────────────────────────────────────

    async fetchTools(serverId?: string): Promise<MCPTool[]> {
        const servers = serverId
            ? [this.servers.get(serverId)].filter(Boolean) as MCPServerConfig[]
            : Array.from(this.servers.values()).filter(s => s.enabled)

        const all: MCPTool[] = []
        for (const srv of servers) {
            try {
                const tools = await this._listTools(srv)
                this.toolCache.set(srv.id, tools)
                all.push(...tools)
            } catch (err) {
                console.warn(`[ForgeAI] MCP server "${srv.id}" tool discovery failed:`, (err as Error).message)
            }
        }
        return all
    }

    getCachedTools(serverId?: string): MCPTool[] {
        if (serverId) return this.toolCache.get(serverId) ?? []
        const all: MCPTool[] = []
        for (const tools of this.toolCache.values()) all.push(...tools)
        return all
    }

    /** Call an MCP tool and return its result. */
    async callTool(serverId: string, toolName: string, args: Record<string, unknown>): Promise<string> {
        const srv = this.servers.get(serverId)
        if (!srv) throw new Error(`[ForgeAI] MCP server "${serverId}" not found`)

        const response = await fetch(`${srv.url}/tools/call`, {
            method:  'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(srv.apiKey ? { Authorization: `Bearer ${srv.apiKey}` } : {}),
            },
            body: JSON.stringify({ name: toolName, arguments: args }),
        })

        if (!response.ok) throw new Error(`MCP tool call failed: ${response.status} ${await response.text()}`)
        const data = await response.json() as { content?: Array<{ type: string; text?: string }> }
        return data.content?.find(c => c.type === 'text')?.text ?? ''
    }

    /** Format tools as OpenAI function definitions. */
    formatAsOpenAITools(tools: MCPTool[]): object[] {
        return tools.map(t => ({
            type:     'function',
            function: {
                name:        `${t.serverId}__${t.name}`.replace(/[^a-zA-Z0-9_]/g, '_'),
                description: t.description,
                parameters:  t.inputSchema,
            },
        }))
    }

    private async _listTools(srv: MCPServerConfig): Promise<MCPTool[]> {
        const response = await fetch(`${srv.url}/tools/list`, {
            headers: srv.apiKey ? { Authorization: `Bearer ${srv.apiKey}` } : {},
        })
        if (!response.ok) throw new Error(`${response.status}`)
        const data = await response.json() as { tools?: Array<{ name: string; description?: string; inputSchema?: object }> }
        return (data.tools ?? []).map(t => ({
            serverId:    srv.id,
            name:        t.name,
            description: t.description ?? '',
            inputSchema: (t.inputSchema ?? {}) as Record<string, unknown>,
        }))
    }
}
