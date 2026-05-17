"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("../..");
exports.default = new forgescript_1.NativeFunction({
    name: '$aiRagSearch',
    description: 'Search the RAG store and return matching document contents joined by separator.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        {
            name: 'query',
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false,
            description: 'The query to search for.',
        },
        {
            name: 'namespace',
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false,
            description: 'The namespace to search in.',
        },
        {
            name: 'topK',
            type: forgescript_1.ArgType.Number,
            required: true,
            rest: false,
            description: 'The number of results to return. Default: 5.',
        },
        {
            name: 'separator',
            type: forgescript_1.ArgType.String,
            required: false,
            rest: false,
            description: 'Default: \\n---\\n',
        },
    ],
    output: forgescript_1.ArgType.String,
    async execute(ctx, [query, namespace, topK, separator]) {
        const ext = ctx.client.getExtension(__1.ForgeAI, true);
        const results = await ext.engine.rag.search(query, namespace ?? undefined, topK ?? undefined);
        const sep = separator ?? '\n---\n';
        return this.success(results.map((r) => r.document.content).join(sep));
    },
});
//# sourceMappingURL=aiRagSearch.js.map