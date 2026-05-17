"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("../..");
exports.default = new forgescript_1.NativeFunction({
    name: '$aiRagClear',
    description: 'Delete all documents in a namespace.',
    version: '1.0.0',
    brackets: false,
    unwrap: true,
    args: [
        {
            name: 'namespace',
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false,
            description: 'Namespace to delete documents from. Default: "default".'
        },
    ],
    async execute(ctx, [namespace]) {
        const ext = ctx.client.getExtension(__1.ForgeAI, true);
        const count = await ext.engine.rag.deleteByNamespace(namespace ?? 'default');
        return this.success(String(count));
    },
});
//# sourceMappingURL=aiRagClear.js.map