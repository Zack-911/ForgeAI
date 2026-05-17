import OpenAI from 'openai';
import { BaseProvider } from './BaseProvider';
import { ChatMessage, ChatOptions, ProviderResponse, ToolCall } from '../types';

export interface OpenAICompatProviderConfig {
  id: string;
  name: string;
  apiKey?: string;
  baseURL?: string;
}

export class OpenAICompatProvider extends BaseProvider {
  readonly id: string;
  readonly name: string;
  private client: OpenAI;

  constructor(private readonly config: OpenAICompatProviderConfig) {
    super();
    this.id = config.id;
    this.name = config.name;
    this.client = new OpenAI({
      apiKey: config.apiKey ?? 'no-key',
      baseURL: config.baseURL,
    });
  }

  isAvailable(): boolean {
    return !!(this.config.apiKey || this.config.baseURL);
  }

  async chat(
    messages: ChatMessage[],
    model: string,
    options: ChatOptions = {},
  ): Promise<ProviderResponse> {
    const systemPrompt = this.extractSystemPrompt(messages);
    const chatMessages: OpenAI.ChatCompletionMessageParam[] = [];

    if (systemPrompt)
      chatMessages.push({ role: 'system', content: systemPrompt });
    for (const m of messages.filter((x) => x.role !== 'system')) {
      chatMessages.push({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      });
    }

    const response = await this.client.chat.completions.create({
      model: this.parseModel(model),
      messages: chatMessages,
      temperature: options.temperature,
      max_tokens: options.maxTokens,
      stop: options.stop,
    });

    const choice = response.choices[0];
    const toolCalls: ToolCall[] = [];

    if (choice.message.tool_calls?.length) {
      for (const tc of choice.message.tool_calls) {
        toolCalls.push({
          id: tc.id,
          toolName: tc.function.name,
          arguments: JSON.parse(tc.function.arguments ?? '{}'),
        });
      }
    }

    return {
      content: choice.message.content ?? '',
      model: response.model,
      inputTokens: response.usage?.prompt_tokens,
      outputTokens: response.usage?.completion_tokens,
      finishReason: choice.finish_reason ?? undefined,
      toolCalls: toolCalls.length ? toolCalls : undefined,
    };
  }

  async listModels(): Promise<string[]> {
    try {
      const list = await this.client.models.list();
      return list.data.map((m) => `${this.id}:${m.id}`);
    } catch {
      return [];
    }
  }

  /** Also used for embeddings by RAGManager. */
  async embed(text: string, model: string): Promise<number[]> {
    const response = await this.client.embeddings.create({
      model: this.parseModel(model),
      input: text,
    });
    return response.data[0].embedding;
  }
}

// ─── Pre-configured factories ─────────────────────────────────────────────────

export function makeOpenAI(
  apiKey: string,
  baseURL?: string,
): OpenAICompatProvider {
  return new OpenAICompatProvider({
    id: 'openai',
    name: 'OpenAI',
    apiKey,
    baseURL,
  });
}

export function makeDeepSeek(apiKey: string): OpenAICompatProvider {
  return new OpenAICompatProvider({
    id: 'deepseek',
    name: 'DeepSeek',
    apiKey,
    baseURL: 'https://api.deepseek.com',
  });
}

export function makeOllama(
  host = 'http://localhost:11434',
): OpenAICompatProvider {
  return new OpenAICompatProvider({
    id: 'ollama',
    name: 'Ollama',
    apiKey: 'ollama',
    baseURL: `${host}/v1`,
  });
}

export function makeOpenLLM(
  baseURL = 'http://localhost:8080',
  apiKey?: string,
): OpenAICompatProvider {
  return new OpenAICompatProvider({
    id: 'openllm',
    name: 'OpenLLM',
    apiKey,
    baseURL: `${baseURL}/v1`,
  });
}

export function makeKiwi(
  apiKey: string,
  baseURL?: string,
): OpenAICompatProvider {
  return new OpenAICompatProvider({
    id: 'kiwi',
    name: 'Kiwi',
    apiKey,
    baseURL: baseURL ?? 'https://api.kiwi.ai/v1',
  });
}
