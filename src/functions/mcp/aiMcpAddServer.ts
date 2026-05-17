import { ArgType, NativeFunction } from '@tryforge/forgescript';
import { ForgeAI } from '../..';

export default new NativeFunction({
  name: '$aiMcpAddServer',
  description: 'Register a new MCP server at runtime.',
  version: '1.0.0',
  brackets: true,
  unwrap: true,
  args: [
    {
      name: 'id',
      type: ArgType.String,
      required: true,
      rest: false,
      description: 'Unique server ID.',
    },
    {
      name: 'url',
      type: ArgType.String,
      required: true,
      rest: false,
      description: 'MCP server HTTP endpoint.',
    },
    {
      name: 'apiKey',
      type: ArgType.String,
      required: false,
      rest: false,
      description: 'Optional API key.',
    },
  ],
  execute(ctx, [id, url, apiKey]) {
    ctx.client
      .getExtension(ForgeAI, true)
      .engine.mcp.register({
        id,
        url,
        apiKey: apiKey ?? undefined,
        enabled: true,
      });
    return this.success();
  },
});
