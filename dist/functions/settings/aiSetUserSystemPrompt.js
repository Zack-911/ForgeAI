"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("../..");
exports.default = new forgescript_1.NativeFunction({
    name: '$aiSetUserSystemPrompt',
    description: 'Set a custom system prompt for a user.',
    version: '1.0.0',
    brackets: true,
    unwrap: false,
    args: [
        {
            name: 'prompt',
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false,
            description: 'The system prompt to use for AI responses.'
        },
        {
            name: 'userId',
            type: forgescript_1.ArgType.String,
            required: false,
            rest: false,
            description: 'The ID of the user to set the system prompt for. Default: current user.'
        },
    ],
    async execute(ctx) {
        const prompt = this['displayField'](0) ?? '';
        const uidR = await this['resolveUnhandledArg'](ctx, 1);
        if (!this['isValidReturnType'](uidR))
            return uidR;
        const uid = uidR.value ?? ctx.user?.id;
        if (!uid)
            return this.customError('No user ID.');
        await ctx.client
            .getExtension(__1.ForgeAI, true)
            .engine.settings.patchUser(uid, { systemPrompt: prompt });
        return this.success();
    },
});
//# sourceMappingURL=aiSetUserSystemPrompt.js.map