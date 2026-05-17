"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("../..");
exports.default = new forgescript_1.NativeFunction({
    name: '$aiMcpListServers',
    description: 'Returns all registered MCP servers as JSON.',
    version: '1.0.0',
    output: forgescript_1.ArgType.Json,
    unwrap: false,
    execute(ctx) {
        const ext = ctx.client.getExtension(__1.ForgeAI, true);
        const servers = ext.engine.mcp.listServers();
        return this.success(JSON.stringify(servers.map((s) => ({ id: s.id, url: s.url, enabled: s.enabled }))));
    },
});
//# sourceMappingURL=aiMcpListServers.js.map