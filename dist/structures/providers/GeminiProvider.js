"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiProvider = void 0;
const generative_ai_1 = require("@google/generative-ai");
const BaseProvider_1 = require("./BaseProvider");
class GeminiProvider extends BaseProvider_1.BaseProvider {
    constructor(apiKey) {
        super();
        this.id = 'gemini';
        this.name = 'Google Gemini';
        this.client = new generative_ai_1.GoogleGenerativeAI(apiKey);
    }
    isAvailable() {
        return true;
    }
    async chat(messages, model, options = {}) {
        const systemPrompt = this.extractSystemPrompt(messages);
        const genModel = this.client.getGenerativeModel({
            model: this.parseModel(model),
            systemInstruction: systemPrompt,
            safetySettings: [
                {
                    category: generative_ai_1.HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold: generative_ai_1.HarmBlockThreshold.BLOCK_NONE,
                },
                {
                    category: generative_ai_1.HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                    threshold: generative_ai_1.HarmBlockThreshold.BLOCK_NONE,
                },
                {
                    category: generative_ai_1.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                    threshold: generative_ai_1.HarmBlockThreshold.BLOCK_NONE,
                },
                {
                    category: generative_ai_1.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                    threshold: generative_ai_1.HarmBlockThreshold.BLOCK_NONE,
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
        if (!lastMessage)
            throw new Error('No user message to send');
        const chat = genModel.startChat({ history });
        const result = await chat.sendMessage(lastMessage.content);
        return {
            content: result.response.text(),
            model: this.parseModel(model),
            inputTokens: result.response.usageMetadata?.promptTokenCount,
            outputTokens: result.response.usageMetadata?.candidatesTokenCount,
        };
    }
    async listModels() {
        return [
            'gemini:gemini-2.0-flash',
            'gemini:gemini-2.5-pro',
            'gemini:gemini-2.5-flash',
        ];
    }
}
exports.GeminiProvider = GeminiProvider;
//# sourceMappingURL=GeminiProvider.js.map