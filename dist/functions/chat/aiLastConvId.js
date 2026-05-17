"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.NativeFunction({
    name: '$aiLastConvId',
    description: 'Returns the conversation ID used in the most recent $aiChat call.',
    version: '1.0.0',
    output: forgescript_1.ArgType.String,
    unwrap: false,
    execute(ctx) {
        const id = ctx.environment?.['_ai_last_conv_id'];
        return this.success(id ?? '');
    },
});
//# sourceMappingURL=aiLastConvId.js.map