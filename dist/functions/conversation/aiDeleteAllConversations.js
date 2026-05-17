"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("../..");
exports.default = new forgescript_1.NativeFunction({
    name: '$aiDeleteAllConversations',
    description: 'Deletes all conversations for a user, guild, or both.',
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
    ],
    async execute(ctx, [userId, guildId]) {
        const ext = ctx.client.getExtension(__1.ForgeAI, true);
        const count = await ext.engine.conversations.deleteByScope({
            userID: userId ?? ctx.user?.id,
            guildID: guildId ?? ctx.guild?.id,
        });
        return this.success(String(count));
    },
});
//# sourceMappingURL=aiDeleteAllConversations.js.map