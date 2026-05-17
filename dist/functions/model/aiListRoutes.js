"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("../..");
exports.default = new forgescript_1.NativeFunction({
    name: '$aiListRoutes',
    description: 'Returns all named routes as JSON.',
    version: '1.0.0',
    output: forgescript_1.ArgType.Json,
    unwrap: false,
    execute(ctx) {
        const ext = ctx.client.getExtension(__1.ForgeAI, true);
        return this.success(JSON.stringify(ext.engine.router.listRoutes()));
    },
});
//# sourceMappingURL=aiListRoutes.js.map