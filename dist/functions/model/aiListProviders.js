"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("../..");
exports.default = new forgescript_1.NativeFunction({
    name: '$aiListProviders',
    description: 'Returns all registered provider IDs joined by separator.',
    version: '1.0.0',
    brackets: false,
    unwrap: true,
    args: [
        {
            name: 'separator',
            type: forgescript_1.ArgType.String,
            required: false,
            rest: false,
            description: 'The separator to use for joining provider IDs.'
        },
    ],
    output: forgescript_1.ArgType.String,
    execute(ctx, [separator]) {
        const ext = ctx.client.getExtension(__1.ForgeAI, true);
        return this.success(ext.engine.providers
            .getAll()
            .map((p) => p.id)
            .join(separator ?? ', '));
    },
});
//# sourceMappingURL=aiListProviders.js.map