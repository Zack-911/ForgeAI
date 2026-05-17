import { ArgType, NativeFunction } from '@tryforge/forgescript';
declare enum ConvProps {
    id = "id",
    userID = "userID",
    guildID = "guildID",
    channelID = "channelID",
    model = "model",
    systemPrompt = "systemPrompt",
    temperature = "temperature",
    maxTokens = "maxTokens",
    messageCount = "messageCount",
    createdAt = "createdAt",
    updatedAt = "updatedAt"
}
declare const _default: NativeFunction<[{
    name: string;
    type: ArgType.String;
    required: true;
    rest: false;
    description: string;
}, {
    name: string;
    type: ArgType.Enum;
    enum: typeof ConvProps;
    required: true;
    rest: false;
    description: string;
}], true>;
export default _default;
//# sourceMappingURL=aiConvInfo.d.ts.map