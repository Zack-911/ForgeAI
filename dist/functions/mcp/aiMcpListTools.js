"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("../..");
exports.default = new forgescript_1.NativeFunction({
    name: '$aiMcpListTools',
    description: 'Returns cached MCP tools as a JSON array.',
    version: '1.0.0',
    brackets: false,
    unwrap: true,
    args: [
        {
            name: 'serverId',
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false,
            description: 'The ID of the server to fetch tools from.',
        },
    ],
    output: forgescript_1.ArgType.Json,
    execute(ctx, [serverId]) {
        const ext = ctx.client.getExtension(__1.ForgeAI, true);
        const tools = ext.engine.mcp.getCachedTools(serverId ?? undefined);
        return this.success(JSON.stringify(tools.map((t) => ({
            name: t.name,
            description: t.description,
            serverId: t.serverId,
        }))));
    },
});
//# sourceMappingURL=aiMcpListTools.js.map