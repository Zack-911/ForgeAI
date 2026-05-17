import { ArgType, NativeFunction } from '@tryforge/forgescript';
import { ForgeAI } from '../..';

export default new NativeFunction({
  name: '$aiMcpDisableServer',
  description: 'Disable a registered MCP server without removing it.',
  version: '1.0.0',
  brackets: true,
  unwrap: true,
  args: [
    {
      name: 'id',
      type: ArgType.String,
      required: true,
      rest: false,
      description: 'The ID of the server.',
    },
  ],
  execute(ctx, [id]) {
    ctx.client.getExtension(ForgeAI, true).engine.mcp.disable(id);
    return this.success();
  },
});
