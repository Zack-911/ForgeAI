import { ArgType, NativeFunction } from '@tryforge/forgescript';
import { ForgeAI } from '../..';

export default new NativeFunction({
  name: '$aiMcpListTools',
  description: 'Returns cached MCP tools as a JSON array.',
  version: '1.0.0',
  brackets: false,
  unwrap: true,
  args: [
    {
      name: 'serverId',
      type: ArgType.String,
      required: true,
      rest: false,
      description: 'The ID of the server to fetch tools from.',
    },
  ],
  output: ArgType.Json,
  execute(ctx, [serverId]) {
    const ext = ctx.client.getExtension(ForgeAI, true);
    const tools = ext.engine.mcp.getCachedTools(serverId ?? undefined);
    return this.success(
      JSON.stringify(
        tools.map((t) => ({
          name: t.name,
          description: t.description,
          serverId: t.serverId,
        })),
      ),
    );
  },
});
