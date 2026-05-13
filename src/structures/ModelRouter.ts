import { ProviderRegistry } from './ProviderRegistry'
import { RouteDefinition, ModelString, ChatMessage, ChatOptions, ProviderResponse } from './types'
import { Logger } from '@tryforge/forgescript'

export class ModelRouter {
    private routes = new Map<string, ModelString[]>()
    private globalFallback: ModelString[] = []

    constructor(
        private readonly registry: ProviderRegistry,
        routes:  Record<string, RouteDefinition | ModelString[]> = {},
        fallback: ModelString[] = []
    ) {
        this.globalFallback = fallback

        for (const [name, def] of Object.entries(routes)) {
            const models = Array.isArray(def) ? def : def.models
            this.routes.set(name, models)
        }

        // Built-in route defaults — only set if not user-defined
        if (!this.routes.has('fast'))   this.routes.set('fast',   [])
        if (!this.routes.has('smart'))  this.routes.set('smart',  [])
        if (!this.routes.has('local'))  this.routes.set('local',  [])
        if (!this.routes.has('cheap'))  this.routes.set('cheap',  [])
        if (!this.routes.has('vision')) this.routes.set('vision', [])
    }

    /**
     * Resolve a model string or route name into a concrete `provider:model`.
     * Route names (e.g. "fast", "smart") expand to their model list.
     */
    resolveModels(modelString: string, defaultModel: string): ModelString[] {
        // Named route
        const route = this.routes.get(modelString)
        if (route?.length) return route

        // Literal model string
        if (modelString.includes(':')) return [modelString]

        // Fall back to default
        return [defaultModel, ...this.globalFallback]
    }

    /**
     * Chat with automatic fallback. Tries each model in order, returning the
     * first successful response. Throws only if ALL candidates fail.
     */
    async chatWithFallback(
        models:   ModelString[],
        messages: ChatMessage[],
        options:  ChatOptions
    ): Promise<ProviderResponse & { usedModel: string }> {
        const candidates = [...new Set([
            ...models,
            ...this.globalFallback,
        ])]

        const errors: string[] = []

        for (const model of candidates) {
            try {
                const [provider] = this.registry.resolve(model)
                const response   = await provider.chat(messages, model, options)
                return { ...response, usedModel: model }
            } catch (err) {
                const msg = (err as Error).message
                Logger.warn(`[ForgeAI] Model "${model}" failed: ${msg}`)
                errors.push(`${model}: ${msg}`)
            }
        }

        throw new Error(`[ForgeAI] All models failed:\n${errors.join('\n')}`)
    }

    getRoute(name: string): ModelString[] | null {
        return this.routes.get(name) ?? null
    }

    setRoute(name: string, models: ModelString[]): void {
        this.routes.set(name, models)
    }

    removeRoute(name: string): void {
        this.routes.delete(name)
    }

    listRoutes(): Record<string, ModelString[]> {
        return Object.fromEntries(this.routes)
    }
}
