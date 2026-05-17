import { ArgType, NativeFunction } from '@tryforge/forgescript';
import { ForgeAI } from '../..';

export default new NativeFunction({
  name: '$aiMcpListServers',
  description: 'Returns all registered MCP servers as JSON.',
  version: '1.0.0',
  output: ArgType.Json,
  unwrap: false,
  execute(ctx) {
    const ext = ctx.client.getExtension(ForgeAI, true);
    const servers = ext.engine.mcp.listServers();
    return this.success(
      JSON.stringify(
        servers.map((s) => ({ id: s.id, url: s.url, enabled: s.enabled })),
      ),
    );
  },
});
