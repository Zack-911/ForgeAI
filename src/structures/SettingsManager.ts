import { UserSettings, GuildSettings, ChannelConfig } from './types';
import { AIDatabase } from './database/AIDatabase';

const USER_DEFAULTS: Omit<UserSettings, 'userID'> = {
  model: null,
  systemPrompt: null,
  maxHistory: null,
  temperature: null,
  maxTokens: null,
  extra: {},
};

const GUILD_DEFAULTS: Omit<GuildSettings, 'guildID'> = {
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

export class SettingsManager {
  constructor() {}

  // ─── User ─────────────────────────────────────────────────────────────────

  async getUser(userID: string): Promise<UserSettings> {
    const row = await AIDatabase.source
      .getRepository(AIDatabase.UserEntity)
      .findOneBy({ userID });

    if (!row) return { userID, ...USER_DEFAULTS };
    return { userID, ...USER_DEFAULTS, ...JSON.parse(row.data) };
  }

  async saveUser(settings: UserSettings): Promise<void> {
    const { userID, ...data } = settings;
    const repo = AIDatabase.source.getRepository(AIDatabase.UserEntity);

    const row = new AIDatabase.UserEntity();
    row.userID = userID;
    row.data = JSON.stringify(data);

    if (AIDatabase.type === 'mongodb') {
      const old = await repo.findOneBy({ userID });
      if (old) {
        await repo.update(userID, row);
        return;
      }
    }
    await repo.save(row);
  }

  async patchUser(
    userID: string,
    patch: Partial<Omit<UserSettings, 'userID'>>,
  ): Promise<UserSettings> {
    const current = await this.getUser(userID);
    const updated = { ...current, ...patch };
    await this.saveUser(updated);
    return updated;
  }

  async resetUser(userID: string): Promise<void> {
    await AIDatabase.source
      .getRepository(AIDatabase.UserEntity)
      .delete({ userID });
  }

  // ─── Guild ────────────────────────────────────────────────────────────────

  async getGuild(guildID: string): Promise<GuildSettings> {
    const row = await AIDatabase.source
      .getRepository(AIDatabase.GuildEntity)
      .findOneBy({ guildID });

    if (!row) return { guildID, ...GUILD_DEFAULTS };
    return { guildID, ...GUILD_DEFAULTS, ...JSON.parse(row.data) };
  }

  async saveGuild(settings: GuildSettings): Promise<void> {
    const { guildID, ...data } = settings;
    const repo = AIDatabase.source.getRepository(AIDatabase.GuildEntity);

    const row = new AIDatabase.GuildEntity();
    row.guildID = guildID;
    row.data = JSON.stringify(data);

    if (AIDatabase.type === 'mongodb') {
      const old = await repo.findOneBy({ guildID });
      if (old) {
        await repo.update(guildID, row);
        return;
      }
    }
    await repo.save(row);
  }

  async patchGuild(
    guildID: string,
    patch: Partial<Omit<GuildSettings, 'guildID'>>,
  ): Promise<GuildSettings> {
    const current = await this.getGuild(guildID);
    const updated = {
      ...current,
      ...patch,
      channelConfig: { ...current.channelConfig, ...patch.channelConfig },
    };
    await this.saveGuild(updated);
    return updated;
  }

  async setChannelConfig(
    guildID: string,
    channelID: string,
    config: Partial<ChannelConfig>,
  ): Promise<GuildSettings> {
    const guild = await this.getGuild(guildID);
    guild.channelConfig[channelID] = {
      ...guild.channelConfig[channelID],
      ...config,
    };
    await this.saveGuild(guild);
    return guild;
  }

  async resetGuild(guildID: string): Promise<void> {
    await AIDatabase.source
      .getRepository(AIDatabase.GuildEntity)
      .delete({ guildID });
  }

  // ─── Resolution chain ─────────────────────────────────────────────────────
  // Resolve a value from: channel > user > guild > global default

  async resolve<K extends keyof Omit<UserSettings, 'userID' | 'extra'>>(
    key: K,
    globalVal: UserSettings[K],
    opts: { userID?: string; guildID?: string; channelID?: string } = {},
  ): Promise<UserSettings[K]> {
    // Channel
    if (opts.guildID && opts.channelID) {
      const guild = await this.getGuild(opts.guildID);
      const chanCfg = guild.channelConfig[opts.channelID];
      const chanVal = chanCfg?.[key as keyof ChannelConfig] as
        | UserSettings[K]
        | undefined;
      if (chanVal !== undefined && chanVal !== null) return chanVal;
    }

    // User
    if (opts.userID) {
      const user = await this.getUser(opts.userID);
      if (user[key] !== null && user[key] !== undefined) return user[key];
    }

    // Guild
    if (opts.guildID) {
      const guild = await this.getGuild(opts.guildID);
      const gVal = guild[key as keyof GuildSettings] as
        | UserSettings[K]
        | undefined;
      if (gVal !== undefined && gVal !== null) return gVal;
    }

    // Global
    return globalVal;
  }
}
