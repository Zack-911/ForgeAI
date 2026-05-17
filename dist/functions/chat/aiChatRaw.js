"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("../..");
exports.default = new forgescript_1.NativeFunction({
    name: '$aiChatRaw',
    aliases: ['$aiOneShot'],
    description: 'One-shot AI chat with no conversation history. Every call is stateless.',
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
            name: 'model',
            description: 'Model in provider:model format, or a route name.',
            type: forgescript_1.ArgType.String,
            required: false,
            rest: false,
        },
        {
            name: 'systemPrompt',
            description: 'Optional system prompt for this call only.',
            type: forgescript_1.ArgType.String,
            required: false,
            rest: false,
        },
    ],
    output: forgescript_1.ArgType.String,
    async execute(ctx, [prompt, model, systemPrompt]) {
        const ext = ctx.client.getExtension(__1.ForgeAI, true);
        const scope = {
            userID: ctx.user?.id,
            guildID: ctx.guild?.id,
            channelID: ctx.channel?.id,
        };
        const result = await ext.engine.chat(prompt, scope, {
            model: model || undefined,
            systemPrompt: systemPrompt || undefined,
        });
        return this.success(result.content);
    },
});
//# sourceMappingURL=aiChatRaw.js.map