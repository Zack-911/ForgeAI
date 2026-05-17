import { ArgType, NativeFunction } from '@tryforge/forgescript';
import { ForgeAI } from '../..';

export default new NativeFunction({
  name: '$aiSetUserMaxHistory',
  description: 'Set the max conversation history length for a user.',
  version: '1.0.0',
  brackets: true,
  unwrap: true,
  args: [
    {
      name: 'maxHistory',
      type: ArgType.Number,
      required: true,
      rest: false,
      description: 'The maximum number of conversation history entries to store for the user.'
    },
    {
      name: 'userId',
      type: ArgType.String,
      required: false,
      rest: false,
      description: 'The ID of the user to set the max history for. Default: current user.'
    },
  ],
  async execute(ctx, [maxHistory, userId]) {
    await ctx.client
      .getExtension(ForgeAI, true)
      .engine.settings.patchUser(userId ?? ctx.user!.id, { maxHistory });
    return this.success();
  },
});
