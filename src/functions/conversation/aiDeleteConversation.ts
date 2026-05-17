import { ArgType, NativeFunction } from '@tryforge/forgescript';
import { ForgeAI } from '../..';

export default new NativeFunction({
  name: '$aiDeleteConversation',
  description: 'Deletes a conversation and all its history.',
  version: '1.0.0',
  brackets: true,
  unwrap: true,
  args: [
    {
      name: 'convId',
      type: ArgType.String,
      required: true,
      rest: false,
      description: 'The ID of the conversation.',
    },
  ],
  async execute(ctx, [convId]) {
    const ext = ctx.client.getExtension(ForgeAI, true);
    return this.success(String(await ext.engine.conversations.delete(convId)));
  },
});
