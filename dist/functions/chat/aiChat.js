"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("../..");
exports.default = new forgescript_1.NativeFunction({
    name: '$aiChat',
    description: 'Send a message to an AI model. If a conversation ID is provided (or autoCreate is true), history is maintained. Returns the AI response.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        {
            name: 'prompt',
            description: 'The message to send.',
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false,
        },
        {
            name: 'convId',
            description: 'Conversation ID to continue. Pass empty to auto-create or use the current channel scope.',
            type: forgescript_1.ArgType.String,
            required: false,
            rest: false,
        },
        {
            name: 'model',
            description: 'Model override in provider:model format, or a route name.',
            type: forgescript_1.ArgType.String,
            required: false,
            rest: false,
        },
    ],
    output: forgescript_1.ArgType.String,
    async execute(ctx, [prompt, convId, model]) {
        const ext = ctx.client.getExtension(__1.ForgeAI, true);
        const scope = {
            userID: ctx.user?.id,
            guildID: ctx.guild?.id,
            channelID: ctx.channel?.id,
        };
        const result = await ext.engine.chatInConversation(prompt, convId || null, scope, { model: model || undefined });
        return this.success(result.content);
    },
});
//# sourceMappingURL=aiChat.js.map