import { ArgType, NativeFunction } from '@tryforge/forgescript';
import { ForgeAI } from '../..';

export default new NativeFunction({
  name: '$aiResetGuildSettings',
  description: 'Reset all AI settings for the guild.',
  version: '1.0.0',
  brackets: false,
  unwrap: true,
  args: [
    {
      name: 'guildId',
      type: ArgType.String,
      required: true,
      rest: false,
      description: 'The ID of the guild to reset the settings for.'
    },
  ],
  async execute(ctx, [guildId]) {
    await ctx.client
      .getExtension(ForgeAI, true)
      .engine.settings.resetGuild(guildId ?? ctx.guild!.id);
    return this.success();
  },
});
