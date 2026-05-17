import { ArgType, NativeFunction } from '@tryforge/forgescript';
import { ForgeAI } from '../..';

export default new NativeFunction({
  name: '$aiSetChannelSystemPrompt',
  description: 'Set the system prompt for a specific channel.',
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
      name: 'channelId',
      type: ArgType.String,
      required: false,
      rest: false,
      description: 'The ID of the channel to set the system prompt for. Default: current channel.'
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
    const cidR = await this['resolveUnhandledArg'](ctx, 1);
    const gidR = await this['resolveUnhandledArg'](ctx, 2);
    if (!this['isValidReturnType'](cidR)) return cidR;
    if (!this['isValidReturnType'](gidR)) return gidR;
    const cid = (cidR.value as string | null) ?? ctx.channel?.id;
    const gid = (gidR.value as string | null) ?? ctx.guild?.id;
    if (!gid || !cid) return this.customError('No guild or channel ID.');
    await ctx.client
      .getExtension(ForgeAI, true)
      .engine.settings.setChannelConfig(gid, cid, { systemPrompt: prompt });
    return this.success();
  },
});
