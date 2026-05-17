"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("../..");
exports.default = new forgescript_1.NativeFunction({
    name: '$aiRemoveRoute',
    description: 'Removes a named model route.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        {
            name: 'name',
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false,
            description: 'The name of the route to remove.'
        }
    ],
    execute(ctx, [name]) {
        ctx.client.getExtension(__1.ForgeAI, true).engine.router.removeRoute(name);
        return this.success();
    },
});
//# sourceMappingURL=aiRemoveRoute.js.map