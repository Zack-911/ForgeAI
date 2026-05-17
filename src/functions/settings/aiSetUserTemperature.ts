import { ArgType, NativeFunction } from '@tryforge/forgescript';
import { ForgeAI } from '../..';

export default new NativeFunction({
  name: '$aiSetUserTemperature',
  description: 'Set the default temperature (0-2) for a user.',
  version: '1.0.0',
  brackets: true,
  unwrap: true,
  args: [
    {
      name: 'temperature',
      type: ArgType.Number,
      required: true,
      rest: false,
      description: 'The temperature to use for AI responses. Higher values make the AI more creative, while lower values make it more deterministic.'
    },
    {
      name: 'userId',
      type: ArgType.String,
      required: false,
      rest: false,
      description: 'The ID of the user to set the temperature for. Default: current user.'
    },
  ],
  async execute(ctx, [temperature, userId]) {
    await ctx.client
      .getExtension(ForgeAI, true)
      .engine.settings.patchUser(userId ?? ctx.user!.id, { temperature });
    return this.success();
  },
});
