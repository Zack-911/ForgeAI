import { BaseProvider } from './providers/BaseProvider';
import { ProviderID } from './types';
export declare class ProviderRegistry {
    private providers;
    register(provider: BaseProvider): void;
    get(id: ProviderID): BaseProvider | null;
    getAll(): BaseProvider[];
    /**
     * Resolve a `provider:model` string and return [provider, model].
     * Throws if the provider is not registered.
     */
    resolve(modelString: string): [BaseProvider, string];
    has(id: ProviderID): boolean;
}
//# sourceMappingURL=ProviderRegistry.d.ts.map