import { ArgType, NativeFunction } from '@tryforge/forgescript';
import { ForgeAI } from '../..';

export default new NativeFunction({
  name: '$aiMcpEnableServer',
  description: 'Enable a registered MCP server.',
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
    ctx.client.getExtension(ForgeAI, true).engine.mcp.enable(id);
    return this.success();
  },
});
