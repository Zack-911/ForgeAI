import 'reflect-metadata';
import { DataSource, MixedList, EntitySchema } from 'typeorm';
import { DataBaseManager } from '@tryforge/forge.db';
import { AIUserSettings, MongoAIUserSettings, AIGuildSettings, MongoAIGuildSettings, AIRAGDocument, MongoAIRAGDocument, AIConversation, MongoAIConversation } from './entities';
export declare abstract class AIDatabaseManager extends DataBaseManager {
    constructor();
}
export declare class AIDatabase extends AIDatabaseManager {
    database: string;
    entityManager: {
        sqlite: MixedList<Function | string | EntitySchema>;
        mongodb: MixedList<Function | string | EntitySchema>;
        mysql: MixedList<Function | string | EntitySchema>;
        postgres: MixedList<Function | string | EntitySchema>;
    };
    private static db;
    private dbInit;
    static UserEntity: typeof AIUserSettings | typeof MongoAIUserSettings;
    static GuildEntity: typeof AIGuildSettings | typeof MongoAIGuildSettings;
    static RAGEntity: typeof AIRAGDocument | typeof MongoAIRAGDocument;
    static ConversationEntity: typeof AIConversation | typeof MongoAIConversation;
    constructor();
    init(): Promise<void>;
    static get source(): DataSource;
}
//# sourceMappingURL=AIDatabase.d.ts.map