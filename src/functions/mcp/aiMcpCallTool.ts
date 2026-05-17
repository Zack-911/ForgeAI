import { ArgType, NativeFunction } from '@tryforge/forgescript';
import { ForgeAI } from '../..';

export default new NativeFunction({
  name: '$aiMcpCallTool',
  description: 'Directly call an MCP tool and return its result.',
  version: '1.0.0',
  brackets: true,
  unwrap: true,
  args: [
    {
      name: 'serverId',
      type: ArgType.String,
      required: true,
      rest: false,
      description: 'The ID of the server.',
    },
    {
      name: 'toolName',
      type: ArgType.String,
      required: true,
      rest: false,
      description: 'The name of the tool to call.',
    },
    {
      name: 'args',
      type: ArgType.String,
      required: false,
      rest: false,
      description: 'Tool arguments as a JSON string.',
    },
  ],
  output: ArgType.String,
  async execute(ctx, [serverId, toolName, args]) {
    const ext = ctx.client.getExtension(ForgeAI, true);
    let parsedArgs = {};
    if (args) {
      try {
        parsedArgs = JSON.parse(args);
      } catch {
        return this.customError('args must be valid JSON.');
      }
    }
    const result = await ext.engine.mcp.callTool(
      serverId,
      toolName,
      parsedArgs,
    );
    return this.success(result);
  },
});
