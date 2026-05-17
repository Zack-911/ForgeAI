import Anthropic from '@anthropic-ai/sdk';
import { BaseProvider } from './BaseProvider';
import { ChatMessage, ChatOptions, ProviderResponse } from '../types';

export class AnthropicProvider extends BaseProvider {
  readonly id = 'anthropic';
  readonly name = 'Anthropic';
  private client: Anthropic;

  constructor(apiKey: string) {
    super();
    this.client = new Anthropic({ apiKey });
  }

  isAvailable(): boolean {
    return true;
  }

  async chat(
    messages: ChatMessage[],
    model: string,
    options: ChatOptions = {},
  ): Promise<ProviderResponse> {
    const systemPrompt = this.extractSystemPrompt(messages);
    const formatted = this.formatMessages(messages) as Anthropic.MessageParam[];

    const response = await this.client.messages.create({
      model: this.parseModel(model),
      max_tokens: options.maxTokens ?? 2048,
      system: systemPrompt,
      messages: formatted,
      temperature: options.temperature,
      stop_sequences: options.stop,
    });

    const content = response.content
      .filter((b) => b.type === 'text')
      .map((b) => (b as Anthropic.TextBlock).text)
      .join('');

    return {
      content,
      model: response.model,
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
      finishReason: response.stop_reason ?? undefined,
    };
  }

  async listModels(): Promise<string[]> {
    return [
      'anthropic:claude-opus-4-5',
      'anthropic:claude-sonnet-4-5',
      'anthropic:claude-haiku-4-5',
    ];
  }
}
