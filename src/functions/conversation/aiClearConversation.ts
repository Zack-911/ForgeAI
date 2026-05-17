import { ArgType, NativeFunction } from '@tryforge/forgescript';
import { ForgeAI } from '../..';

export default new NativeFunction({
  name: '$aiClearConversation',
  description: 'Clears all messages in a conversation, keeping its settings.',
  version: '1.0.0',
  brackets: true,
  unwrap: true,
  args: [
    {
      name: 'convId',
      type: ArgType.String,
      required: true,
      rest: false,
      description: 'The ID of the conversation to clear.',
    },
  ],
  async execute(ctx, [convId]) {
    const ext = ctx.client.getExtension(ForgeAI, true);
    return this.success(String(await ext.engine.conversations.clear(convId)));
  },
});
