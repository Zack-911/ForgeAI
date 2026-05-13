import Database from 'better-sqlite3'
import { randomUUID } from 'crypto'
import { RAGDocument, RAGSearchResult } from './types'

export class RAGManager {
    private embedFn: ((text: string) => Promise<number[]>) | null = null

    constructor(
        private readonly db: Database.Database,
        private readonly topK          = 3,
        private readonly minSimilarity = 0.7,
    ) {
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS ai_rag_documents (
                id        TEXT PRIMARY KEY,
                content   TEXT NOT NULL,
                namespace TEXT NOT NULL DEFAULT 'default',
                metadata  TEXT NOT NULL DEFAULT '{}',
                embedding TEXT,
                createdAt INTEGER NOT NULL
            );
            CREATE INDEX IF NOT EXISTS idx_rag_ns ON ai_rag_documents(namespace);
        `)
    }

    setEmbedFunction(fn: (text: string) => Promise<number[]>): void {
        this.embedFn = fn
    }

    // ─── Document management ──────────────────────────────────────────────────

    async add(content: string, namespace = 'default', metadata: Record<string, string> = {}): Promise<RAGDocument> {
        const embedding = this.embedFn ? await this.embedFn(content) : null
        const doc: RAGDocument = {
            id:        randomUUID(),
            content,
            namespace,
            metadata,
            embedding,
            createdAt: Date.now(),
        }
        this.db.prepare(`
            INSERT INTO ai_rag_documents(id,content,namespace,metadata,embedding,createdAt)
            VALUES(?,?,?,?,?,?)
        `).run(doc.id, doc.content, doc.namespace, JSON.stringify(doc.metadata), doc.embedding ? JSON.stringify(doc.embedding) : null, doc.createdAt)
        return doc
    }

    async addBatch(items: { content: string; namespace?: string; metadata?: Record<string, string> }[]): Promise<number> {
        let count = 0
        for (const item of items) {
            await this.add(item.content, item.namespace, item.metadata)
            count++
        }
        return count
    }

    delete(id: string): boolean {
        return this.db.prepare('DELETE FROM ai_rag_documents WHERE id = ?').run(id).changes > 0
    }

    deleteByNamespace(namespace: string): number {
        return this.db.prepare('DELETE FROM ai_rag_documents WHERE namespace = ?').run(namespace).changes
    }

    count(namespace?: string): number {
        const row = namespace
            ? this.db.prepare('SELECT COUNT(*) as n FROM ai_rag_documents WHERE namespace = ?').get(namespace) as any
            : this.db.prepare('SELECT COUNT(*) as n FROM ai_rag_documents').get() as any
        return row.n
    }

    listNamespaces(): string[] {
        return (this.db.prepare('SELECT DISTINCT namespace FROM ai_rag_documents').all() as any[]).map(r => r.namespace)
    }

    // ─── Search ───────────────────────────────────────────────────────────────

    async search(query: string, namespace?: string, topK?: number, minSimilarity?: number): Promise<RAGSearchResult[]> {
        const k    = topK         ?? this.topK
        const minS = minSimilarity ?? this.minSimilarity

        const rows = namespace
            ? (this.db.prepare('SELECT * FROM ai_rag_documents WHERE namespace = ?').all(namespace) as any[])
            : (this.db.prepare('SELECT * FROM ai_rag_documents').all() as any[])

        if (!rows.length) return []

        if (this.embedFn) {
            return this._vectorSearch(query, rows, k, minS)
        }
        return this._keywordSearch(query, rows, k)
    }

    private async _vectorSearch(query: string, rows: any[], k: number, minS: number): Promise<RAGSearchResult[]> {
        const queryEmbed = await this.embedFn!(query)
        const results: RAGSearchResult[] = []

        for (const row of rows) {
            if (!row.embedding) continue
            const docEmbed   = JSON.parse(row.embedding) as number[]
            const similarity = this._cosineSimilarity(queryEmbed, docEmbed)
            if (similarity >= minS) {
                results.push({ document: this._deserialize(row), similarity })
            }
        }

        return results.sort((a, b) => b.similarity - a.similarity).slice(0, k)
    }

    private _keywordSearch(query: string, rows: any[], k: number): RAGSearchResult[] {
        const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
        const results: RAGSearchResult[] = []

        for (const row of rows) {
            const content = row.content.toLowerCase()
            const matches = terms.filter(t => content.includes(t)).length
            if (matches > 0) {
                results.push({
                    document:   this._deserialize(row),
                    similarity: matches / terms.length,
                })
            }
        }

        return results.sort((a, b) => b.similarity - a.similarity).slice(0, k)
    }

    private _cosineSimilarity(a: number[], b: number[]): number {
        if (a.length !== b.length) return 0
        let dot = 0, magA = 0, magB = 0
        for (let i = 0; i < a.length; i++) {
            dot  += a[i] * b[i]
            magA += a[i] ** 2
            magB += b[i] ** 2
        }
        const denom = Math.sqrt(magA) * Math.sqrt(magB)
        return denom === 0 ? 0 : dot / denom
    }

    private _deserialize(row: any): RAGDocument {
        return {
            id:        row.id,
            content:   row.content,
            namespace: row.namespace,
            metadata:  JSON.parse(row.metadata || '{}'),
            embedding: row.embedding ? JSON.parse(row.embedding) : null,
            createdAt: row.createdAt,
        }
    }

    /** Format search results as a context string for injection into prompts. */
    static formatContext(results: RAGSearchResult[]): string {
        if (!results.length) return ''
        const docs = results.map((r, i) =>
            `[Document ${i + 1}] (similarity: ${(r.similarity * 100).toFixed(0)}%)\n${r.document.content}`
        ).join('\n\n')
        return `Relevant context:\n\n${docs}\n\n---\n\nUse the above context to answer the following question:`
    }
}
