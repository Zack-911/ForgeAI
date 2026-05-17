"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("../..");
exports.default = new forgescript_1.NativeFunction({
    name: '$aiRagAdd',
    description: 'Add a document to the local RAG store.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        {
            name: 'content',
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false,
            description: 'The document content.',
        },
        {
            name: 'namespace',
            type: forgescript_1.ArgType.String,
            required: false,
            rest: false,
            description: 'Namespace to group documents. Default: "default".',
        },
    ],
    output: forgescript_1.ArgType.String,
    async execute(ctx, [content, namespace]) {
        const ext = ctx.client.getExtension(__1.ForgeAI, true);
        const doc = await ext.engine.rag.add(content, namespace ?? 'default');
        return this.success(doc.id);
    },
});
//# sourceMappingURL=aiRagAdd.js.map