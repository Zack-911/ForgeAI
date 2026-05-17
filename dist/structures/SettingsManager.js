"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsManager = void 0;
const AIDatabase_1 = require("./database/AIDatabase");
const USER_DEFAULTS = {
    model: null,
    systemPrompt: null,
    maxHistory: null,
    temperature: null,
    maxTokens: null,
    extra: {},
};
const GUILD_DEFAULTS = {
    model: null,
    systemPrompt: null,
    maxHistory: null,
    temperature: null,
    maxTokens: null,
    allowedModels: [],
    blockedModels: [],
    channelConfig: {},
    extra: {},
};
class SettingsManager {
    constructor() { }
    // ─── User ─────────────────────────────────────────────────────────────────
    async getUser(userID) {
        const row = await AIDatabase_1.AIDatabase.source
            .getRepository(AIDatabase_1.AIDatabase.UserEntity)
            .findOneBy({ userID });
        if (!row)
            return { userID, ...USER_DEFAULTS };
        return { userID, ...USER_DEFAULTS, ...JSON.parse(row.data) };
    }
    async saveUser(settings) {
        const { userID, ...data } = settings;
        const repo = AIDatabase_1.AIDatabase.source.getRepository(AIDatabase_1.AIDatabase.UserEntity);
        const row = new AIDatabase_1.AIDatabase.UserEntity();
        row.userID = userID;
        row.data = JSON.stringify(data);
        if (AIDatabase_1.AIDatabase.type === 'mongodb') {
            const old = await repo.findOneBy({ userID });
            if (old) {
                await repo.update(userID, row);
                return;
            }
        }
        await repo.save(row);
    }
    async patchUser(userID, patch) {
        const current = await this.getUser(userID);
        const updated = { ...current, ...patch };
        await this.saveUser(updated);
        return updated;
    }
    async resetUser(userID) {
        await AIDatabase_1.AIDatabase.source
            .getRepository(AIDatabase_1.AIDatabase.UserEntity)
            .delete({ userID });
    }
    // ─── Guild ────────────────────────────────────────────────────────────────
    async getGuild(guildID) {
        const row = await AIDatabase_1.AIDatabase.source
            .getRepository(AIDatabase_1.AIDatabase.GuildEntity)
            .findOneBy({ guildID });
        if (!row)
            return { guildID, ...GUILD_DEFAULTS };
        return { guildID, ...GUILD_DEFAULTS, ...JSON.parse(row.data) };
    }
    async saveGuild(settings) {
        const { guildID, ...data } = settings;
        const repo = AIDatabase_1.AIDatabase.source.getRepository(AIDatabase_1.AIDatabase.GuildEntity);
        const row = new AIDatabase_1.AIDatabase.GuildEntity();
        row.guildID = guildID;
        row.data = JSON.stringify(data);
        if (AIDatabase_1.AIDatabase.type === 'mongodb') {
            const old = await repo.findOneBy({ guildID });
            if (old) {
                await repo.update(guildID, row);
                return;
            }
        }
        await repo.save(row);
    }
    async patchGuild(guildID, patch) {
        const current = await this.getGuild(guildID);
        const updated = {
            ...current,
            ...patch,
            channelConfig: { ...current.channelConfig, ...patch.channelConfig },
        };
        await this.saveGuild(updated);
        return updated;
    }
    async setChannelConfig(guildID, channelID, config) {
        const guild = await this.getGuild(guildID);
        guild.channelConfig[channelID] = {
            ...guild.channelConfig[channelID],
            ...config,
        };
        await this.saveGuild(guild);
        return guild;
    }
    async resetGuild(guildID) {
        await AIDatabase_1.AIDatabase.source
            .getRepository(AIDatabase_1.AIDatabase.GuildEntity)
            .delete({ guildID });
    }
    // ─── Resolution chain ─────────────────────────────────────────────────────
    // Resolve a value from: channel > user > guild > global default
    async resolve(key, globalVal, opts = {}) {
        // Channel
        if (opts.guildID && opts.channelID) {
            const guild = await this.getGuild(opts.guildID);
            const chanCfg = guild.channelConfig[opts.channelID];
            const chanVal = chanCfg?.[key];
            if (chanVal !== undefined && chanVal !== null)
                return chanVal;
        }
        // User
        if (opts.userID) {
            const user = await this.getUser(opts.userID);
            if (user[key] !== null && user[key] !== undefined)
                return user[key];
        }
        // Guild
        if (opts.guildID) {
            const guild = await this.getGuild(opts.guildID);
            const gVal = guild[key];
            if (gVal !== undefined && gVal !== null)
                return gVal;
        }
        // Global
        return globalVal;
    }
}
exports.SettingsManager = SettingsManager;
//# sourceMappingURL=SettingsManager.js.map