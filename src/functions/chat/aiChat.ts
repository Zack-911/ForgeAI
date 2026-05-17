import { ArgType, NativeFunction } from '@tryforge/forgescript';
import { ForgeAI } from '../..';

export default new NativeFunction({
  name: '$aiChat',
  description:
    'Send a message to an AI model. If a conversation ID is provided (or autoCreate is true), history is maintained. Returns the AI response.',
  version: '1.0.0',
  brackets: true,
  unwrap: true,
  args: [
    {
      name: 'prompt',
      description: 'The message to send.',
      type: ArgType.String,
      required: true,
      rest: false,
    },
    {
      name: 'convId',
      description:
        'Conversation ID to continue. Pass empty to auto-create or use the current channel scope.',
      type: ArgType.String,
      required: false,
      rest: false,
    },
    {
      name: 'model',
      description: 'Model override in provider:model format, or a route name.',
      type: ArgType.String,
      required: false,
      rest: false,
    },
  ],
  output: ArgType.String,
  async execute(ctx, [prompt, convId, model]) {
    const ext = ctx.client.getExtension(ForgeAI, true);
    const scope = {
      userID: ctx.user?.id,
      guildID: ctx.guild?.id,
      channelID: ctx.channel?.id,
    };
    const result = await ext.engine.chatInConversation(
      prompt,
      convId || null,
      scope,
      { model: model || undefined },
    );
    return this.success(result.content);
  },
});
