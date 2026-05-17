"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("../..");
exports.default = new forgescript_1.NativeFunction({
    name: '$aiMcpEnableServer',
    description: 'Enable a registered MCP server.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        {
            name: 'id',
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false,
            description: 'The ID of the server.',
        },
    ],
    execute(ctx, [id]) {
        ctx.client.getExtension(__1.ForgeAI, true).engine.mcp.enable(id);
        return this.success();
    },
});
//# sourceMappingURL=aiMcpEnableServer.js.map