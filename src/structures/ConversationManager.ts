import Database from 'better-sqlite3'
import { randomUUID } from 'crypto'
import { existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import { Conversation, ChatMessage } from './types'

export class ConversationManager {
    private db:           Database.Database | null = null
    private memory        = new Map<string, Conversation>()
    private persistent    = false

    constructor(folder?: string) {
        if (folder) {
            if (!existsSync(folder)) mkdirSync(folder, { recursive: true })
            this.db         = new Database(join(folder, 'forge.ai.db'))
            this.persistent = true
            this._setup()
        }
    }

    private _setup(): void {
        this.db!.exec(`
            CREATE TABLE IF NOT EXISTS conversations (
                id TEXT PRIMARY KEY,
                userID TEXT,
                guildID TEXT,
                channelID TEXT,
                messages TEXT NOT NULL DEFAULT '[]',
                systemPrompt TEXT,
                model TEXT,
                temperature REAL,
                maxTokens INTEGER,
                createdAt INTEGER NOT NULL,
                updatedAt INTEGER NOT NULL
            );
            CREATE INDEX IF NOT EXISTS idx_conv_user    ON conversations(userID);
            CREATE INDEX IF NOT EXISTS idx_conv_guild   ON conversations(guildID);
            CREATE INDEX IF NOT EXISTS idx_conv_channel ON conversations(channelID);
        `)
    }

    // ─── CRUD ─────────────────────────────────────────────────────────────────

    create(opts: Partial<Pick<Conversation, 'userID' | 'guildID' | 'channelID' | 'systemPrompt' | 'model'>> = {}): Conversation {
        const now: Conversation = {
            id:           randomUUID(),
            userID:       opts.userID,
            guildID:      opts.guildID,
            channelID:    opts.channelID,
            messages:     [],
            systemPrompt: opts.systemPrompt ?? null,
            model:        opts.model ?? null,
            temperature:  null,
            maxTokens:    null,
            createdAt:    Date.now(),
            updatedAt:    Date.now(),
        }
        this._save(now)
        return now
    }

    get(id: string): Conversation | null {
        if (this.persistent) {
            const row = this.db!.prepare('SELECT * FROM conversations WHERE id = ?').get(id) as any
            if (!row) return null
            return this._deserialize(row)
        }
        return this.memory.get(id) ?? null
    }

    /** Find a conversation by scope. Returns the most recently updated match. */
    findByScope(scope: { userID?: string; guildID?: string; channelID?: string }): Conversation | null {
        if (this.persistent) {
            const clauses: string[] = []
            const params:  unknown[] = []
            if (scope.channelID) { clauses.push('channelID = ?'); params.push(scope.channelID) }
            if (scope.userID)    { clauses.push('userID = ?');    params.push(scope.userID) }
            if (scope.guildID)   { clauses.push('guildID = ?');   params.push(scope.guildID) }
            if (!clauses.length) return null
            const row = this.db!.prepare(
                `SELECT * FROM conversations WHERE ${clauses.join(' AND ')} ORDER BY updatedAt DESC LIMIT 1`
            ).get(...params) as any
            return row ? this._deserialize(row) : null
        }

        // In-memory: linear scan
        let best: Conversation | null = null
        for (const c of this.memory.values()) {
            const match =
                (!scope.channelID || c.channelID === scope.channelID) &&
                (!scope.userID    || c.userID    === scope.userID)    &&
                (!scope.guildID   || c.guildID   === scope.guildID)
            if (match && (!best || c.updatedAt > best.updatedAt)) best = c
        }
        return best
    }

    listByUser(userID: string, guildID?: string): Conversation[] {
        if (this.persistent) {
            const stmt = guildID
                ? this.db!.prepare('SELECT * FROM conversations WHERE userID = ? AND guildID = ? ORDER BY updatedAt DESC')
                : this.db!.prepare('SELECT * FROM conversations WHERE userID = ? ORDER BY updatedAt DESC')
            const rows = guildID ? stmt.all(userID, guildID) : stmt.all(userID)
            return (rows as any[]).map(r => this._deserialize(r))
        }
        return [...this.memory.values()]
            .filter(c => c.userID === userID && (!guildID || c.guildID === guildID))
            .sort((a, b) => b.updatedAt - a.updatedAt)
    }

    addMessage(id: string, message: ChatMessage, maxHistory = 40): Conversation | null {
        const conv = this.get(id)
        if (!conv) return null
        conv.messages.push(message)
        // Keep last N messages (system message always preserved)
        if (conv.messages.length > maxHistory + 1) {
            const system = conv.messages.filter(m => m.role === 'system')
            const rest   = conv.messages.filter(m => m.role !== 'system').slice(-maxHistory)
            conv.messages = [...system, ...rest]
        }
        conv.updatedAt = Date.now()
        this._save(conv)
        return conv
    }

    update(id: string, patch: Partial<Pick<Conversation, 'systemPrompt' | 'model' | 'temperature' | 'maxTokens'>>): Conversation | null {
        const conv = this.get(id)
        if (!conv) return null
        Object.assign(conv, patch)
        conv.updatedAt = Date.now()
        this._save(conv)
        return conv
    }

    clear(id: string): boolean {
        const conv = this.get(id)
        if (!conv) return false
        conv.messages  = conv.messages.filter(m => m.role === 'system')
        conv.updatedAt = Date.now()
        this._save(conv)
        return true
    }

    delete(id: string): boolean {
        if (this.persistent) {
            const result = this.db!.prepare('DELETE FROM conversations WHERE id = ?').run(id)
            return result.changes > 0
        }
        return this.memory.delete(id)
    }

    deleteByScope(scope: { userID?: string; guildID?: string }): number {
        if (this.persistent) {
            const clauses: string[] = []
            const params:  unknown[] = []
            if (scope.userID)  { clauses.push('userID = ?');  params.push(scope.userID) }
            if (scope.guildID) { clauses.push('guildID = ?'); params.push(scope.guildID) }
            if (!clauses.length) return 0
            const result = this.db!.prepare(`DELETE FROM conversations WHERE ${clauses.join(' AND ')}`).run(...params)
            return result.changes
        }
        let count = 0
        for (const [k, c] of this.memory) {
            if ((!scope.userID || c.userID === scope.userID) && (!scope.guildID || c.guildID === scope.guildID)) {
                this.memory.delete(k); count++
            }
        }
        return count
    }

    count(): number {
        if (this.persistent) {
            return (this.db!.prepare('SELECT COUNT(*) as n FROM conversations').get() as any).n
        }
        return this.memory.size
    }

    // ─── Persistence helpers ──────────────────────────────────────────────────

    private _save(conv: Conversation): void {
        if (this.persistent) {
            this.db!.prepare(`
                INSERT INTO conversations(id,userID,guildID,channelID,messages,systemPrompt,model,temperature,maxTokens,createdAt,updatedAt)
                VALUES(?,?,?,?,?,?,?,?,?,?,?)
                ON CONFLICT(id) DO UPDATE SET
                    userID=excluded.userID, guildID=excluded.guildID, channelID=excluded.channelID,
                    messages=excluded.messages, systemPrompt=excluded.systemPrompt, model=excluded.model,
                    temperature=excluded.temperature, maxTokens=excluded.maxTokens, updatedAt=excluded.updatedAt
            `).run(
                conv.id, conv.userID ?? null, conv.guildID ?? null, conv.channelID ?? null,
                JSON.stringify(conv.messages), conv.systemPrompt ?? null, conv.model ?? null,
                conv.temperature ?? null, conv.maxTokens ?? null, conv.createdAt, conv.updatedAt
            )
        } else {
            this.memory.set(conv.id, conv)
        }
    }

    private _deserialize(row: any): Conversation {
        return {
            id:           row.id,
            userID:       row.userID  ?? undefined,
            guildID:      row.guildID ?? undefined,
            channelID:    row.channelID ?? undefined,
            messages:     JSON.parse(row.messages || '[]'),
            systemPrompt: row.systemPrompt ?? null,
            model:        row.model ?? null,
            temperature:  row.temperature ?? null,
            maxTokens:    row.maxTokens ?? null,
            createdAt:    row.createdAt,
            updatedAt:    row.updatedAt,
        }
    }
}
