"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("../..");
exports.default = new forgescript_1.NativeFunction({
    name: '$aiMcpRemoveServer',
    description: 'Remove a registered MCP server.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [{
            name: 'id',
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false,
            description: 'The ID of the server to remove.'
        }],
    execute(ctx, [id]) {
        ctx.client.getExtension(__1.ForgeAI, true).engine.mcp.remove(id);
        return this.success();
    },
});
//# sourceMappingURL=aiMcpRemoveServer.js.map