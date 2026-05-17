"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.NativeFunction({
    name: '$aiLastModel',
    description: 'Returns the model that was actually used in the most recent $aiChat or $aiChatRaw call in this execution.',
    version: '1.0.0',
    output: forgescript_1.ArgType.String,
    unwrap: false,
    execute(ctx) {
        const model = ctx.environment?.['_ai_last_model'];
        return this.success(model ?? '');
    },
});
//# sourceMappingURL=aiLastModel.js.map