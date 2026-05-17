import { ArgType, NativeFunction } from '@tryforge/forgescript';
import { ForgeAI } from '../..';

export default new NativeFunction({
  name: '$aiRagClear',
  description: 'Delete all documents in a namespace.',
  version: '1.0.0',
  brackets: false,
  unwrap: true,
  args: [
    {
      name: 'namespace',
      type: ArgType.String,
      required: true,
      rest: false,
      description: 'Namespace to delete documents from. Default: "default".'
    },
  ],
  async execute(ctx, [namespace]) {
    const ext = ctx.client.getExtension(ForgeAI, true);
    const count = await ext.engine.rag.deleteByNamespace(
      namespace ?? 'default',
    );
    return this.success(String(count));
  },
});
