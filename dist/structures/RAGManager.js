"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RAGManager = void 0;
const crypto_1 = require("crypto");
const AIDatabase_1 = require("./database/AIDatabase");
class RAGManager {
    constructor(topK = 3, minSimilarity = 0.7) {
        this.topK = topK;
        this.minSimilarity = minSimilarity;
        this.embedFn = null;
    }
    setEmbedFunction(fn) {
        this.embedFn = fn;
    }
    // ─── Document management ──────────────────────────────────────────────────
    async add(content, namespace = 'default', metadata = {}) {
        const embedding = this.embedFn ? await this.embedFn(content) : null;
        const doc = {
            id: (0, crypto_1.randomUUID)(),
            content,
            namespace,
            metadata,
            embedding,
            createdAt: Date.now(),
        };
        const row = new AIDatabase_1.AIDatabase.RAGEntity();
        row.id = doc.id;
        row.content = doc.content;
        row.namespace = doc.namespace;
        row.metadata = JSON.stringify(doc.metadata);
        row.embedding = doc.embedding ? JSON.stringify(doc.embedding) : null;
        row.createdAt = doc.createdAt;
        await AIDatabase_1.AIDatabase.source.getRepository(AIDatabase_1.AIDatabase.RAGEntity).save(row);
        return doc;
    }
    async addBatch(items) {
        let count = 0;
        for (const item of items) {
            await this.add(item.content, item.namespace, item.metadata);
            count++;
        }
        return count;
    }
    async delete(id) {
        const res = await AIDatabase_1.AIDatabase.source
            .getRepository(AIDatabase_1.AIDatabase.RAGEntity)
            .delete({ id });
        return (res.affected ?? 0) > 0;
    }
    async deleteByNamespace(namespace) {
        const res = await AIDatabase_1.AIDatabase.source
            .getRepository(AIDatabase_1.AIDatabase.RAGEntity)
            .delete({ namespace });
        return res.affected ?? 0;
    }
    async count(namespace) {
        const repo = AIDatabase_1.AIDatabase.source.getRepository(AIDatabase_1.AIDatabase.RAGEntity);
        if (namespace) {
            return await repo.countBy({ namespace });
        }
        return await repo.count();
    }
    async listNamespaces() {
        const rows = await AIDatabase_1.AIDatabase.source
            .getRepository(AIDatabase_1.AIDatabase.RAGEntity)
            .createQueryBuilder('doc')
            .select('DISTINCT doc.namespace', 'namespace')
            .getRawMany();
        return rows.map((r) => r.namespace);
    }
    // ─── Search ───────────────────────────────────────────────────────────────
    async search(query, namespace, topK, minSimilarity) {
        const k = topK ?? this.topK;
        const minS = minSimilarity ?? this.minSimilarity;
        const repo = AIDatabase_1.AIDatabase.source.getRepository(AIDatabase_1.AIDatabase.RAGEntity);
        const rows = namespace
            ? await repo.findBy({ namespace })
            : await repo.find();
        if (!rows.length)
            return [];
        if (this.embedFn) {
            return this._vectorSearch(query, rows, k, minS);
        }
        return this._keywordSearch(query, rows, k);
    }
    async _vectorSearch(query, rows, k, minS) {
        const queryEmbed = await this.embedFn(query);
        const results = [];
        for (const row of rows) {
            if (!row.embedding)
                continue;
            const docEmbed = JSON.parse(row.embedding);
            const similarity = this._cosineSimilarity(queryEmbed, docEmbed);
            if (similarity >= minS) {
                results.push({ document: this._deserialize(row), similarity });
            }
        }
        return results.sort((a, b) => b.similarity - a.similarity).slice(0, k);
    }
    _keywordSearch(query, rows, k) {
        const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
        const results = [];
        for (const row of rows) {
            const content = row.content.toLowerCase();
            const matches = terms.filter((t) => content.includes(t)).length;
            if (matches > 0) {
                results.push({
                    document: this._deserialize(row),
                    similarity: matches / terms.length,
                });
            }
        }
        return results.sort((a, b) => b.similarity - a.similarity).slice(0, k);
    }
    _cosineSimilarity(a, b) {
        if (a.length !== b.length)
            return 0;
        let dot = 0, magA = 0, magB = 0;
        for (let i = 0; i < a.length; i++) {
            dot += a[i] * b[i];
            magA += a[i] ** 2;
            magB += b[i] ** 2;
        }
        const denom = Math.sqrt(magA) * Math.sqrt(magB);
        return denom === 0 ? 0 : dot / denom;
    }
    _deserialize(row) {
        return {
            id: row.id,
            content: row.content,
            namespace: row.namespace,
            metadata: JSON.parse(row.metadata || '{}'),
            embedding: row.embedding ? JSON.parse(row.embedding) : null,
            createdAt: row.createdAt,
        };
    }
    /** Format search results as a context string for injection into prompts. */
    static formatContext(results) {
        if (!results.length)
            return '';
        const docs = results
            .map((r, i) => `[Document ${i + 1}] (similarity: ${(r.similarity * 100).toFixed(0)}%)\n${r.document.content}`)
            .join('\n\n');
        return `Relevant context:\n\n${docs}\n\n---\n\nUse the above context to answer the following question:`;
    }
}
exports.RAGManager = RAGManager;
//# sourceMappingURL=RAGManager.js.map