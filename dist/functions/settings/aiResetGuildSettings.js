"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("../..");
exports.default = new forgescript_1.NativeFunction({
    name: '$aiResetGuildSettings',
    description: 'Reset all AI settings for the guild.',
    version: '1.0.0',
    brackets: false,
    unwrap: true,
    args: [
        {
            name: 'guildId',
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false,
            description: 'The ID of the guild to reset the settings for.'
        },
    ],
    async execute(ctx, [guildId]) {
        await ctx.client
            .getExtension(__1.ForgeAI, true)
            .engine.settings.resetGuild(guildId ?? ctx.guild.id);
        return this.success();
    },
});
//# sourceMappingURL=aiResetGuildSettings.js.map