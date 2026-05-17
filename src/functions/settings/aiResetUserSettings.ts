import { ArgType, NativeFunction } from '@tryforge/forgescript';
import { ForgeAI } from '../..';

export default new NativeFunction({
  name: '$aiResetUserSettings',
  description: 'Reset all AI settings for a user to defaults.',
  version: '1.0.0',
  brackets: false,
  unwrap: true,
  args: [
    {
      name: 'userId',
      type: ArgType.String,
      required: true,
      rest: false,
      description: 'The ID of the user to reset the settings for.'
    },
  ],
  async execute(ctx, [userId]) {
    await ctx.client
      .getExtension(ForgeAI, true)
      .engine.settings.resetUser(userId ?? ctx.user!.id);
    return this.success();
  },
});
