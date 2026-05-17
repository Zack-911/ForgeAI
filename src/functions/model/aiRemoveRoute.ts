import { ArgType, NativeFunction } from '@tryforge/forgescript';
import { ForgeAI } from '../..';

export default new NativeFunction({
  name: '$aiRemoveRoute',
  description: 'Removes a named model route.',
  version: '1.0.0',
  brackets: true,
  unwrap: true,
  args: [
    {
      name: 'name',
      type: ArgType.String,
      required: true,
      rest: false,
      description: 'The name of the route to remove.'
    }
  ],
  execute(ctx, [name]) {
    ctx.client.getExtension(ForgeAI, true).engine.router.removeRoute(name);
    return this.success();
  },
});
