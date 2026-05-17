import { ArgType, NativeFunction } from '@tryforge/forgescript';
import { ForgeAI } from '../..';

export default new NativeFunction({
  name: '$aiSetRoute',
  description:
    'Define or update a named model route. Models are tried in order on failure.',
  version: '1.0.0',
  brackets: true,
  unwrap: true,
  args: [
    {
      name: 'name',
      type: ArgType.String,
      required: true,
      rest: false,
      description: 'Route name, e.g. "fast" or "myRoute".',
    },
    {
      name: 'models',
      type: ArgType.String,
      required: true,
      rest: true,
      description:
        'Model strings in order, e.g. openai:gpt-4o-mini; anthropic:claude-haiku-4-5',
    },
  ],
  execute(ctx, [name, models]) {
    const ext = ctx.client.getExtension(ForgeAI, true);
    ext.engine.router.setRoute(name, models.filter(Boolean));
    return this.success();
  },
});
