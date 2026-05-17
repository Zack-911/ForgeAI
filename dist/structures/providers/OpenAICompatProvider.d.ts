import { BaseProvider } from './BaseProvider';
import { ChatMessage, ChatOptions, ProviderResponse } from '../types';
export interface OpenAICompatProviderConfig {
    id: string;
    name: string;
    apiKey?: string;
    baseURL?: string;
}
export declare class OpenAICompatProvider extends BaseProvider {
    private readonly config;
    readonly id: string;
    readonly name: string;
    private client;
    constructor(config: OpenAICompatProviderConfig);
    isAvailable(): boolean;
    chat(messages: ChatMessage[], model: string, options?: ChatOptions): Promise<ProviderResponse>;
    listModels(): Promise<string[]>;
    /** Also used for embeddings by RAGManager. */
    embed(text: string, model: string): Promise<number[]>;
}
export declare function makeOpenAI(apiKey: string, baseURL?: string): OpenAICompatProvider;
export declare function makeDeepSeek(apiKey: string): OpenAICompatProvider;
export declare function makeOllama(host?: string): OpenAICompatProvider;
export declare function makeOpenLLM(baseURL?: string, apiKey?: string): OpenAICompatProvider;
export declare function makeKiwi(apiKey: string, baseURL?: string): OpenAICompatProvider;
//# sourceMappingURL=OpenAICompatProvider.d.ts.map