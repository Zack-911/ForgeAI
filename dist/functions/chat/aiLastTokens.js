"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.NativeFunction({
    name: '$aiLastTokens',
    description: 'Returns the total tokens used in the most recent AI call (input + output). Returns 0 if not tracked.',
    version: '1.0.0',
    output: forgescript_1.ArgType.Number,
    unwrap: false,
    execute(ctx) {
        const tokens = ctx.environment?.['_ai_last_tokens'];
        return this.success(String(tokens ?? 0));
    },
});
//# sourceMappingURL=aiLastTokens.js.map