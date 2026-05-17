import 'reflect-metadata';
import { DataSource, MixedList, EntitySchema } from 'typeorm';
import { DataBaseManager } from '@tryforge/forge.db';
import {
  AIUserSettings,
  MongoAIUserSettings,
  AIGuildSettings,
  MongoAIGuildSettings,
  AIRAGDocument,
  MongoAIRAGDocument,
  AIConversation,
  MongoAIConversation,
} from './entities';

export abstract class AIDatabaseManager extends DataBaseManager {
  constructor() {
    super();
  }
}

export class AIDatabase extends AIDatabaseManager {
  public database = 'forge.ai.db';

  public entityManager: {
    sqlite: MixedList<Function | string | EntitySchema>;
    mongodb: MixedList<Function | string | EntitySchema>;
    mysql: MixedList<Function | string | EntitySchema>;
    postgres: MixedList<Function | string | EntitySchema>;
  } = {
    sqlite: [AIUserSettings, AIGuildSettings, AIRAGDocument, AIConversation],
    mongodb: [
      MongoAIUserSettings,
      MongoAIGuildSettings,
      MongoAIRAGDocument,
      MongoAIConversation,
    ],
    mysql: [AIUserSettings, AIGuildSettings, AIRAGDocument, AIConversation],
    postgres: [AIUserSettings, AIGuildSettings, AIRAGDocument, AIConversation],
  };

  private static db: DataSource;
  private dbInit: Promise<DataSource>;

  public static UserEntity: typeof AIUserSettings | typeof MongoAIUserSettings;
  public static GuildEntity:
    | typeof AIGuildSettings
    | typeof MongoAIGuildSettings;
  public static RAGEntity: typeof AIRAGDocument | typeof MongoAIRAGDocument;
  public static ConversationEntity:
    | typeof AIConversation
    | typeof MongoAIConversation;

  constructor() {
    super();
    this.type ??= 'sqlite';
    this.dbInit = this.getDB();
  }

  public async init() {
    AIDatabase.db = await this.dbInit;

    const isMongo = this.type === 'mongodb';
    AIDatabase.UserEntity = isMongo ? MongoAIUserSettings : AIUserSettings;
    AIDatabase.GuildEntity = isMongo ? MongoAIGuildSettings : AIGuildSettings;
    AIDatabase.RAGEntity = isMongo ? MongoAIRAGDocument : AIRAGDocument;
    AIDatabase.ConversationEntity = isMongo
      ? MongoAIConversation
      : AIConversation;
  }

  public static get source() {
    return this.db;
  }
}
