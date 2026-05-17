import { ArgType, NativeFunction } from '@tryforge/forgescript';
import { ForgeAI } from '../..';

export default new NativeFunction({
  name: '$aiSetGuildModel',
  description: 'Set the default AI model for the guild.',
  version: '1.0.0',
  brackets: true,
  unwrap: true,
  args: [
    {
      name: 'model',
      type: ArgType.String,
      required: true,
      rest: false,
      description: 'The AI model to use for the guild. Example: openai:gpt-4o-mini'
    },
    {
      name: 'guildId',
      type: ArgType.String,
      required: false,
      rest: false,
      description: 'The ID of the guild to set the model for. Default: current guild.'
    },
  ],
  async execute(ctx, [model, guildId]) {
    await ctx.client
      .getExtension(ForgeAI, true)
      .engine.settings.patchGuild(guildId ?? ctx.guild!.id, { model });
    return this.success();
  },
});
