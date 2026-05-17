"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAICompatProvider = void 0;
exports.makeOpenAI = makeOpenAI;
exports.makeDeepSeek = makeDeepSeek;
exports.makeOllama = makeOllama;
exports.makeOpenLLM = makeOpenLLM;
exports.makeKiwi = makeKiwi;
const openai_1 = __importDefault(require("openai"));
const BaseProvider_1 = require("./BaseProvider");
class OpenAICompatProvider extends BaseProvider_1.BaseProvider {
    constructor(config) {
        super();
        this.config = config;
        this.id = config.id;
        this.name = config.name;
        this.client = new openai_1.default({
            apiKey: config.apiKey ?? 'no-key',
            baseURL: config.baseURL,
        });
    }
    isAvailable() {
        return !!(this.config.apiKey || this.config.baseURL);
    }
    async chat(messages, model, options = {}) {
        const systemPrompt = this.extractSystemPrompt(messages);
        const chatMessages = [];
        if (systemPrompt)
            chatMessages.push({ role: 'system', content: systemPrompt });
        for (const m of messages.filter((x) => x.role !== 'system')) {
            chatMessages.push({
                role: m.role,
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
        const toolCalls = [];
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
    async listModels() {
        try {
            const list = await this.client.models.list();
            return list.data.map((m) => `${this.id}:${m.id}`);
        }
        catch {
            return [];
        }
    }
    /** Also used for embeddings by RAGManager. */
    async embed(text, model) {
        const response = await this.client.embeddings.create({
            model: this.parseModel(model),
            input: text,
        });
        return response.data[0].embedding;
    }
}
exports.OpenAICompatProvider = OpenAICompatProvider;
// ─── Pre-configured factories ─────────────────────────────────────────────────
function makeOpenAI(apiKey, baseURL) {
    return new OpenAICompatProvider({
        id: 'openai',
        name: 'OpenAI',
        apiKey,
        baseURL,
    });
}
function makeDeepSeek(apiKey) {
    return new OpenAICompatProvider({
        id: 'deepseek',
        name: 'DeepSeek',
        apiKey,
        baseURL: 'https://api.deepseek.com',
    });
}
function makeOllama(host = 'http://localhost:11434') {
    return new OpenAICompatProvider({
        id: 'ollama',
        name: 'Ollama',
        apiKey: 'ollama',
        baseURL: `${host}/v1`,
    });
}
function makeOpenLLM(baseURL = 'http://localhost:8080', apiKey) {
    return new OpenAICompatProvider({
        id: 'openllm',
        name: 'OpenLLM',
        apiKey,
        baseURL: `${baseURL}/v1`,
    });
}
function makeKiwi(apiKey, baseURL) {
    return new OpenAICompatProvider({
        id: 'kiwi',
        name: 'Kiwi',
        apiKey,
        baseURL: baseURL ?? 'https://api.kiwi.ai/v1',
    });
}
//# sourceMappingURL=OpenAICompatProvider.js.map