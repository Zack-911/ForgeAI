import { UserSettings, GuildSettings, ChannelConfig } from './types';
export declare class SettingsManager {
    constructor();
    getUser(userID: string): Promise<UserSettings>;
    saveUser(settings: UserSettings): Promise<void>;
    patchUser(userID: string, patch: Partial<Omit<UserSettings, 'userID'>>): Promise<UserSettings>;
    resetUser(userID: string): Promise<void>;
    getGuild(guildID: string): Promise<GuildSettings>;
    saveGuild(settings: GuildSettings): Promise<void>;
    patchGuild(guildID: string, patch: Partial<Omit<GuildSettings, 'guildID'>>): Promise<GuildSettings>;
    setChannelConfig(guildID: string, channelID: string, config: Partial<ChannelConfig>): Promise<GuildSettings>;
    resetGuild(guildID: string): Promise<void>;
    resolve<K extends keyof Omit<UserSettings, 'userID' | 'extra'>>(key: K, globalVal: UserSettings[K], opts?: {
        userID?: string;
        guildID?: string;
        channelID?: string;
    }): Promise<UserSettings[K]>;
}
//# sourceMappingURL=SettingsManager.d.ts.map