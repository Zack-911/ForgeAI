import { randomUUID } from 'crypto';
import { Conversation, ChatMessage } from './types';
import { AIDatabase } from './database/AIDatabase';

export class ConversationManager {
  private memory = new Map<string, Conversation>();
  private persistent = false;

  constructor(enabled = false) {
    this.persistent = enabled;
  }

  // ─── CRUD ─────────────────────────────────────────────────────────────────

  async create(
    opts: Partial<
      Pick<
        Conversation,
        'userID' | 'guildID' | 'channelID' | 'systemPrompt' | 'model'
      >
    > = {},
  ): Promise<Conversation> {
    const now: Conversation = {
      id: randomUUID(),
      userID: opts.userID,
      guildID: opts.guildID,
      channelID: opts.channelID,
      messages: [],
      systemPrompt: opts.systemPrompt ?? null,
      model: opts.model ?? null,
      temperature: null,
      maxTokens: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await this._save(now);
    return now;
  }

  async get(id: string): Promise<Conversation | null> {
    if (this.persistent) {
      const row = await AIDatabase.source
        .getRepository(AIDatabase.ConversationEntity)
        .findOneBy({ id });
      if (!row) return null;
      return this._deserialize(row);
    }
    return this.memory.get(id) ?? null;
  }

  /** Find a conversation by scope. Returns the most recently updated match. */
  async findByScope(scope: {
    userID?: string;
    guildID?: string;
    channelID?: string;
  }): Promise<Conversation | null> {
    if (this.persistent) {
      const repo = AIDatabase.source.getRepository(
        AIDatabase.ConversationEntity,
      );
      const query = repo.createQueryBuilder('conv');

      if (scope.channelID)
        query.andWhere('conv.channelID = :channelID', {
          channelID: scope.channelID,
        });
      if (scope.userID)
        query.andWhere('conv.userID = :userID', { userID: scope.userID });
      if (scope.guildID)
        query.andWhere('conv.guildID = :guildID', { guildID: scope.guildID });

      const row = await query.orderBy('conv.updatedAt', 'DESC').getOne();
      return row ? this._deserialize(row) : null;
    }

    // In-memory: linear scan
    let best: Conversation | null = null;
    for (const c of this.memory.values()) {
      const match =
        (!scope.channelID || c.channelID === scope.channelID) &&
        (!scope.userID || c.userID === scope.userID) &&
        (!scope.guildID || c.guildID === scope.guildID);
      if (match && (!best || c.updatedAt > best.updatedAt)) best = c;
    }
    return best;
  }

  async listByUser(userID: string, guildID?: string): Promise<Conversation[]> {
    if (this.persistent) {
      const repo = AIDatabase.source.getRepository(
        AIDatabase.ConversationEntity,
      );
      const where: any = { userID };
      if (guildID) where.guildID = guildID;

      const rows = await repo.find({
        where,
        order: { updatedAt: 'DESC' },
      });
      return rows.map((r) => this._deserialize(r));
    }
    return [...this.memory.values()]
      .filter((c) => c.userID === userID && (!guildID || c.guildID === guildID))
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }

  async addMessage(
    id: string,
    message: ChatMessage,
    maxHistory = 40,
  ): Promise<Conversation | null> {
    const conv = await this.get(id);
    if (!conv) return null;
    conv.messages.push(message);
    // Keep last N messages (system message always preserved)
    if (conv.messages.length > maxHistory + 1) {
      const system = conv.messages.filter((m) => m.role === 'system');
      const rest = conv.messages
        .filter((m) => m.role !== 'system')
        .slice(-maxHistory);
      conv.messages = [...system, ...rest];
    }
    conv.updatedAt = Date.now();
    await this._save(conv);
    return conv;
  }

  async update(
    id: string,
    patch: Partial<
      Pick<Conversation, 'systemPrompt' | 'model' | 'temperature' | 'maxTokens'>
    >,
  ): Promise<Conversation | null> {
    const conv = await this.get(id);
    if (!conv) return null;
    Object.assign(conv, patch);
    conv.updatedAt = Date.now();
    await this._save(conv);
    return conv;
  }

  async clear(id: string): Promise<boolean> {
    const conv = await this.get(id);
    if (!conv) return false;
    conv.messages = conv.messages.filter((m) => m.role === 'system');
    conv.updatedAt = Date.now();
    await this._save(conv);
    return true;
  }

  async delete(id: string): Promise<boolean> {
    if (this.persistent) {
      const res = await AIDatabase.source
        .getRepository(AIDatabase.ConversationEntity)
        .delete({ id });
      return (res.affected ?? 0) > 0;
    }
    return this.memory.delete(id);
  }

  async deleteByScope(scope: {
    userID?: string;
    guildID?: string;
  }): Promise<number> {
    if (this.persistent) {
      const repo = AIDatabase.source.getRepository(
        AIDatabase.ConversationEntity,
      );
      const where: any = {};
      if (scope.userID) where.userID = scope.userID;
      if (scope.guildID) where.guildID = scope.guildID;

      if (Object.keys(where).length === 0) return 0;
      const res = await repo.delete(where);
      return res.affected ?? 0;
    }
    let count = 0;
    for (const [k, c] of this.memory) {
      if (
        (!scope.userID || c.userID === scope.userID) &&
        (!scope.guildID || c.guildID === scope.guildID)
      ) {
        this.memory.delete(k);
        count++;
      }
    }
    return count;
  }

  async count(): Promise<number> {
    if (this.persistent) {
      return await AIDatabase.source
        .getRepository(AIDatabase.ConversationEntity)
        .count();
    }
    return this.memory.size;
  }

  // ─── Persistence helpers ──────────────────────────────────────────────────

  private async _save(conv: Conversation): Promise<void> {
    if (this.persistent) {
      const repo = AIDatabase.source.getRepository(
        AIDatabase.ConversationEntity,
      );

      const row = new AIDatabase.ConversationEntity() as any;
      row.id = conv.id;
      row.userID = conv.userID ?? null;
      row.guildID = conv.guildID ?? null;
      row.channelID = conv.channelID ?? null;
      row.messages = JSON.stringify(conv.messages);
      row.systemPrompt = conv.systemPrompt ?? null;
      row.model = conv.model ?? null;
      row.temperature = conv.temperature ?? null;
      row.maxTokens = conv.maxTokens ?? null;
      row.createdAt = conv.createdAt;
      row.updatedAt = conv.updatedAt;

      if (AIDatabase.type === 'mongodb') {
        const old = await repo.findOneBy({ id: conv.id });
        if (old) {
          await repo.update(conv.id, row);
          return;
        }
      }
      await repo.save(row);
    } else {
      this.memory.set(conv.id, conv);
    }
  }

  private _deserialize(row: any): Conversation {
    return {
      id: row.id,
      userID: row.userID ?? undefined,
      guildID: row.guildID ?? undefined,
      channelID: row.channelID ?? undefined,
      messages: JSON.parse(row.messages || '[]'),
      systemPrompt: row.systemPrompt ?? null,
      model: row.model ?? null,
      temperature: row.temperature ?? null,
      maxTokens: row.maxTokens ?? null,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}
