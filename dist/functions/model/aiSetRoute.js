"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("../..");
exports.default = new forgescript_1.NativeFunction({
    name: '$aiSetRoute',
    description: 'Define or update a named model route. Models are tried in order on failure.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        {
            name: 'name',
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false,
            description: 'Route name, e.g. "fast" or "myRoute".',
        },
        {
            name: 'models',
            type: forgescript_1.ArgType.String,
            required: true,
            rest: true,
            description: 'Model strings in order, e.g. openai:gpt-4o-mini; anthropic:claude-haiku-4-5',
        },
    ],
    execute(ctx, [name, models]) {
        const ext = ctx.client.getExtension(__1.ForgeAI, true);
        ext.engine.router.setRoute(name, models.filter(Boolean));
        return this.success();
    },
});
//# sourceMappingURL=aiSetRoute.js.map