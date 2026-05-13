import { ArgType, NativeFunction } from '@tryforge/forgescript'
import { ForgeAI } from '../..'

export const aiListProviders = new NativeFunction({
    name: '$aiListProviders',
    description: 'Returns all registered provider IDs joined by separator.',
    version: '1.0.0',
    brackets: false,
    unwrap: true,
    args: [{ name: 'separator', type: ArgType.String, required: false, rest: false }],
    output: ArgType.String,
    execute(ctx, [separator]) {
        const ext = ctx.client.getExtension(ForgeAI, true)
        return this.success(ext.engine.providers.getAll().map(p => p.id).join(separator ?? ', '))
    },
})

export const aiListModels = new NativeFunction({
    name: '$aiListModels',
    description: 'Lists available models for a provider. Returns JSON array.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [{ name: 'providerId', type: ArgType.String, required: true, rest: false }],
    output: ArgType.Json,
    async execute(ctx, [providerId]) {
        const ext      = ctx.client.getExtension(ForgeAI, true)
        const provider = ext.engine.providers.get(providerId)
        if (!provider) return this.customError(`Provider "${providerId}" not registered.`)
        const models = await provider.listModels()
        return this.success(JSON.stringify(models))
    },
})

export const aiSetRoute = new NativeFunction({
    name: '$aiSetRoute',
    description: 'Define or update a named model route. Models are tried in order on failure.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        { name: 'name',   type: ArgType.String, required: true, rest: false, description: 'Route name, e.g. "fast" or "myRoute".' },
        { name: 'models', type: ArgType.String, required: true, rest: true,  description: 'Model strings in order, e.g. openai:gpt-4o-mini; anthropic:claude-haiku-4-5' },
    ],
    execute(ctx, [name, ...models]) {
        const ext = ctx.client.getExtension(ForgeAI, true)
        ext.engine.router.setRoute(name, models.filter(Boolean))
        return this.success()
    },
})

export const aiGetRoute = new NativeFunction({
    name: '$aiGetRoute',
    description: 'Returns the model list for a named route as a JSON array.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [{ name: 'name', type: ArgType.String, required: true, rest: false }],
    output: ArgType.Json,
    execute(ctx, [name]) {
        const ext    = ctx.client.getExtension(ForgeAI, true)
        const route  = ext.engine.router.getRoute(name)
        if (!route) return this.customError(`Route "${name}" not found.`)
        return this.success(JSON.stringify(route))
    },
})

export const aiRemoveRoute = new NativeFunction({
    name: '$aiRemoveRoute',
    description: 'Removes a named model route.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [{ name: 'name', type: ArgType.String, required: true, rest: false }],
    execute(ctx, [name]) {
        ctx.client.getExtension(ForgeAI, true).engine.router.removeRoute(name)
        return this.success()
    },
})

export const aiListRoutes = new NativeFunction({
    name: '$aiListRoutes',
    description: 'Returns all named routes as JSON.',
    version: '1.0.0',
    output: ArgType.Json,
    execute(ctx) {
        const ext = ctx.client.getExtension(ForgeAI, true)
        return this.success(JSON.stringify(ext.engine.router.listRoutes()))
    },
})

export default [
    aiListProviders, aiListModels,
    aiSetRoute, aiGetRoute, aiRemoveRoute, aiListRoutes,
]
