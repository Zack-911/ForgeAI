import { ArgType, NativeFunction } from '@tryforge/forgescript';
import { ForgeAI } from '../..';

export default new NativeFunction({
  name: '$aiSetConvSystemPrompt',
  description: 'Sets the system prompt for a specific conversation.',
  version: '1.0.0',
  brackets: true,
  unwrap: false,
  args: [
    {
      name: 'convId',
      type: ArgType.String,
      required: true,
      rest: false,
      description: 'The ID of the conversation.',
    },
    {
      name: 'systemPrompt',
      type: ArgType.String,
      required: true,
      rest: false,
      description: 'The system prompt for the conversation.',
    },
  ],
  async execute(ctx) {
    const convIdResult = await this['resolveUnhandledArg'](ctx, 0);
    if (!this['isValidReturnType'](convIdResult)) return convIdResult;
    const prompt = this['displayField'](1) ?? '';
    const ext = ctx.client.getExtension(ForgeAI, true);
    const res = await ext.engine.conversations.update(
      convIdResult.value as string,
      { systemPrompt: prompt },
    );
    if (!res)
      return this.customError(
        `Conversation "${convIdResult.value}" not found.`,
      );
    return this.success();
  },
});
