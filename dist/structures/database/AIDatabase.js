"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIDatabase = exports.AIDatabaseManager = void 0;
require("reflect-metadata");
const forge_db_1 = require("@tryforge/forge.db");
const entities_1 = require("./entities");
class AIDatabaseManager extends forge_db_1.DataBaseManager {
    constructor() {
        super();
    }
}
exports.AIDatabaseManager = AIDatabaseManager;
class AIDatabase extends AIDatabaseManager {
    constructor() {
        super();
        this.database = 'forge.ai.db';
        this.entityManager = {
            sqlite: [entities_1.AIUserSettings, entities_1.AIGuildSettings, entities_1.AIRAGDocument, entities_1.AIConversation],
            mongodb: [
                entities_1.MongoAIUserSettings,
                entities_1.MongoAIGuildSettings,
                entities_1.MongoAIRAGDocument,
                entities_1.MongoAIConversation,
            ],
            mysql: [entities_1.AIUserSettings, entities_1.AIGuildSettings, entities_1.AIRAGDocument, entities_1.AIConversation],
            postgres: [entities_1.AIUserSettings, entities_1.AIGuildSettings, entities_1.AIRAGDocument, entities_1.AIConversation],
        };
        this.type ?? (this.type = 'sqlite');
        this.dbInit = this.getDB();
    }
    async init() {
        AIDatabase.db = await this.dbInit;
        const isMongo = this.type === 'mongodb';
        AIDatabase.UserEntity = isMongo ? entities_1.MongoAIUserSettings : entities_1.AIUserSettings;
        AIDatabase.GuildEntity = isMongo ? entities_1.MongoAIGuildSettings : entities_1.AIGuildSettings;
        AIDatabase.RAGEntity = isMongo ? entities_1.MongoAIRAGDocument : entities_1.AIRAGDocument;
        AIDatabase.ConversationEntity = isMongo
            ? entities_1.MongoAIConversation
            : entities_1.AIConversation;
    }
    static get source() {
        return this.db;
    }
}
exports.AIDatabase = AIDatabase;
//# sourceMappingURL=AIDatabase.js.map