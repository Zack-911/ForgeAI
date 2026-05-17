import { ProviderRegistry } from './ProviderRegistry';
import { RouteDefinition, ModelString, ChatMessage, ChatOptions, ProviderResponse } from './types';
export declare class ModelRouter {
    private readonly registry;
    private routes;
    private globalFallback;
    constructor(registry: ProviderRegistry, routes?: Record<string, RouteDefinition | ModelString[]>, fallback?: ModelString[]);
    /**
     * Resolve a model string or route name into a concrete `provider:model`.
     * Route names (e.g. "fast", "smart") expand to their model list.
     */
    resolveModels(modelString: string, defaultModel: string): ModelString[];
    /**
     * Chat with automatic fallback. Tries each model in order, returning the
     * first successful response. Throws only if ALL candidates fail.
     */
    chatWithFallback(models: ModelString[], messages: ChatMessage[], options: ChatOptions): Promise<ProviderResponse & {
        usedModel: string;
    }>;
    getRoute(name: string): ModelString[] | null;
    setRoute(name: string, models: ModelString[]): void;
    removeRoute(name: string): void;
    listRoutes(): Record<string, ModelString[]>;
}
//# sourceMappingURL=ModelRouter.d.ts.map