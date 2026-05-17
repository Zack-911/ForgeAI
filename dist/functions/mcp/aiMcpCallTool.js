"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("../..");
exports.default = new forgescript_1.NativeFunction({
    name: '$aiMcpCallTool',
    description: 'Directly call an MCP tool and return its result.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        {
            name: 'serverId',
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false,
            description: 'The ID of the server.',
        },
        {
            name: 'toolName',
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false,
            description: 'The name of the tool to call.',
        },
        {
            name: 'args',
            type: forgescript_1.ArgType.String,
            required: false,
            rest: false,
            description: 'Tool arguments as a JSON string.',
        },
    ],
    output: forgescript_1.ArgType.String,
    async execute(ctx, [serverId, toolName, args]) {
        const ext = ctx.client.getExtension(__1.ForgeAI, true);
        let parsedArgs = {};
        if (args) {
            try {
                parsedArgs = JSON.parse(args);
            }
            catch {
                return this.customError('args must be valid JSON.');
            }
        }
        const result = await ext.engine.mcp.callTool(serverId, toolName, parsedArgs);
        return this.success(result);
    },
});
//# sourceMappingURL=aiMcpCallTool.js.map