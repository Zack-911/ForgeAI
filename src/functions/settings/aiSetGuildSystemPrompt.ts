import { ArgType, NativeFunction } from '@tryforge/forgescript';
import { ForgeAI } from '../..';

export default new NativeFunction({
  name: '$aiSetGuildSystemPrompt',
  description: 'Set the default system prompt for the guild.',
  version: '1.0.0',
  brackets: true,
  unwrap: false,
  args: [
    {
      name: 'prompt',
      type: ArgType.String,
      required: true,
      rest: false,
      description: 'The system prompt to use for AI responses.'
    },
    {
      name: 'guildId',
      type: ArgType.String,
      required: false,
      rest: false,
      description: 'The ID of the guild to set the system prompt for. Default: current guild.'
    },
  ],
  async execute(ctx) {
    const prompt = this['displayField'](0) ?? '';
    const gidR = await this['resolveUnhandledArg'](ctx, 1);
    if (!this['isValidReturnType'](gidR)) return gidR;
    const gid = (gidR.value as string | null) ?? ctx.guild?.id;
    if (!gid) return this.customError('No guild ID.');
    await ctx.client
      .getExtension(ForgeAI, true)
      .engine.settings.patchGuild(gid, { systemPrompt: prompt });
    return this.success();
  },
});
