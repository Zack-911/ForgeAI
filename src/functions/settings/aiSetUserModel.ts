import { ArgType, NativeFunction } from '@tryforge/forgescript';
import { ForgeAI } from '../..';

export default new NativeFunction({
  name: '$aiSetUserModel',
  description: 'Set the default AI model for a user.',
  version: '1.0.0',
  brackets: true,
  unwrap: true,
  args: [
    {
      name: 'model',
      type: ArgType.String,
      required: true,
      rest: false,
      description: 'The AI model to use for the user. Example: openai:gpt-4o-mini'
    },
    {
      name: 'userId',
      type: ArgType.String,
      required: false,
      rest: false,
      description: 'The ID of the user to set the model for. Default: current user.'
    },
  ],
  async execute(ctx, [model, userId]) {
    await ctx.client
      .getExtension(ForgeAI, true)
      .engine.settings.patchUser(userId ?? ctx.user!.id, { model });
    return this.success();
  },
});
