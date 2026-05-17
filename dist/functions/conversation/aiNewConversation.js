"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("../..");
exports.default = new forgescript_1.NativeFunction({
    name: '$aiNewConversation',
    aliases: ['$aiCreateConversation'],
    description: 'Creates a new conversation and returns its ID.',
    version: '1.0.0',
    brackets: false,
    unwrap: true,
    args: [
        {
            name: 'userId',
            type: forgescript_1.ArgType.String,
            required: false,
            rest: false,
            description: 'Scope the conversation to a user. Defaults to command author.',
        },
        {
            name: 'guildId',
            type: forgescript_1.ArgType.String,
            required: false,
            rest: false,
            description: 'Scope the conversation to a guild. Defaults to current guild.',
        },
        {
            name: 'channelId',
            type: forgescript_1.ArgType.String,
            required: false,
            rest: false,
            description: 'Scope the conversation to a channel. Defaults to current channel.',
        },
    ],
    output: forgescript_1.ArgType.String,
    async execute(ctx, [userId, guildId, channelId]) {
        const ext = ctx.client.getExtension(__1.ForgeAI, true);
        const conv = await ext.engine.conversations.create({
            userID: userId ?? ctx.user?.id,
            guildID: guildId ?? ctx.guild?.id,
            channelID: channelId ?? ctx.channel?.id,
        });
        return this.success(conv.id);
    },
});
//# sourceMappingURL=aiNewConversation.js.map