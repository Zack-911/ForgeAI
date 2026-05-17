"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("../..");
exports.default = new forgescript_1.NativeFunction({
    name: '$aiSetChannelModel',
    description: 'Set the AI model for a specific channel.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        {
            name: 'model',
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false,
            description: 'The model to use for AI responses.'
        },
        {
            name: 'channelId',
            type: forgescript_1.ArgType.TextChannel,
            required: false,
            rest: false,
            description: 'The ID of the channel to set the model for. Default: current channel.'
        },
        {
            name: 'guildId',
            type: forgescript_1.ArgType.String,
            required: false,
            rest: false,
            description: 'The ID of the guild to set the model for. Default: current guild.'
        },
    ],
    async execute(ctx, [model, channel, guildId]) {
        const gid = guildId ?? ctx.guild?.id;
        const cid = channel?.id ?? ctx.channel?.id;
        if (!gid || !cid)
            return this.customError('No guild or channel ID.');
        await ctx.client
            .getExtension(__1.ForgeAI, true)
            .engine.settings.setChannelConfig(gid, cid, { model });
        return this.success();
    },
});
//# sourceMappingURL=aiSetChannelModel.js.map