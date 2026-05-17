import { Entity, Column, PrimaryColumn, ObjectIdColumn } from 'typeorm';

// ─── User Settings ────────────────────────────────────────────────────────────

@Entity('ai_user_settings')
export class AIUserSettings {
  @PrimaryColumn()
  public userID!: string;

  @Column({ type: 'text' })
  public data!: string;
}

@Entity('ai_user_settings')
export class MongoAIUserSettings extends AIUserSettings {
  @ObjectIdColumn()
  public mongoId?: string;
}

// ─── Guild Settings ───────────────────────────────────────────────────────────

@Entity('ai_guild_settings')
export class AIGuildSettings {
  @PrimaryColumn()
  public guildID!: string;

  @Column({ type: 'text' })
  public data!: string;
}

@Entity('ai_guild_settings')
export class MongoAIGuildSettings extends AIGuildSettings {
  @ObjectIdColumn()
  public mongoId?: string;
}

// ─── RAG Documents ────────────────────────────────────────────────────────────

@Entity('ai_rag_documents')
export class AIRAGDocument {
  @PrimaryColumn()
  public id!: string;

  @Column({ type: 'text' })
  public content!: string;

  @Column({ type: 'text', default: 'default' })
  public namespace!: string;

  @Column({ type: 'text', default: '{}' })
  public metadata!: string;

  @Column({ type: 'text', nullable: true })
  public embedding!: string | null;

  @Column({ type: 'integer' })
  public createdAt!: number;
}

@Entity('ai_rag_documents')
export class MongoAIRAGDocument extends AIRAGDocument {
  @ObjectIdColumn()
  public mongoId?: string;
}

// ─── Conversations ────────────────────────────────────────────────────────────

@Entity('ai_conversations')
export class AIConversation {
  @PrimaryColumn()
  public id!: string;

  @Column({ type: 'text', nullable: true })
  public userID?: string;

  @Column({ type: 'text', nullable: true })
  public guildID?: string;

  @Column({ type: 'text', nullable: true })
  public channelID?: string;

  @Column({ type: 'text', default: '[]' })
  public messages!: string;

  @Column({ type: 'text', nullable: true })
  public systemPrompt?: string | null;

  @Column({ type: 'text', nullable: true })
  public model?: string | null;

  @Column({ type: 'float', nullable: true })
  public temperature?: number | null;

  @Column({ type: 'integer', nullable: true })
  public maxTokens?: number | null;

  @Column({ type: 'integer' })
  public createdAt!: number;

  @Column({ type: 'integer' })
  public updatedAt!: number;
}

@Entity('ai_conversations')
export class MongoAIConversation extends AIConversation {
  @ObjectIdColumn()
  public mongoId?: string;
}
