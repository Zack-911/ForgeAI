"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("../..");
exports.default = new forgescript_1.NativeFunction({
    name: '$aiGetRoute',
    description: 'Returns the model list for a named route as a JSON array.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        {
            name: 'name',
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false,
            description: 'The name of the route to get models for.'
        }
    ],
    output: forgescript_1.ArgType.Json,
    execute(ctx, [name]) {
        const ext = ctx.client.getExtension(__1.ForgeAI, true);
        const route = ext.engine.router.getRoute(name);
        if (!route)
            return this.customError(`Route "${name}" not found.`);
        return this.success(JSON.stringify(route));
    },
});
//# sourceMappingURL=aiGetRoute.js.map