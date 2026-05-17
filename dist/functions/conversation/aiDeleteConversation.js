"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("../..");
exports.default = new forgescript_1.NativeFunction({
    name: '$aiDeleteConversation',
    description: 'Deletes a conversation and all its history.',
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
    ],
    async execute(ctx, [convId]) {
        const ext = ctx.client.getExtension(__1.ForgeAI, true);
        return this.success(String(await ext.engine.conversations.delete(convId)));
    },
});
//# sourceMappingURL=aiDeleteConversation.js.map