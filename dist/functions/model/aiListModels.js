"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("../..");
exports.default = new forgescript_1.NativeFunction({
    name: '$aiListModels',
    description: 'Lists available models for a provider. Returns JSON array.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        {
            name: 'providerId',
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false,
            description: 'The ID of the provider to list models for.'
        },
    ],
    output: forgescript_1.ArgType.Json,
    async execute(ctx, [providerId]) {
        const ext = ctx.client.getExtension(__1.ForgeAI, true);
        const provider = ext.engine.providers.get(providerId);
        if (!provider)
            return this.customError(`Provider "${providerId}" not registered.`);
        const models = await provider.listModels();
        return this.success(JSON.stringify(models));
    },
});
//# sourceMappingURL=aiListModels.js.map