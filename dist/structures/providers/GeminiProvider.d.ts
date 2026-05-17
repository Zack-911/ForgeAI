import { BaseProvider } from './BaseProvider';
import { ChatMessage, ChatOptions, ProviderResponse } from '../types';
export declare class GeminiProvider extends BaseProvider {
    readonly id = "gemini";
    readonly name = "Google Gemini";
    private client;
    constructor(apiKey: string);
    isAvailable(): boolean;
    chat(messages: ChatMessage[], model: string, options?: ChatOptions): Promise<ProviderResponse>;
    listModels(): Promise<string[]>;
}
//# sourceMappingURL=GeminiProvider.d.ts.map