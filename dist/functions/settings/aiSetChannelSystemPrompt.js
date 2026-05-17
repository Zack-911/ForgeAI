"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("../..");
exports.default = new forgescript_1.NativeFunction({
    name: '$aiSetChannelSystemPrompt',
    description: 'Set the system prompt for a specific channel.',
    version: '1.0.0',
    brackets: true,
    unwrap: false,
    args: [
        {
            name: 'prompt',
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false,
            description: 'The system prompt to use for AI responses.'
        },
        {
            name: 'channelId',
            type: forgescript_1.ArgType.String,
            required: false,
            rest: false,
            description: 'The ID of the channel to set the system prompt for. Default: current channel.'
        },
        {
            name: 'guildId',
            type: forgescript_1.ArgType.String,
            required: false,
            rest: false,
            description: 'The ID of the guild to set the system prompt for. Default: current guild.'
        },
    ],
    async execute(ctx) {
        const prompt = this['displayField'](0) ?? '';
        const cidR = await this['resolveUnhandledArg'](ctx, 1);
        const gidR = await this['resolveUnhandledArg'](ctx, 2);
        if (!this['isValidReturnType'](cidR))
            return cidR;
        if (!this['isValidReturnType'](gidR))
            return gidR;
        const cid = cidR.value ?? ctx.channel?.id;
        const gid = gidR.value ?? ctx.guild?.id;
        if (!gid || !cid)
            return this.customError('No guild or channel ID.');
        await ctx.client
            .getExtension(__1.ForgeAI, true)
            .engine.settings.setChannelConfig(gid, cid, { systemPrompt: prompt });
        return this.success();
    },
});
//# sourceMappingURL=aiSetChannelSystemPrompt.js.map