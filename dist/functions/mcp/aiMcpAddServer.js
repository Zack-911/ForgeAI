"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("../..");
exports.default = new forgescript_1.NativeFunction({
    name: '$aiMcpAddServer',
    description: 'Register a new MCP server at runtime.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        {
            name: 'id',
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false,
            description: 'Unique server ID.',
        },
        {
            name: 'url',
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false,
            description: 'MCP server HTTP endpoint.',
        },
        {
            name: 'apiKey',
            type: forgescript_1.ArgType.String,
            required: false,
            rest: false,
            description: 'Optional API key.',
        },
    ],
    execute(ctx, [id, url, apiKey]) {
        ctx.client
            .getExtension(__1.ForgeAI, true)
            .engine.mcp.register({
            id,
            url,
            apiKey: apiKey ?? undefined,
            enabled: true,
        });
        return this.success();
    },
});
//# sourceMappingURL=aiMcpAddServer.js.map