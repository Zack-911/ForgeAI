"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("../..");
exports.default = new forgescript_1.NativeFunction({
    name: '$aiSetConvTemperature',
    description: 'Sets the temperature (0-2) for a specific conversation.',
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
            name: 'temperature',
            type: forgescript_1.ArgType.Number,
            required: true,
            rest: false,
            description: 'The temperature (0-2) for the conversation.',
        },
    ],
    async execute(ctx, [convId, temperature]) {
        const ext = ctx.client.getExtension(__1.ForgeAI, true);
        await ext.engine.conversations.update(convId, { temperature });
        return this.success();
    },
});
//# sourceMappingURL=aiSetConvTemperature.js.map