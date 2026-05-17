import { ArgType, NativeFunction } from '@tryforge/forgescript';
import { ForgeAI } from '../..';

export default new NativeFunction({
  name: '$aiListModels',
  description: 'Lists available models for a provider. Returns JSON array.',
  version: '1.0.0',
  brackets: true,
  unwrap: true,
  args: [
    {
      name: 'providerId',
      type: ArgType.String,
      required: true,
      rest: false,
      description: 'The ID of the provider to list models for.'
    },
  ],
  output: ArgType.Json,
  async execute(ctx, [providerId]) {
    const ext = ctx.client.getExtension(ForgeAI, true);
    const provider = ext.engine.providers.get(providerId);
    if (!provider)
      return this.customError(`Provider "${providerId}" not registered.`);
    const models = await provider.listModels();
    return this.success(JSON.stringify(models));
  },
});
