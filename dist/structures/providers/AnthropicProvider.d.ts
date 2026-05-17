import { BaseProvider } from './BaseProvider';
import { ChatMessage, ChatOptions, ProviderResponse } from '../types';
export declare class AnthropicProvider extends BaseProvider {
    readonly id = "anthropic";
    readonly name = "Anthropic";
    private client;
    constructor(apiKey: string);
    isAvailable(): boolean;
    chat(messages: ChatMessage[], model: string, options?: ChatOptions): Promise<ProviderResponse>;
    listModels(): Promise<string[]>;
}
//# sourceMappingURL=AnthropicProvider.d.ts.map