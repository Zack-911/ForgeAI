import { ChatMessage, ChatOptions, ProviderResponse } from '../types';
export declare abstract class BaseProvider {
    abstract readonly id: string;
    abstract readonly name: string;
    abstract chat(messages: ChatMessage[], model: string, options?: ChatOptions): Promise<ProviderResponse>;
    abstract listModels(): Promise<string[]>;
    abstract isAvailable(): boolean;
    /** Parse a `provider:model` string, returning just the model part. */
    protected parseModel(modelString: string): string;
    /** Convert ChatMessage[] to the format this provider expects. */
    protected formatMessages(messages: ChatMessage[]): {
        role: string;
        content: string;
    }[];
    protected extractSystemPrompt(messages: ChatMessage[]): string | undefined;
}
//# sourceMappingURL=BaseProvider.d.ts.map