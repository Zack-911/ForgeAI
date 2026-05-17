import { ArgType, NativeFunction } from '@tryforge/forgescript';
import { ForgeAI } from '../..';

export default new NativeFunction({
  name: '$aiRagDelete',
  description: 'Delete a RAG document by its ID.',
  version: '1.0.0',
  brackets: true,
  unwrap: true,
  args: [{
    name: 'id',
    type: ArgType.String,
    required: true,
    rest: false,
    description: 'The ID of the document to delete.'
  }],
  async execute(ctx, [id]) {
    const ext = ctx.client.getExtension(ForgeAI, true);
    return this.success(String(await ext.engine.rag.delete(id)));
  },
});
