"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgeAI = void 0;
const forgescript_1 = require("@tryforge/forgescript");
const path_1 = __importDefault(require("path"));
const AIEngine_1 = require("./structures/AIEngine");
const AIDatabase_1 = require("./structures/database/AIDatabase");
class ForgeAI extends forgescript_1.ForgeExtension {
    constructor(options) {
        super();
        this.options = options;
        this.name = 'ForgeAI';
        this.description = 'Multi-provider AI for ForgeScript. Chat, conversations, RAG, MCP, model routing and fallback.';
        this.version = require('../package.json').version;
        this.requireExtensions = ['forge.db'];
    }
    async init(client) {
        this.db = new AIDatabase_1.AIDatabase();
        try {
            await this.db.init();
            forgescript_1.Logger.info(`[ForgeAI] Connected to database.`);
        }
        catch (err) {
            forgescript_1.Logger.error(`[ForgeAI] Failed to connect to database: ${err.message}`);
        }
        this.engine = new AIEngine_1.AIEngine(this.options);
        this.load(path_1.default.join(__dirname, './functions'));
        const providerCount = this.engine.providers.getAll().length;
        forgescript_1.Logger.info(`[ForgeAI] v${this.version} ready — ${providerCount} provider(s) registered.`);
    }
}
exports.ForgeAI = ForgeAI;
__exportStar(require("./structures"), exports);
__exportStar(require("./structures/database/AIDatabase"), exports);
__exportStar(require("./structures/database/entities"), exports);
//# sourceMappingURL=index.js.map