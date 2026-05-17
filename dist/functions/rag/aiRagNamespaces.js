"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("../..");
exports.default = new forgescript_1.NativeFunction({
    name: '$aiRagNamespaces',
    description: 'Returns all RAG namespaces joined by separator.',
    version: '1.0.0',
    brackets: false,
    unwrap: true,
    args: [
        {
            name: 'separator',
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false,
            description: 'Separator for joining namespace IDs. Default: ", "'
        },
    ],
    output: forgescript_1.ArgType.String,
    async execute(ctx, [separator]) {
        const ext = ctx.client.getExtension(__1.ForgeAI, true);
        return this.success((await ext.engine.rag.listNamespaces()).join(separator ?? ', '));
    },
});
//# sourceMappingURL=aiRagNamespaces.js.map