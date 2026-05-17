"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("../..");
exports.default = new forgescript_1.NativeFunction({
    name: '$aiRagCount',
    description: 'Returns the number of documents in the RAG store, optionally filtered by namespace.',
    version: '1.0.0',
    brackets: false,
    unwrap: true,
    args: [
        {
            name: 'namespace',
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false,
            description: 'Namespace to count documents in. Default: "default".'
        },
    ],
    output: forgescript_1.ArgType.Number,
    async execute(ctx, [namespace]) {
        const ext = ctx.client.getExtension(__1.ForgeAI, true);
        return this.success(String(await ext.engine.rag.count(namespace ?? undefined)));
    },
});
//# sourceMappingURL=aiRagCount.js.map