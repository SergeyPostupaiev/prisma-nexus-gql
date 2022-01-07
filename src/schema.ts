import path from 'path';
import { applyMiddleware } from 'graphql-middleware';
import { declarativeWrappingPlugin, makeSchema } from 'nexus';
import * as types from './resolvers';
import permissions from './permissions';

export const schema = applyMiddleware(
  makeSchema({
    types,
    plugins: [declarativeWrappingPlugin({ disable: true })],
    outputs: {
      schema: path.join(__dirname, '../schema.graphql'),
      typegen: path.join(__dirname, 'schema-typegen.ts'),
    },
    contextType: {
      module: require.resolve('./context'),
      alias: 'Context',
      export: 'Context',
    },
    nonNullDefaults: {
      output: true,
    },
  }),
  permissions
);
