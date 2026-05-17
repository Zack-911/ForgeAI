import { ArgType, NativeFunction } from '@tryforge/forgescript';
import { ForgeAI } from '../..';

export default new NativeFunction({
  name: '$aiConvHistory',
  description:
    'Returns the conversation history. format: "json" returns raw JSON, "text" returns a readable transcript.',
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
    {
      name: 'format',
      type: ArgType.String,
      required: false,
      rest: false,
      description: 'json or text. Default: json',
    },
  ],
  output: ArgType.String,
  async execute(ctx, [convId, format]) {
    const ext = ctx.client.getExtension(ForgeAI, true);
    const conv = await ext.engine.conversations.get(convId);
    if (!conv) return this.customError(`Conversation "${convId}" not found.`);
    const msgs = conv.messages.filter((m) => m.role !== 'system');
    if ((format ?? 'json') === 'text') {
      const text = msgs
        .map((m) => `[${m.role.toUpperCase()}]: ${m.content}`)
        .join('\n\n');
      return this.success(text);
    }
    return this.success(JSON.stringify(msgs));
  },
});
