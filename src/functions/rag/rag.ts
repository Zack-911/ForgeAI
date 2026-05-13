import { ArgType, NativeFunction } from '@tryforge/forgescript'
import { ForgeAI } from '../..'

export const aiRagAdd = new NativeFunction({
    name: '$aiRagAdd',
    description: 'Add a document to the local RAG store.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        { name: 'content',   type: ArgType.String, required: true,  rest: false, description: 'The document content.' },
        { name: 'namespace', type: ArgType.String, required: false, rest: false, description: 'Namespace to group documents. Default: "default".' },
    ],
    output: ArgType.String,
    async execute(ctx, [content, namespace]) {
        const ext = ctx.client.getExtension(ForgeAI, true)
        const doc = await ext.engine.rag.add(content, namespace ?? 'default')
        return this.success(doc.id)
    },
})

export const aiRagAddBatch = new NativeFunction({
    name: '$aiRagAddBatch',
    description: 'Add multiple documents at once separated by a delimiter.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        { name: 'content',   type: ArgType.String, required: true,  rest: false, description: 'All documents joined by separator.' },
        { name: 'separator', type: ArgType.String, required: false, rest: false, description: 'Separator between documents. Default: newline.' },
        { name: 'namespace', type: ArgType.String, required: false, rest: false },
    ],
    output: ArgType.Number,
    async execute(ctx, [content, separator, namespace]) {
        const ext   = ctx.client.getExtension(ForgeAI, true)
        const items = content.split(separator ?? '\n').map(c => c.trim()).filter(Boolean)
        const count = await ext.engine.rag.addBatch(items.map(c => ({ content: c, namespace: namespace ?? 'default' })))
        return this.success(String(count))
    },
})

export const aiRagDelete = new NativeFunction({
    name: '$aiRagDelete',
    description: 'Delete a RAG document by its ID.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [{ name: 'id', type: ArgType.String, required: true, rest: false }],
    execute(ctx, [id]) {
        const ext = ctx.client.getExtension(ForgeAI, true)
        return this.success(String(ext.engine.rag.delete(id)))
    },
})

export const aiRagClear = new NativeFunction({
    name: '$aiRagClear',
    description: 'Delete all documents in a namespace.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [{ name: 'namespace', type: ArgType.String, required: false, rest: false }],
    execute(ctx, [namespace]) {
        const ext   = ctx.client.getExtension(ForgeAI, true)
        const count = ext.engine.rag.deleteByNamespace(namespace ?? 'default')
        return this.success(String(count))
    },
})

export const aiRagSearch = new NativeFunction({
    name: '$aiRagSearch',
    description: 'Search the RAG store and return matching document contents joined by separator.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        { name: 'query',     type: ArgType.String, required: true,  rest: false },
        { name: 'namespace', type: ArgType.String, required: false, rest: false },
        { name: 'topK',      type: ArgType.Number, required: false, rest: false },
        { name: 'separator', type: ArgType.String, required: false, rest: false, description: 'Default: \\n---\\n' },
    ],
    output: ArgType.String,
    async execute(ctx, [query, namespace, topK, separator]) {
        const ext     = ctx.client.getExtension(ForgeAI, true)
        const results = await ext.engine.rag.search(query, namespace ?? undefined, topK ?? undefined)
        const sep     = separator ?? '\n---\n'
        return this.success(results.map(r => r.document.content).join(sep))
    },
})

export const aiRagCount = new NativeFunction({
    name: '$aiRagCount',
    description: 'Returns the number of documents in the RAG store, optionally filtered by namespace.',
    version: '1.0.0',
    brackets: false,
    unwrap: true,
    args: [{ name: 'namespace', type: ArgType.String, required: false, rest: false }],
    output: ArgType.Number,
    execute(ctx, [namespace]) {
        const ext = ctx.client.getExtension(ForgeAI, true)
        return this.success(String(ext.engine.rag.count(namespace ?? undefined)))
    },
})

export const aiRagNamespaces = new NativeFunction({
    name: '$aiRagNamespaces',
    description: 'Returns all RAG namespaces joined by separator.',
    version: '1.0.0',
    brackets: false,
    unwrap: true,
    args: [{ name: 'separator', type: ArgType.String, required: false, rest: false }],
    output: ArgType.String,
    execute(ctx, [separator]) {
        const ext = ctx.client.getExtension(ForgeAI, true)
        return this.success(ext.engine.rag.listNamespaces().join(separator ?? ', '))
    },
})

export default [
    aiRagAdd, aiRagAddBatch, aiRagDelete, aiRagClear,
    aiRagSearch, aiRagCount, aiRagNamespaces,
]
