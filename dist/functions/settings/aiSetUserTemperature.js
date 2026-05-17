"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("../..");
exports.default = new forgescript_1.NativeFunction({
    name: '$aiSetUserTemperature',
    description: 'Set the default temperature (0-2) for a user.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        {
            name: 'temperature',
            type: forgescript_1.ArgType.Number,
            required: true,
            rest: false,
            description: 'The temperature to use for AI responses. Higher values make the AI more creative, while lower values make it more deterministic.'
        },
        {
            name: 'userId',
            type: forgescript_1.ArgType.String,
            required: false,
            rest: false,
            description: 'The ID of the user to set the temperature for. Default: current user.'
        },
    ],
    async execute(ctx, [temperature, userId]) {
        await ctx.client
            .getExtension(__1.ForgeAI, true)
            .engine.settings.patchUser(userId ?? ctx.user.id, { temperature });
        return this.success();
    },
});
//# sourceMappingURL=aiSetUserTemperature.js.map