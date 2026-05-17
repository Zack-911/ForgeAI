"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("../..");
exports.default = new forgescript_1.NativeFunction({
    name: '$aiGetConvId',
    description: 'Finds the most recent conversation for the given scope (user/guild/channel). Returns empty if none found.',
    version: '1.0.0',
    brackets: false,
    unwrap: true,
    args: [
        {
            name: 'userId',
            type: forgescript_1.ArgType.String,
            required: false,
            rest: false,
            description: 'The ID of the user.',
        },
        {
            name: 'guildId',
            type: forgescript_1.ArgType.String,
            required: false,
            rest: false,
            description: 'The ID of the guild.',
        },
        {
            name: 'channelId',
            type: forgescript_1.ArgType.String,
            required: false,
            rest: false,
            description: 'The ID of the channel.',
        },
    ],
    output: forgescript_1.ArgType.String,
    async execute(ctx, [userId, guildId, channelId]) {
        const ext = ctx.client.getExtension(__1.ForgeAI, true);
        const conv = await ext.engine.conversations.findByScope({
            userID: userId ?? ctx.user?.id,
            guildID: guildId ?? ctx.guild?.id,
            channelID: channelId ?? ctx.channel?.id,
        });
        return this.success(conv?.id ?? '');
    },
});
//# sourceMappingURL=aiGetConvId.js.map