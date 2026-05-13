import Database from 'better-sqlite3'
import { UserSettings, GuildSettings, ChannelConfig } from './types'

const USER_DEFAULTS: Omit<UserSettings, 'userID'> = {
    model: null, systemPrompt: null,
    maxHistory: null, temperature: null, maxTokens: null,
    extra: {},
}

const GUILD_DEFAULTS: Omit<GuildSettings, 'guildID'> = {
    model: null, systemPrompt: null,
    maxHistory: null, temperature: null, maxTokens: null,
    allowedModels: [], blockedModels: [], channelConfig: {}, extra: {},
}

export class SettingsManager {
    constructor(private readonly db: Database.Database) {
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS ai_user_settings (
                userID TEXT PRIMARY KEY,
                data   TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS ai_guild_settings (
                guildID TEXT PRIMARY KEY,
                data    TEXT NOT NULL
            );
        `)
    }

    // ─── User ─────────────────────────────────────────────────────────────────

    getUser(userID: string): UserSettings {
        const row = this.db.prepare('SELECT data FROM ai_user_settings WHERE userID = ?').get(userID) as any
        if (!row) return { userID, ...USER_DEFAULTS }
        return { userID, ...USER_DEFAULTS, ...JSON.parse(row.data) }
    }

    saveUser(settings: UserSettings): void {
        const { userID, ...data } = settings
        this.db.prepare('INSERT OR REPLACE INTO ai_user_settings(userID, data) VALUES(?, ?)').run(userID, JSON.stringify(data))
    }

    patchUser(userID: string, patch: Partial<Omit<UserSettings, 'userID'>>): UserSettings {
        const current = this.getUser(userID)
        const updated = { ...current, ...patch }
        this.saveUser(updated)
        return updated
    }

    resetUser(userID: string): void {
        this.db.prepare('DELETE FROM ai_user_settings WHERE userID = ?').run(userID)
    }

    // ─── Guild ────────────────────────────────────────────────────────────────

    getGuild(guildID: string): GuildSettings {
        const row = this.db.prepare('SELECT data FROM ai_guild_settings WHERE guildID = ?').get(guildID) as any
        if (!row) return { guildID, ...GUILD_DEFAULTS }
        return { guildID, ...GUILD_DEFAULTS, ...JSON.parse(row.data) }
    }

    saveGuild(settings: GuildSettings): void {
        const { guildID, ...data } = settings
        this.db.prepare('INSERT OR REPLACE INTO ai_guild_settings(guildID, data) VALUES(?, ?)').run(guildID, JSON.stringify(data))
    }

    patchGuild(guildID: string, patch: Partial<Omit<GuildSettings, 'guildID'>>): GuildSettings {
        const current = this.getGuild(guildID)
        const updated = {
            ...current, ...patch,
            channelConfig: { ...current.channelConfig, ...patch.channelConfig },
        }
        this.saveGuild(updated)
        return updated
    }

    setChannelConfig(guildID: string, channelID: string, config: Partial<ChannelConfig>): GuildSettings {
        const guild = this.getGuild(guildID)
        guild.channelConfig[channelID] = { ...guild.channelConfig[channelID], ...config }
        this.saveGuild(guild)
        return guild
    }

    resetGuild(guildID: string): void {
        this.db.prepare('DELETE FROM ai_guild_settings WHERE guildID = ?').run(guildID)
    }

    // ─── Resolution chain ─────────────────────────────────────────────────────
    // Resolve a value from: channel > user > guild > global default

    resolve<K extends keyof Omit<UserSettings, 'userID' | 'extra'>>(
        key:       K,
        globalVal: UserSettings[K],
        opts: { userID?: string; guildID?: string; channelID?: string } = {}
    ): UserSettings[K] {
        // Channel
        if (opts.guildID && opts.channelID) {
            const guild   = this.getGuild(opts.guildID)
            const chanCfg = guild.channelConfig[opts.channelID]
            const chanVal = chanCfg?.[key as keyof ChannelConfig] as UserSettings[K] | undefined
            if (chanVal !== undefined && chanVal !== null) return chanVal
        }

        // User
        if (opts.userID) {
            const user = this.getUser(opts.userID)
            if (user[key] !== null && user[key] !== undefined) return user[key]
        }

        // Guild
        if (opts.guildID) {
            const guild = this.getGuild(opts.guildID)
            const gVal  = guild[key as keyof GuildSettings] as UserSettings[K] | undefined
            if (gVal !== undefined && gVal !== null) return gVal
        }

        // Global
        return globalVal
    }
}
