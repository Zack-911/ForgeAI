"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("../..");
exports.default = new forgescript_1.NativeFunction({
    name: '$aiSetUserMaxTokens',
    description: 'Set the max tokens for a user.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        {
            name: 'maxTokens',
            type: forgescript_1.ArgType.Number,
            required: true,
            rest: false,
            description: 'The maximum number of tokens to use for AI responses.'
        },
        {
            name: 'userId',
            type: forgescript_1.ArgType.String,
            required: false,
            rest: false,
            description: 'The ID of the user to set the max tokens for. Default: current user.'
        },
    ],
    async execute(ctx, [maxTokens, userId]) {
        await ctx.client
            .getExtension(__1.ForgeAI, true)
            .engine.settings.patchUser(userId ?? ctx.user.id, { maxTokens });
        return this.success();
    },
});
//# sourceMappingURL=aiSetUserMaxTokens.js.map