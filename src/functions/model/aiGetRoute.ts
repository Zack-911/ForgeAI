import { ArgType, NativeFunction } from '@tryforge/forgescript';
import { ForgeAI } from '../..';

export default new NativeFunction({
  name: '$aiGetRoute',
  description: 'Returns the model list for a named route as a JSON array.',
  version: '1.0.0',
  brackets: true,
  unwrap: true,
  args: [
    {
      name: 'name',
      type: ArgType.String,
      required: true,
      rest: false,
      description: 'The name of the route to get models for.'
    }
  ],
  output: ArgType.Json,
  execute(ctx, [name]) {
    const ext = ctx.client.getExtension(ForgeAI, true);
    const route = ext.engine.router.getRoute(name);
    if (!route) return this.customError(`Route "${name}" not found.`);
    return this.success(JSON.stringify(route));
  },
});
