"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoAIConversation = exports.AIConversation = exports.MongoAIRAGDocument = exports.AIRAGDocument = exports.MongoAIGuildSettings = exports.AIGuildSettings = exports.MongoAIUserSettings = exports.AIUserSettings = void 0;
const typeorm_1 = require("typeorm");
// ─── User Settings ────────────────────────────────────────────────────────────
let AIUserSettings = class AIUserSettings {
};
exports.AIUserSettings = AIUserSettings;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], AIUserSettings.prototype, "userID", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], AIUserSettings.prototype, "data", void 0);
exports.AIUserSettings = AIUserSettings = __decorate([
    (0, typeorm_1.Entity)('ai_user_settings')
], AIUserSettings);
let MongoAIUserSettings = class MongoAIUserSettings extends AIUserSettings {
};
exports.MongoAIUserSettings = MongoAIUserSettings;
__decorate([
    (0, typeorm_1.ObjectIdColumn)(),
    __metadata("design:type", String)
], MongoAIUserSettings.prototype, "mongoId", void 0);
exports.MongoAIUserSettings = MongoAIUserSettings = __decorate([
    (0, typeorm_1.Entity)('ai_user_settings')
], MongoAIUserSettings);
// ─── Guild Settings ───────────────────────────────────────────────────────────
let AIGuildSettings = class AIGuildSettings {
};
exports.AIGuildSettings = AIGuildSettings;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], AIGuildSettings.prototype, "guildID", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], AIGuildSettings.prototype, "data", void 0);
exports.AIGuildSettings = AIGuildSettings = __decorate([
    (0, typeorm_1.Entity)('ai_guild_settings')
], AIGuildSettings);
let MongoAIGuildSettings = class MongoAIGuildSettings extends AIGuildSettings {
};
exports.MongoAIGuildSettings = MongoAIGuildSettings;
__decorate([
    (0, typeorm_1.ObjectIdColumn)(),
    __metadata("design:type", String)
], MongoAIGuildSettings.prototype, "mongoId", void 0);
exports.MongoAIGuildSettings = MongoAIGuildSettings = __decorate([
    (0, typeorm_1.Entity)('ai_guild_settings')
], MongoAIGuildSettings);
// ─── RAG Documents ────────────────────────────────────────────────────────────
let AIRAGDocument = class AIRAGDocument {
};
exports.AIRAGDocument = AIRAGDocument;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], AIRAGDocument.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], AIRAGDocument.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: 'default' }),
    __metadata("design:type", String)
], AIRAGDocument.prototype, "namespace", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: '{}' }),
    __metadata("design:type", String)
], AIRAGDocument.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], AIRAGDocument.prototype, "embedding", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer' }),
    __metadata("design:type", Number)
], AIRAGDocument.prototype, "createdAt", void 0);
exports.AIRAGDocument = AIRAGDocument = __decorate([
    (0, typeorm_1.Entity)('ai_rag_documents')
], AIRAGDocument);
let MongoAIRAGDocument = class MongoAIRAGDocument extends AIRAGDocument {
};
exports.MongoAIRAGDocument = MongoAIRAGDocument;
__decorate([
    (0, typeorm_1.ObjectIdColumn)(),
    __metadata("design:type", String)
], MongoAIRAGDocument.prototype, "mongoId", void 0);
exports.MongoAIRAGDocument = MongoAIRAGDocument = __decorate([
    (0, typeorm_1.Entity)('ai_rag_documents')
], MongoAIRAGDocument);
// ─── Conversations ────────────────────────────────────────────────────────────
let AIConversation = class AIConversation {
};
exports.AIConversation = AIConversation;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], AIConversation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AIConversation.prototype, "userID", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AIConversation.prototype, "guildID", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AIConversation.prototype, "channelID", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: '[]' }),
    __metadata("design:type", String)
], AIConversation.prototype, "messages", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], AIConversation.prototype, "systemPrompt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], AIConversation.prototype, "model", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Object)
], AIConversation.prototype, "temperature", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Object)
], AIConversation.prototype, "maxTokens", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer' }),
    __metadata("design:type", Number)
], AIConversation.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer' }),
    __metadata("design:type", Number)
], AIConversation.prototype, "updatedAt", void 0);
exports.AIConversation = AIConversation = __decorate([
    (0, typeorm_1.Entity)('ai_conversations')
], AIConversation);
let MongoAIConversation = class MongoAIConversation extends AIConversation {
};
exports.MongoAIConversation = MongoAIConversation;
__decorate([
    (0, typeorm_1.ObjectIdColumn)(),
    __metadata("design:type", String)
], MongoAIConversation.prototype, "mongoId", void 0);
exports.MongoAIConversation = MongoAIConversation = __decorate([
    (0, typeorm_1.Entity)('ai_conversations')
], MongoAIConversation);
//# sourceMappingURL=entities.js.map