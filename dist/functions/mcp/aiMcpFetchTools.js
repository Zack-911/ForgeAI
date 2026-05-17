"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("../..");
exports.default = new forgescript_1.NativeFunction({
    name: '$aiMcpFetchTools',
    description: 'Fetches and caches tools from all enabled MCP servers. Returns count.',
    version: '1.0.0',
    brackets: false,
    unwrap: true,
    args: [
        {
            name: 'serverId',
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false,
            description: 'Fetch from a specific server only.',
        },
    ],
    output: forgescript_1.ArgType.Number,
    async execute(ctx, [serverId]) {
        const ext = ctx.client.getExtension(__1.ForgeAI, true);
        const tools = await ext.engine.mcp.fetchTools(serverId ?? undefined);
        return this.success(String(tools.length));
    },
});
//# sourceMappingURL=aiMcpFetchTools.js.map