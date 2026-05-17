"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseProvider = void 0;
class BaseProvider {
    /** Parse a `provider:model` string, returning just the model part. */
    parseModel(modelString) {
        const idx = modelString.indexOf(':');
        return idx === -1 ? modelString : modelString.slice(idx + 1);
    }
    /** Convert ChatMessage[] to the format this provider expects. */
    formatMessages(messages) {
        return messages
            .filter((m) => m.role !== 'system')
            .map((m) => ({ role: m.role, content: m.content }));
    }
    extractSystemPrompt(messages) {
        return messages.find((m) => m.role === 'system')?.content;
    }
}
exports.BaseProvider = BaseProvider;
//# sourceMappingURL=BaseProvider.js.map