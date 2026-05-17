"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("../..");
exports.default = new forgescript_1.NativeFunction({
    name: '$aiSetConvSystemPrompt',
    description: 'Sets the system prompt for a specific conversation.',
    version: '1.0.0',
    brackets: true,
    unwrap: false,
    args: [
        {
            name: 'convId',
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false,
            description: 'The ID of the conversation.',
        },
        {
            name: 'systemPrompt',
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false,
            description: 'The system prompt for the conversation.',
        },
    ],
    async execute(ctx) {
        const convIdResult = await this['resolveUnhandledArg'](ctx, 0);
        if (!this['isValidReturnType'](convIdResult))
            return convIdResult;
        const prompt = this['displayField'](1) ?? '';
        const ext = ctx.client.getExtension(__1.ForgeAI, true);
        const res = await ext.engine.conversations.update(convIdResult.value, { systemPrompt: prompt });
        if (!res)
            return this.customError(`Conversation "${convIdResult.value}" not found.`);
        return this.success();
    },
});
//# sourceMappingURL=aiSetConvSystemPrompt.js.map