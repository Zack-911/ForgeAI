import { ArgType, NativeFunction } from '@tryforge/forgescript';
import { ForgeAI } from '../..';

export default new NativeFunction({
  name: '$aiGetUserSetting',
  description:
    'Get a user AI setting. Keys: model, systemPrompt, temperature, maxHistory, maxTokens',
  version: '1.0.0',
  brackets: true,
  unwrap: true,
  args: [
    {
      name: 'key',
      type: ArgType.String,
      required: true,
      rest: false,
      description: 'The key of the setting to retrieve. Available keys: model, systemPrompt, temperature, maxHistory, maxTokens.',
    },
    {
      name: 'userId',
      type: ArgType.String,
      required: false,
      rest: false,
      description: 'The ID of the user to retrieve the setting for. Defaults to author".',
    },
  ],
  output: ArgType.String,
  async execute(ctx, [key, userId]) {
    const s = await ctx.client
      .getExtension(ForgeAI, true)
      .engine.settings.getUser(userId ?? ctx.user!.id);
    return this.success(String((s as any)[key] ?? ''));
  },
});
