"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("../..");
exports.default = new forgescript_1.NativeFunction({
    name: '$aiRagDelete',
    description: 'Delete a RAG document by its ID.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [{
            name: 'id',
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false,
            description: 'The ID of the document to delete.'
        }],
    async execute(ctx, [id]) {
        const ext = ctx.client.getExtension(__1.ForgeAI, true);
        return this.success(String(await ext.engine.rag.delete(id)));
    },
});
//# sourceMappingURL=aiRagDelete.js.map