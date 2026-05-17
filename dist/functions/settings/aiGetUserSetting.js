"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("../..");
exports.default = new forgescript_1.NativeFunction({
    name: '$aiGetUserSetting',
    description: 'Get a user AI setting. Keys: model, systemPrompt, temperature, maxHistory, maxTokens',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        {
            name: 'key',
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false,
            description: 'The key of the setting to retrieve. Available keys: model, systemPrompt, temperature, maxHistory, maxTokens.',
        },
        {
            name: 'userId',
            type: forgescript_1.ArgType.String,
            required: false,
            rest: false,
            description: 'The ID of the user to retrieve the setting for. Defaults to author".',
        },
    ],
    output: forgescript_1.ArgType.String,
    async execute(ctx, [key, userId]) {
        const s = await ctx.client
            .getExtension(__1.ForgeAI, true)
            .engine.settings.getUser(userId ?? ctx.user.id);
        return this.success(String(s[key] ?? ''));
    },
});
//# sourceMappingURL=aiGetUserSetting.js.map