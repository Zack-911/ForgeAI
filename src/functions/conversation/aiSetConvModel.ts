import { ArgType, NativeFunction } from '@tryforge/forgescript';
import { ForgeAI } from '../..';

export default new NativeFunction({
  name: '$aiSetConvModel',
  description: 'Sets the model for a specific conversation.',
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
      name: 'model',
      type: ArgType.String,
      required: true,
      rest: false,
      description: 'The model to use for the conversation.',
    },
  ],
  async execute(ctx, [convId, model]) {
    const ext = ctx.client.getExtension(ForgeAI, true);
    const res = await ext.engine.conversations.update(convId, { model });
    if (!res) return this.customError(`Conversation "${convId}" not found.`);
    return this.success();
  },
});
