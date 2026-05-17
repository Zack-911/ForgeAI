"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("../..");
exports.default = new forgescript_1.NativeFunction({
    name: '$aiConvHistory',
    description: 'Returns the conversation history. format: "json" returns raw JSON, "text" returns a readable transcript.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        {
            name: 'convId',
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false,
            description: 'The ID of the conversation.',
        },
        {
            name: 'format',
            type: forgescript_1.ArgType.String,
            required: false,
            rest: false,
            description: 'json or text. Default: json',
        },
    ],
    output: forgescript_1.ArgType.String,
    async execute(ctx, [convId, format]) {
        const ext = ctx.client.getExtension(__1.ForgeAI, true);
        const conv = await ext.engine.conversations.get(convId);
        if (!conv)
            return this.customError(`Conversation "${convId}" not found.`);
        const msgs = conv.messages.filter((m) => m.role !== 'system');
        if ((format ?? 'json') === 'text') {
            const text = msgs
                .map((m) => `[${m.role.toUpperCase()}]: ${m.content}`)
                .join('\n\n');
            return this.success(text);
        }
        return this.success(JSON.stringify(msgs));
    },
});
//# sourceMappingURL=aiConvHistory.js.map