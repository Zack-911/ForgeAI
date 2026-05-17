import { ArgType, NativeFunction } from '@tryforge/forgescript';
import { ForgeAI } from '../..';

export default new NativeFunction({
  name: '$aiSetConvTemperature',
  description: 'Sets the temperature (0-2) for a specific conversation.',
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
      name: 'temperature',
      type: ArgType.Number,
      required: true,
      rest: false,
      description: 'The temperature (0-2) for the conversation.',
    },
  ],
  async execute(ctx, [convId, temperature]) {
    const ext = ctx.client.getExtension(ForgeAI, true);
    await ext.engine.conversations.update(convId, { temperature });
    return this.success();
  },
});
