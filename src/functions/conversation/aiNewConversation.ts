import { ArgType, NativeFunction } from '@tryforge/forgescript';
import { ForgeAI } from '../..';

export default new NativeFunction({
  name: '$aiNewConversation',
  aliases: ['$aiCreateConversation'],
  description: 'Creates a new conversation and returns its ID.',
  version: '1.0.0',
  brackets: false,
  unwrap: true,
  args: [
    {
      name: 'userId',
      type: ArgType.String,
      required: false,
      rest: false,
      description:
        'Scope the conversation to a user. Defaults to command author.',
    },
    {
      name: 'guildId',
      type: ArgType.String,
      required: false,
      rest: false,
      description:
        'Scope the conversation to a guild. Defaults to current guild.',
    },
    {
      name: 'channelId',
      type: ArgType.String,
      required: false,
      rest: false,
      description:
        'Scope the conversation to a channel. Defaults to current channel.',
    },
  ],
  output: ArgType.String,
  async execute(ctx, [userId, guildId, channelId]) {
    const ext = ctx.client.getExtension(ForgeAI, true);
    const conv = await ext.engine.conversations.create({
      userID: userId ?? ctx.user?.id,
      guildID: guildId ?? ctx.guild?.id,
      channelID: channelId ?? ctx.channel?.id,
    });
    return this.success(conv.id);
  },
});
