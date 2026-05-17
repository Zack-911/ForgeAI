"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("../..");
exports.default = new forgescript_1.NativeFunction({
    name: '$aiSetGuildMaxHistory',
    description: 'Set the max conversation history length for the guild.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        {
            name: 'maxHistory',
            type: forgescript_1.ArgType.Number,
            required: true,
            rest: false,
            description: 'The maximum number of conversation history entries to store for the guild.'
        },
        {
            name: 'guildId',
            type: forgescript_1.ArgType.String,
            required: false,
            rest: false,
            description: 'The ID of the guild to set the max history for. Default: current guild.'
        },
    ],
    async execute(ctx, [maxHistory, guildId]) {
        await ctx.client
            .getExtension(__1.ForgeAI, true)
            .engine.settings.patchGuild(guildId ?? ctx.guild.id, { maxHistory });
        return this.success();
    },
});
//# sourceMappingURL=aiSetGuildMaxHistory.js.map