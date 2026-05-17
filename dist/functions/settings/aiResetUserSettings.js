"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("../..");
exports.default = new forgescript_1.NativeFunction({
    name: '$aiResetUserSettings',
    description: 'Reset all AI settings for a user to defaults.',
    version: '1.0.0',
    brackets: false,
    unwrap: true,
    args: [
        {
            name: 'userId',
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false,
            description: 'The ID of the user to reset the settings for.'
        },
    ],
    async execute(ctx, [userId]) {
        await ctx.client
            .getExtension(__1.ForgeAI, true)
            .engine.settings.resetUser(userId ?? ctx.user.id);
        return this.success();
    },
});
//# sourceMappingURL=aiResetUserSettings.js.map