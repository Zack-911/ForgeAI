import { ArgType, NativeFunction } from '@tryforge/forgescript';
import { ForgeAI } from '../..';

export default new NativeFunction({
  name: '$aiListProviders',
  description: 'Returns all registered provider IDs joined by separator.',
  version: '1.0.0',
  brackets: false,
  unwrap: true,
  args: [
    {
      name: 'separator',
      type: ArgType.String,
      required: false,
      rest: false,
      description: 'The separator to use for joining provider IDs.'
    },
  ],
  output: ArgType.String,
  execute(ctx, [separator]) {
    const ext = ctx.client.getExtension(ForgeAI, true);
    return this.success(
      ext.engine.providers
        .getAll()
        .map((p) => p.id)
        .join(separator ?? ', '),
    );
  },
});
