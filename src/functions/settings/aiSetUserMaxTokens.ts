import { ArgType, NativeFunction } from '@tryforge/forgescript';
import { ForgeAI } from '../..';

export default new NativeFunction({
  name: '$aiSetUserMaxTokens',
  description: 'Set the max tokens for a user.',
  version: '1.0.0',
  brackets: true,
  unwrap: true,
  args: [
    {
      name: 'maxTokens',
      type: ArgType.Number,
      required: true,
      rest: false,
      description: 'The maximum number of tokens to use for AI responses.'
    },
    {
      name: 'userId',
      type: ArgType.String,
      required: false,
      rest: false,
      description: 'The ID of the user to set the max tokens for. Default: current user.'
    },
  ],
  async execute(ctx, [maxTokens, userId]) {
    await ctx.client
      .getExtension(ForgeAI, true)
      .engine.settings.patchUser(userId ?? ctx.user!.id, { maxTokens });
    return this.success();
  },
});
