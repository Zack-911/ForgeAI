import { ArgType, NativeFunction } from '@tryforge/forgescript';
import { ForgeAI } from '../..';

export default new NativeFunction({
  name: '$aiGetConvId',
  description:
    'Finds the most recent conversation for the given scope (user/guild/channel). Returns empty if none found.',
  version: '1.0.0',
  brackets: false,
  unwrap: true,
  args: [
    {
      name: 'userId',
      type: ArgType.String,
      required: false,
      rest: false,
      description: 'The ID of the user.',
    },
    {
      name: 'guildId',
      type: ArgType.String,
      required: false,
      rest: false,
      description: 'The ID of the guild.',
    },
    {
      name: 'channelId',
      type: ArgType.String,
      required: false,
      rest: false,
      description: 'The ID of the channel.',
    },
  ],
  output: ArgType.String,
  async execute(ctx, [userId, guildId, channelId]) {
    const ext = ctx.client.getExtension(ForgeAI, true);
    const conv = await ext.engine.conversations.findByScope({
      userID: userId ?? ctx.user?.id,
      guildID: guildId ?? ctx.guild?.id,
      channelID: channelId ?? ctx.channel?.id,
    });
    return this.success(conv?.id ?? '');
  },
});
