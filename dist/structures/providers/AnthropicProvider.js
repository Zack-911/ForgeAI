"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnthropicProvider = void 0;
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
const BaseProvider_1 = require("./BaseProvider");
class AnthropicProvider extends BaseProvider_1.BaseProvider {
    constructor(apiKey) {
        super();
        this.id = 'anthropic';
        this.name = 'Anthropic';
        this.client = new sdk_1.default({ apiKey });
    }
    isAvailable() {
        return true;
    }
    async chat(messages, model, options = {}) {
        const systemPrompt = this.extractSystemPrompt(messages);
        const formatted = this.formatMessages(messages);
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
            .map((b) => b.text)
            .join('');
        return {
            content,
            model: response.model,
            inputTokens: response.usage.input_tokens,
            outputTokens: response.usage.output_tokens,
            finishReason: response.stop_reason ?? undefined,
        };
    }
    async listModels() {
        return [
            'anthropic:claude-opus-4-5',
            'anthropic:claude-sonnet-4-5',
            'anthropic:claude-haiku-4-5',
        ];
    }
}
exports.AnthropicProvider = AnthropicProvider;
//# sourceMappingURL=AnthropicProvider.js.map