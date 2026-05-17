import { ArgType, NativeFunction } from '@tryforge/forgescript';
import { ForgeAI } from '../..';

export default new NativeFunction({
  name: '$aiMcpFetchTools',
  description:
    'Fetches and caches tools from all enabled MCP servers. Returns count.',
  version: '1.0.0',
  brackets: false,
  unwrap: true,
  args: [
    {
      name: 'serverId',
      type: ArgType.String,
      required: true,
      rest: false,
      description: 'Fetch from a specific server only.',
    },
  ],
  output: ArgType.Number,
  async execute(ctx, [serverId]) {
    const ext = ctx.client.getExtension(ForgeAI, true);
    const tools = await ext.engine.mcp.fetchTools(serverId ?? undefined);
    return this.success(String(tools.length));
  },
});
