import _ from 'lodash';
import { writeFile } from 'fs/promises';
import type { Knex } from 'knex';

import { db } from 'db/client';

function importAll<T>(r: __WebpackModuleApi.RequireContext) {
  const cache: Record<string, T> = {};
  r.keys().forEach((key) => (cache[key] = r(key)));
  return cache;
}

const migrations = _.sortBy(
  _.map(
    importAll<{
      up: (db: Knex.Transaction) => Promise<void>;
      down?: (db: Knex.Transaction) => Promise<void>;
    }>(require.context('db/migrations/', true, /\.\/.+\.[jt]s$/)),
    (mod, filename) => {
      return {
        slug: filename.replace(/^.*\//, '').replace(/\.[jt]s$/, ''),
        ...mod,
      };
    },
  ),
  (v) => Number.parseInt(v.slug.split('_')[0]),
);

export const runAll = async () => {
  console.log('Starting migrations...');

  await db.transaction(async (trx) => {
    if (!(await trx.schema.hasTable('ran_migrations')))
      await trx.schema.createTable('ran_migrations', (t) => {
        t.string('slug');
        t.timestamp('ran_at').defaultTo(db.fn.now());
      });

    const table = trx<{ slug: string }>('ran_migrations');

    const existing = (await table.select('slug')).map((d) => d.slug);

    for (const { slug, up } of migrations) {
      if (existing.includes(slug)) continue;

      console.log(`Running: ${slug}`);

      await up(trx);

      await table.insert({
        slug,
      });
    }

    console.log('Done!');
  });
};

export const create = async (name: string) => {
  await writeFile(
    `./db/migrations/${Date.now()}_${name}`,
    `import type { Knex } from 'knex';

export const up = async (db: Knex.Transaction) => {};

export const down = async (db: Knex.Transaction) => {};

`,
  );
};
