"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("../..");
exports.default = new forgescript_1.NativeFunction({
    name: '$aiClearConversation',
    description: 'Clears all messages in a conversation, keeping its settings.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        {
            name: 'convId',
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false,
            description: 'The ID of the conversation to clear.',
        },
    ],
    async execute(ctx, [convId]) {
        const ext = ctx.client.getExtension(__1.ForgeAI, true);
        return this.success(String(await ext.engine.conversations.clear(convId)));
    },
});
//# sourceMappingURL=aiClearConversation.js.map