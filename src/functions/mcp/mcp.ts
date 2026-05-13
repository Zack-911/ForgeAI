import { ArgType, NativeFunction } from '@tryforge/forgescript'
import { ForgeAI } from '../..'

export const aiMcpAddServer = new NativeFunction({
    name: '$aiMcpAddServer',
    description: 'Register a new MCP server at runtime.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        { name: 'id',     type: ArgType.String, required: true,  rest: false, description: 'Unique server ID.' },
        { name: 'url',    type: ArgType.String, required: true,  rest: false, description: 'MCP server HTTP endpoint.' },
        { name: 'apiKey', type: ArgType.String, required: false, rest: false, description: 'Optional API key.' },
    ],
    execute(ctx, [id, url, apiKey]) {
        ctx.client.getExtension(ForgeAI, true).engine.mcp.register({ id, url, apiKey: apiKey ?? undefined, enabled: true })
        return this.success()
    },
})

export const aiMcpRemoveServer = new NativeFunction({
    name: '$aiMcpRemoveServer',
    description: 'Remove a registered MCP server.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [{ name: 'id', type: ArgType.String, required: true, rest: false }],
    execute(ctx, [id]) {
        ctx.client.getExtension(ForgeAI, true).engine.mcp.remove(id)
        return this.success()
    },
})

export const aiMcpEnableServer = new NativeFunction({
    name: '$aiMcpEnableServer',
    description: 'Enable a registered MCP server.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [{ name: 'id', type: ArgType.String, required: true, rest: false }],
    execute(ctx, [id]) {
        ctx.client.getExtension(ForgeAI, true).engine.mcp.enable(id)
        return this.success()
    },
})

export const aiMcpDisableServer = new NativeFunction({
    name: '$aiMcpDisableServer',
    description: 'Disable a registered MCP server without removing it.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [{ name: 'id', type: ArgType.String, required: true, rest: false }],
    execute(ctx, [id]) {
        ctx.client.getExtension(ForgeAI, true).engine.mcp.disable(id)
        return this.success()
    },
})

export const aiMcpFetchTools = new NativeFunction({
    name: '$aiMcpFetchTools',
    description: 'Fetches and caches tools from all enabled MCP servers. Returns count.',
    version: '1.0.0',
    brackets: false,
    unwrap: true,
    args: [{ name: 'serverId', type: ArgType.String, required: false, rest: false, description: 'Fetch from a specific server only.' }],
    output: ArgType.Number,
    async execute(ctx, [serverId]) {
        const ext   = ctx.client.getExtension(ForgeAI, true)
        const tools = await ext.engine.mcp.fetchTools(serverId ?? undefined)
        return this.success(String(tools.length))
    },
})

export const aiMcpListTools = new NativeFunction({
    name: '$aiMcpListTools',
    description: 'Returns cached MCP tools as a JSON array.',
    version: '1.0.0',
    brackets: false,
    unwrap: true,
    args: [{ name: 'serverId', type: ArgType.String, required: false, rest: false }],
    output: ArgType.Json,
    execute(ctx, [serverId]) {
        const ext   = ctx.client.getExtension(ForgeAI, true)
        const tools = ext.engine.mcp.getCachedTools(serverId ?? undefined)
        return this.success(JSON.stringify(tools.map(t => ({ name: t.name, description: t.description, serverId: t.serverId }))))
    },
})

export const aiMcpCallTool = new NativeFunction({
    name: '$aiMcpCallTool',
    description: 'Directly call an MCP tool and return its result.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        { name: 'serverId', type: ArgType.String, required: true,  rest: false },
        { name: 'toolName', type: ArgType.String, required: true,  rest: false },
        { name: 'args',     type: ArgType.String, required: false, rest: false, description: 'Tool arguments as a JSON string.' },
    ],
    output: ArgType.String,
    async execute(ctx, [serverId, toolName, args]) {
        const ext       = ctx.client.getExtension(ForgeAI, true)
        let parsedArgs  = {}
        if (args) {
            try { parsedArgs = JSON.parse(args) }
            catch { return this.customError('args must be valid JSON.') }
        }
        const result = await ext.engine.mcp.callTool(serverId, toolName, parsedArgs)
        return this.success(result)
    },
})

export const aiMcpListServers = new NativeFunction({
    name: '$aiMcpListServers',
    description: 'Returns all registered MCP servers as JSON.',
    version: '1.0.0',
    output: ArgType.Json,
    execute(ctx) {
        const ext     = ctx.client.getExtension(ForgeAI, true)
        const servers = ext.engine.mcp.listServers()
        return this.success(JSON.stringify(servers.map(s => ({ id: s.id, url: s.url, enabled: s.enabled }))))
    },
})

export default [
    aiMcpAddServer, aiMcpRemoveServer, aiMcpEnableServer, aiMcpDisableServer,
    aiMcpFetchTools, aiMcpListTools, aiMcpCallTool, aiMcpListServers,
]
