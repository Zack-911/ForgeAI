"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("../..");
var ConvProps;
(function (ConvProps) {
    ConvProps["id"] = "id";
    ConvProps["userID"] = "userID";
    ConvProps["guildID"] = "guildID";
    ConvProps["channelID"] = "channelID";
    ConvProps["model"] = "model";
    ConvProps["systemPrompt"] = "systemPrompt";
    ConvProps["temperature"] = "temperature";
    ConvProps["maxTokens"] = "maxTokens";
    ConvProps["messageCount"] = "messageCount";
    ConvProps["createdAt"] = "createdAt";
    ConvProps["updatedAt"] = "updatedAt";
})(ConvProps || (ConvProps = {}));
exports.default = new forgescript_1.NativeFunction({
    name: '$aiConvInfo',
    description: 'Returns a property of a conversation as a string. Properties: id, userID, guildID, channelID, model, systemPrompt, temperature, maxTokens, messageCount, createdAt, updatedAt',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        {
            name: 'convId',
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false,
            description: 'The ID of the conversation.',
        },
        {
            name: 'property',
            type: forgescript_1.ArgType.Enum,
            enum: ConvProps,
            required: true,
            rest: false,
            description: 'The property of the conversation to return.',
        },
    ],
    output: forgescript_1.ArgType.String,
    async execute(ctx, [convId, property]) {
        const ext = ctx.client.getExtension(__1.ForgeAI, true);
        const conv = await ext.engine.conversations.get(convId);
        if (!conv)
            return this.customError(`Conversation "${convId}" not found.`);
        const map = {
            id: conv.id,
            userID: conv.userID ?? '',
            guildID: conv.guildID ?? '',
            channelID: conv.channelID ?? '',
            model: conv.model ?? '',
            systemPrompt: conv.systemPrompt ?? '',
            temperature: String(conv.temperature ?? ''),
            maxTokens: String(conv.maxTokens ?? ''),
            messageCount: String(conv.messages.filter((m) => m.role !== 'system').length),
            createdAt: String(conv.createdAt),
            updatedAt: String(conv.updatedAt),
        };
        return this.success(map[property] ?? '');
    },
});
//# sourceMappingURL=aiConvInfo.js.map