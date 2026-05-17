import { ArgType, NativeFunction } from '@tryforge/forgescript';
import { ForgeAI } from '../..';

export default new NativeFunction({
  name: '$aiMcpRemoveServer',
  description: 'Remove a registered MCP server.',
  version: '1.0.0',
  brackets: true,
  unwrap: true,
  args: [{
    name: 'id',
    type: ArgType.String,
    required: true,
    rest: false,
    description: 'The ID of the server to remove.'
  }],
  execute(ctx, [id]) {
    ctx.client.getExtension(ForgeAI, true).engine.mcp.remove(id);
    return this.success();
  },
});
