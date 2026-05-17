import { ArgType, NativeFunction } from '@tryforge/forgescript';
import { ForgeAI } from '../..';

enum ConvProps {
  id = 'id',
  userID = 'userID',
  guildID = 'guildID',
  channelID = 'channelID',
  model = 'model',
  systemPrompt = 'systemPrompt',
  temperature = 'temperature',
  maxTokens = 'maxTokens',
  messageCount = 'messageCount',
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
}

export default new NativeFunction({
  name: '$aiConvInfo',
  description:
    'Returns a property of a conversation as a string. Properties: id, userID, guildID, channelID, model, systemPrompt, temperature, maxTokens, messageCount, createdAt, updatedAt',
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
      name: 'property',
      type: ArgType.Enum,
      enum: ConvProps,
      required: true,
      rest: false,
      description: 'The property of the conversation to return.',
    },
  ],
  output: ArgType.String,
  async execute(ctx, [convId, property]) {
    const ext = ctx.client.getExtension(ForgeAI, true);
    const conv = await ext.engine.conversations.get(convId);
    if (!conv) return this.customError(`Conversation "${convId}" not found.`);
    const map: Record<string, string> = {
      id: conv.id,
      userID: conv.userID ?? '',
      guildID: conv.guildID ?? '',
      channelID: conv.channelID ?? '',
      model: conv.model ?? '',
      systemPrompt: conv.systemPrompt ?? '',
      temperature: String(conv.temperature ?? ''),
      maxTokens: String(conv.maxTokens ?? ''),
      messageCount: String(
        conv.messages.filter((m) => m.role !== 'system').length,
      ),
      createdAt: String(conv.createdAt),
      updatedAt: String(conv.updatedAt),
    };
    return this.success(map[property] ?? '');
  },
});
