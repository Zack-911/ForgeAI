import { ArgType, NativeFunction } from '@tryforge/forgescript';
import { ForgeAI } from '../..';

export default new NativeFunction({
  name: '$aiSetUserSystemPrompt',
  description: 'Set a custom system prompt for a user.',
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
      name: 'userId',
      type: ArgType.String,
      required: false,
      rest: false,
      description: 'The ID of the user to set the system prompt for. Default: current user.'
    },
  ],
  async execute(ctx) {
    const prompt = this['displayField'](0) ?? '';
    const uidR = await this['resolveUnhandledArg'](ctx, 1);
    if (!this['isValidReturnType'](uidR)) return uidR;
    const uid = (uidR.value as string | null) ?? ctx.user?.id;
    if (!uid) return this.customError('No user ID.');
    await ctx.client
      .getExtension(ForgeAI, true)
      .engine.settings.patchUser(uid, { systemPrompt: prompt });
    return this.success();
  },
});
