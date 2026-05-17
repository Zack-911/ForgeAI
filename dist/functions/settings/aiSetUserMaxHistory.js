"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("../..");
exports.default = new forgescript_1.NativeFunction({
    name: '$aiSetUserMaxHistory',
    description: 'Set the max conversation history length for a user.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        {
            name: 'maxHistory',
            type: forgescript_1.ArgType.Number,
            required: true,
            rest: false,
            description: 'The maximum number of conversation history entries to store for the user.'
        },
        {
            name: 'userId',
            type: forgescript_1.ArgType.String,
            required: false,
            rest: false,
            description: 'The ID of the user to set the max history for. Default: current user.'
        },
    ],
    async execute(ctx, [maxHistory, userId]) {
        await ctx.client
            .getExtension(__1.ForgeAI, true)
            .engine.settings.patchUser(userId ?? ctx.user.id, { maxHistory });
        return this.success();
    },
});
//# sourceMappingURL=aiSetUserMaxHistory.js.map