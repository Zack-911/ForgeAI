"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("../..");
exports.default = new forgescript_1.NativeFunction({
    name: '$aiSetUserModel',
    description: 'Set the default AI model for a user.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        {
            name: 'model',
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false,
            description: 'The AI model to use for the user. Example: openai:gpt-4o-mini'
        },
        {
            name: 'userId',
            type: forgescript_1.ArgType.String,
            required: false,
            rest: false,
            description: 'The ID of the user to set the model for. Default: current user.'
        },
    ],
    async execute(ctx, [model, userId]) {
        await ctx.client
            .getExtension(__1.ForgeAI, true)
            .engine.settings.patchUser(userId ?? ctx.user.id, { model });
        return this.success();
    },
});
//# sourceMappingURL=aiSetUserModel.js.map