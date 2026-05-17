import { ArgType, NativeFunction } from '@tryforge/forgescript';
import { ForgeAI } from '../..';

export default new NativeFunction({
  name: '$aiDeleteAllConversations',
  description: 'Deletes all conversations for a user, guild, or both.',
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
  ],
  async execute(ctx, [userId, guildId]) {
    const ext = ctx.client.getExtension(ForgeAI, true);
    const count = await ext.engine.conversations.deleteByScope({
      userID: userId ?? ctx.user?.id,
      guildID: guildId ?? ctx.guild?.id,
    });
    return this.success(String(count));
  },
});
