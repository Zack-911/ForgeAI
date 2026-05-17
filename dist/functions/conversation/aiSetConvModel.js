"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("../..");
exports.default = new forgescript_1.NativeFunction({
    name: '$aiSetConvModel',
    description: 'Sets the model for a specific conversation.',
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
            name: 'model',
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false,
            description: 'The model to use for the conversation.',
        },
    ],
    async execute(ctx, [convId, model]) {
        const ext = ctx.client.getExtension(__1.ForgeAI, true);
        const res = await ext.engine.conversations.update(convId, { model });
        if (!res)
            return this.customError(`Conversation "${convId}" not found.`);
        return this.success();
    },
});
//# sourceMappingURL=aiSetConvModel.js.map