import { ArgType, NativeFunction } from '@tryforge/forgescript';
import { ForgeAI } from '../..';

export default new NativeFunction({
  name: '$aiSetChannelEnabled',
  description: 'Enable or disable AI responses in a specific channel.',
  version: '1.0.0',
  brackets: true,
  unwrap: true,
  args: [
    {
      name: 'enabled',
      type: ArgType.Boolean,
      required: true,
      rest: false,
      description: 'Whether to enable or disable AI responses.',
    },
    {
      name: 'channelId',
      type: ArgType.TextChannel,
      required: false,
      rest: false,
      description: 'The ID of the channel to enable or disable AI responses for. Default: current channel.',
    },
    {
      name: 'guildId',
      type: ArgType.String,
      required: false,
      rest: false,
      description: 'The ID of the guild to enable or disable AI responses for. Default: current guild.',
    },
  ],
  async execute(ctx, [enabled, channel, guildId]) {
    const gid = guildId ?? ctx.guild?.id;
    const cid = channel?.id ?? ctx.channel?.id;
    if (!gid || !cid) return this.customError('No guild or channel ID.');
    await ctx.client
      .getExtension(ForgeAI, true)
      .engine.settings.setChannelConfig(gid, cid, { enabled });
    return this.success();
  },
});
