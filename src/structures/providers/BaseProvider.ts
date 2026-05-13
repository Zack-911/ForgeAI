import { ChatMessage, ChatOptions, ProviderResponse } from '../types'

export abstract class BaseProvider {
    abstract readonly id: string
    abstract readonly name: string

    abstract chat(
        messages: ChatMessage[],
        model: string,
        options?: ChatOptions
    ): Promise<ProviderResponse>

    abstract listModels(): Promise<string[]>

    abstract isAvailable(): boolean

    /** Parse a `provider:model` string, returning just the model part. */
    protected parseModel(modelString: string): string {
        const idx = modelString.indexOf(':')
        return idx === -1 ? modelString : modelString.slice(idx + 1)
    }

    /** Convert ChatMessage[] to the format this provider expects. */
    protected formatMessages(messages: ChatMessage[]): { role: string; content: string }[] {
        return messages
            .filter(m => m.role !== 'system')
            .map(m => ({ role: m.role, content: m.content }))
    }

    protected extractSystemPrompt(messages: ChatMessage[]): string | undefined {
        return messages.find(m => m.role === 'system')?.content
    }
}
