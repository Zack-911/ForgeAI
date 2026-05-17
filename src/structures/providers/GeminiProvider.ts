import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from '@google/generative-ai';
import { BaseProvider } from './BaseProvider';
import { ChatMessage, ChatOptions, ProviderResponse } from '../types';

export class GeminiProvider extends BaseProvider {
  readonly id = 'gemini';
  readonly name = 'Google Gemini';
  private client: GoogleGenerativeAI;

  constructor(apiKey: string) {
    super();
    this.client = new GoogleGenerativeAI(apiKey);
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
    const genModel = this.client.getGenerativeModel({
      model: this.parseModel(model),
      systemInstruction: systemPrompt,
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
      ],
    });

    const history = messages
      .filter((m) => m.role !== 'system')
      .slice(0, -1)
      .map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

    const lastMessage = messages.filter((m) => m.role !== 'system').at(-1);
    if (!lastMessage) throw new Error('No user message to send');

    const chat = genModel.startChat({ history });
    const result = await chat.sendMessage(lastMessage.content);

    return {
      content: result.response.text(),
      model: this.parseModel(model),
      inputTokens: result.response.usageMetadata?.promptTokenCount,
      outputTokens: result.response.usageMetadata?.candidatesTokenCount,
    };
  }

  async listModels(): Promise<string[]> {
    return [
      'gemini:gemini-2.0-flash',
      'gemini:gemini-2.5-pro',
      'gemini:gemini-2.5-flash',
    ];
  }
}
