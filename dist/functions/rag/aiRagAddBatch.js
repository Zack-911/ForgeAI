"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("../..");
exports.default = new forgescript_1.NativeFunction({
    name: '$aiRagAddBatch',
    description: 'Add multiple documents at once separated by a delimiter.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        {
            name: 'content',
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false,
            description: 'All documents joined by separator.',
        },
        {
            name: 'separator',
            type: forgescript_1.ArgType.String,
            required: false,
            rest: false,
            description: 'Separator between documents. Default: newline.',
        },
        {
            name: 'namespace',
            type: forgescript_1.ArgType.String,
            required: false,
            rest: false,
            description: 'Namespace to add documents to. Default: "default".'
        },
    ],
    output: forgescript_1.ArgType.Number,
    async execute(ctx, [content, separator, namespace]) {
        const ext = ctx.client.getExtension(__1.ForgeAI, true);
        const items = content
            .split(separator ?? '\n')
            .map((c) => c.trim())
            .filter(Boolean);
        const count = await ext.engine.rag.addBatch(items.map((c) => ({ content: c, namespace: namespace ?? 'default' })));
        return this.success(String(count));
    },
});
//# sourceMappingURL=aiRagAddBatch.js.map