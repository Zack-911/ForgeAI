import { BaseProvider } from './providers/BaseProvider';
import { ProviderID } from './types';

export class ProviderRegistry {
  private providers = new Map<string, BaseProvider>();

  register(provider: BaseProvider): void {
    this.providers.set(provider.id, provider);
  }

  get(id: ProviderID): BaseProvider | null {
    return this.providers.get(id) ?? null;
  }

  getAll(): BaseProvider[] {
    return Array.from(this.providers.values());
  }

  /**
   * Resolve a `provider:model` string and return [provider, model].
   * Throws if the provider is not registered.
   */
  resolve(modelString: string): [BaseProvider, string] {
    const colon = modelString.indexOf(':');
    if (colon === -1)
      throw new Error(
        `[ForgeAI] Model string "${modelString}" must be in "provider:model" format`,
      );

    const providerID = modelString.slice(0, colon);
    const provider = this.providers.get(providerID);
    if (!provider) {
      const known = Array.from(this.providers.keys()).join(', ');
      throw new Error(
        `[ForgeAI] Provider "${providerID}" is not registered. Registered providers: ${known}`,
      );
    }

    if (!provider.isAvailable()) {
      throw new Error(
        `[ForgeAI] Provider "${providerID}" is configured but not available (missing API key?)`,
      );
    }

    return [provider, modelString];
  }

  has(id: ProviderID): boolean {
    return this.providers.has(id);
  }
}
