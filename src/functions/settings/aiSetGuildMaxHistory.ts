import { ArgType, NativeFunction } from '@tryforge/forgescript';
import { ForgeAI } from '../..';

export default new NativeFunction({
  name: '$aiSetGuildMaxHistory',
  description: 'Set the max conversation history length for the guild.',
  version: '1.0.0',
  brackets: true,
  unwrap: true,
  args: [
    {
      name: 'maxHistory',
      type: ArgType.Number,
      required: true,
      rest: false,
      description: 'The maximum number of conversation history entries to store for the guild.'
    },
    {
      name: 'guildId',
      type: ArgType.String,
      required: false,
      rest: false,
      description: 'The ID of the guild to set the max history for. Default: current guild.'
    },
  ],
  async execute(ctx, [maxHistory, guildId]) {
    await ctx.client
      .getExtension(ForgeAI, true)
      .engine.settings.patchGuild(guildId ?? ctx.guild!.id, { maxHistory });
    return this.success();
  },
});
